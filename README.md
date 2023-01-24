# "MYCHAT"
#### Video Demo:  <URL HERE>
#### Description:
 A chat app using Next.JS, TypeScript, NextAuth, Github OAuth, and Pusher

### Why
My main goal for the project is to learn more about social authentication and real time data by building a chat application that is secured using oauth.

I decided to go with Next.js specifically the t3 stack since they already integrate social authentication pretty seamlessly out of the box. I'm also just curious about what all the hype is about with this stack.

<!-- while also learning more about Next.js with serverless functions, social authentication, tailwind, and websockets. I figured the best project for that would be to build a chat application. -->

After some research I learned that its not possible possible to maintain a websocket connection to a serverless function which next.js uses. I decided to try and utilize a third-party servuce called Pusher which allow us send and recieve data in real time.

reference: https://vercel.com/guides/do-vercel-serverless-functions-support-websocket-connections
### src/pages/_app.tsx
_app.tsx is a next.js "App" component that next.js uses to initizlize pages. In this file we override this component to control page initialization to wrap our our pages with the nextauth SessionProvider (which gives us access to our session), next ThemeProvider to provide dark  mode support, and our layout component **(components/layout.tsx)** to wrap each page with a consistent layout.

### src/pages/api/index.js
This is the api end point where we will send and HTTP post request that will take data from the body. to a pusher trigger which will trigger our event called 'chat-update' in our 'presense-channel'. via [Docs](https://pusher.com/docs/channels/using_channels/presence-channels/): ***Presence channels build on the security of Private channels and expose the additional feature of an awareness of who is subscribed to that channel.*** 

*Note: We want to be able to see users who are online while remain private so using presence channel made the mot sense.*

Here we will be triggering an even called chat update along with message, name (name of sender), email, image (github image), and meta (the type of message; in case we wanted to update the chat with activity info as well)

```
import { pusher } from "@/lib/pusher-server.ts"

export default async function handler(req, res) {
  const { message, name, email, image,meta } = req.body
  await pusher.trigger('presence-channel', 'chat-update', {
    message,
    name,
    email,
    image,
    meta
  })
  res.json({ status: 200 })
}
```

### src/pages/index.tsx
The home page (src/pages/index.tsx) is where most of the magic happens. At the top we define the types we will be using:
```
// this is the enums used to define the type of message for ChatType
enum ChatTypeMeta {
  Message = "message",
  Activity = "activity",
}

// this will be the data that our  messages will contain
export interface ChatType {
  name?: string;
  email?: string;
  message: string;
  image?: string;
  meta: ChatTypeMeta;
}

// this will be the type we will to define our online users
export interface UserType {
  id: number;
  name: string;
  email: string;
  image: string;
}

```


Then we will check the status of our authentication by invoking the useSession hook from the next auth library which provides us with information about the current user.
```
  const { data: session, status } = useSession();
```

If the user is "unauthenticated" a Sign in button is rendered which when clicked invokes a function called "handleAuth" which invokes a signIn function that is imported from the next auth library. This sign in function sends a request to the authentication server(in this case github) to verify user credentials. When successfull it creates a session for the user.

```
import { useSession, signIn } from "next-auth/react";
...
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col">
        <div className="text-white">Not signed in</div>
        <div className="border-0 text-center rounded-md bg-orange mt-4">
          <a
            href={`/api/auth/signin`}
            className="text-white"
            onClick={(e) => {
              e.preventDefault();
              handleAuth();
            }}
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

```
##### our state
```
const [chats, setChats] = useState<ChatType[]>([]);
const [messageToSend, setMessageToSend] = useState("");
const [onlineUserCount, setOnlineUserCount] = useState(0);
const [onlineUsers, setOnlineUsers] = useState<UserType[]>([]);
```
This is where we will keep our states using the react useState hook
##### We also have two 'useEffects':
useEffect is a react hook that allows you to perform side effects in functional components.
```
  let pusher: any;

  useEffect(() => {
    if (status === "authenticated") {
      pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
        authEndpoint: "api/pusher/auth",
      });
    }
  }, [status]);
```
In this **useEffect** we will assign pusher assign pusher to a new instance of pusher if the user is **authenticated**, we will put the route we made earlier in our api directory as the **authEndPoint** which will authneticate clients connecting to the Pusher server. This **useEffect** is invoked everytime the status of the user changes so if we are sign out pusher remains 'null' 

```
useEffect(() => {
    if (pusher) {
      const channel = pusher.subscribe("presence-channel");
      ...

}, [status]);

```
This second **useEffect** houses our channel logic.
Here if pusher is successfully instantiated we can subscribe to our presense channel.

```
channel.bind("pusher:subscription_succeeded", (members: any) => {
...
}
```
Here we listen to a channel event by using **bind**. If subscription succeeds we will update our **onlineUsers** and **onlineUserCount** state. 
```
channel.bind("pusher:member_added", async (member: any) => {
```
Here we listen to a member being **added** to our channel and update **onlineUsers** and our **onlineUserCount** state
```      
channel.bind("pusher:member_removed", async (member: any) => {

```
Here we listen to a member being **removed** or signed out of our channel and we will remove that user from our **onlineUsersState** using our helper function **removeUser** and update our **onlineUserCount** state.
```
channel.bind("chat-update", function (data: ChatType) {
```
Here we listen to our even **chat-update**, whenever this event is **triggered** we will take our data and add it to our **chats** state.
```
return () => {
  pusher.unsubscribe("presence-channel");
};
```
At the end of the **useEffect** when the component unmounts we will **unsubscribe** from our channel.
```
  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    await axios.post("/api", {
      message: messageToSend,
      name: session && session.user ? session.user.name : "",
      email: session && session.user ? session.user.email : "",
      image: session && session.user ? session.user.image : "",
      meta: ChatTypeMeta.Message,
    });
    setMessageToSend("");
  };
```
Our **handleSendMessage** function will send a post request using axios to our api to that will trigger our chat-update event. Then we will reset our **messageToSend** state

### components/chatbox.tsx, header.tsx
chatbox will be in charge of how our data is rendered in the browser


We will pass in our data via props from index.tsx and render appropriately
```
// index.tsx
  return (
    <div>
      <Header pusher={pusher} />
      <ChatBox
        messageToSend={messageToSend}
        setMessageToSend={setMessageToSend}
        handleSendMessage={handleSendMessage}
        chats={chats}
        onlineUserCount={onlineUserCount}
        onlineUsers={onlineUsers}
      />
    </div>
  );
```
Our **header.tsx** will be above our chatbox which gives users the affordance to toggle **dark mode** and **sign out.**

### src/api/auth/[...nextauth].ts

This is where our next auth providers are configured. In this case we are configuring our github client id and secret. We use a library called zod inside our **src/env** to validate our env files.

```
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export default NextAuth(authOptions);
```