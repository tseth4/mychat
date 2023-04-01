# MYCHAT
#### by Tristan Setha
## Table of contents
- <a href="#env">Env</a>
- <a href="#hooksAndLib">Hooks and Lib</a>
- <a href="#components">Components</a>
- <a href="#pages">Pages</a>

#### Video Demo: https://www.youtube.com/watch?v=nun1Ts9YANU
#### starting server
```
yarn install
yarn dev
```

#### Description:

A chat app using Next.JS, TypeScript, NextAuth, Github OAuth, and Pusher

# Why

My main goal for the project is to learn more about Next.js with serverless functions, TypeScript, Tailwind CSS, Vercel,oauth2 authentication and real time data by building a chat application.

I decided to go with [t3-app](https://create.t3.gg/) stack since they already integrate TypeScript and social authentication pretty seamlessly.

After some research I learned that its not possible possible to maintain a websocket connection to a serverless function which Next.js on Vercel via [Vercel guides](https://vercel.com/guides/do-vercel-serverless-functions-support-websocket-connections). So I decided to try and utilize a third-party service called [Pusher](https://pusher.com/) that was recommended by [Vercel guides](https://vercel.com/guides/do-vercel-serverless-functions-support-websocket-connections), which allow us send and recieve data in real time.
**_Pusher is an API service that will provide our app with real time communication._**

<h1 id="env">#Env and configuration</h1>
### src/env/schema.mjs

And inside the env directory is where ZOD (a typescript validation library) is validating our env schema. An error will be thrown if there are any missing env variables.
Here we define our serverSchema and import our env variables.

```
export const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string() : z.string().url(),
  ),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
  PUSHER_APP_ID: z.string(),
  PUSHER_KEY: z.string(),
  PUSHER_SECRET: z.string(),
  PUSHER_CLUSTER: z.string()
});

export const serverEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GITHUB_ID: process.env.GITHUB_ID,
  GITHUB_SECRET: process.env.GITHUB_SECRET,
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  PUSHER_KEY: process.env.PUSHER_KEY,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
  PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
};


```

Then we handle validation in bother **server.mjs** and **client.mjs**.

```
import { serverSchema, serverEnv } from "./schema.mjs";
import { env as clientEnv, formatErrors } from "./client.mjs";

const _serverEnv = serverSchema.safeParse(serverEnv);

if (!_serverEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_serverEnv.error.format()),
  );
  throw new Error("Invalid environment variables");
}

for (let key of Object.keys(_serverEnv.data)) {
  if (key.startsWith("NEXT_PUBLIC_")) {
    console.warn("❌ You are exposing a server-side env-variable:", key);

    throw new Error("You are exposing a server-side env-variable");
  }
}

export const env = { ..._serverEnv.data, ...clientEnv };

```

### .env

Is where define our evironment variables for nextauth and github authentication and our pusher public server and client variables. (Pusher public keys will be in the client)

<!-- ```
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Next Auth GITHUB Provider
GITHUB_ID=
GITHUB_SECRET=

PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_CLUSTER=

``` -->

### tailwind.config.cjs

Another important file is our tailwind.config file. This is where we will be extending the default theme with our own custom colors. Tailwind provides predefined classes and we can extend and add some properties to the existing theme throughout our application.

<h1 id="hooksAndLib">#Hooks and Lib</h1>

### hooks/autoSizeTextArea.ts

**autoSizeTextArea** is a custom hook that allows us to resize our text area depending on the input.
It takes in 3 params:

- textAreaRef - which comes from a useRef that allows us to access Dom nodes
- value - which is the message we are going to send
- maxHeight - which is the maximum height the text area is allow to increase. In this case we will be increasing to 125 px;

### lib/pusher-server.ts

In the lib directory we have out pusher-server.ts which is used by our api.

<h1 id="components">#Components</h1>

The components directory has 3 files. (layout, header, and chatbox)

### components/layout.tsx

Layout is the one being used in our **\_app.tsx** file where we wrap our pages with a consistent layout.

### components/header.tsx

Header houses our sign in, and sign out logic that is also rendered in our page.
Header takes in one prop which is our pusher so we can **unsubscribe** when signing out.

```
export default function Header({ pusher }: HeaderProps) {
...
  signOut()
    .then((res) => {
      console.log(res);
      pusher.current.unsubscribe("presence-channel");
    })
    .catch((e) => {
      console.log(e);
      setError(e);
    });

};
...
```

**We also has some states:**
**Error state** in case we get an error we can append the message to the view so the user can easily see if the error message.

```
export default function Header({ pusher }: HeaderProps) {

  const [error, setError] = useState(null);
  ...
  <div>{error ? error : ""}</div>
  ...
```

We have a **theme state** that is used in our **handleSetTheme** that sets the theme with the setTheme function we have access to from our **ThemeProvider** wrapped in **\_app.tsx**. We handle setting theme with a button that toggles a moon and sun icon svg.

```
export default function Header({ pusher }: HeaderProps) {
  ...
  const { theme, setTheme } = useTheme();

  const handleSetTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };
  ...
  <a className="text-yellow cursor-pointer text-sm" onClick={() => handleSetTheme()}>
    {theme === "light" ? (
      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path .../>
      </svg>
      ) : (
      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <g .../>
        </g>
      </svg>
    )}
  </a>
```

We also have a profile image state to display signed in user that is handled by a useEffect

```
  const [profileImage, setProfileImage] = useState<string | null | undefined>(
    ""
  );

  ...
  useEffect(() => {
    if (session && session.user) {
      setProfileImage(session.user.image);
    }
  }, [session]);

  ...

  <div className="ml-2 mr-2 w-4">
    {profileImage ? <img src={profileImage} /> : ""}
  </div>
  ...
```

### components/chatbox.tsx

**Chatbox.tsx** is where our chatbox data is rendered. So chatbox’s main responsibility is to handle rendering all the data. And index.tsx (home page) is responsible for retrieving and processing the data).

**Chatbox takes 6 props passed down from our home page:**
**messageToSend** and **setMessageToSend**: These are used as the code for our **textarea** element. **messageToSend** is our value for our textarea which our **handleChange** is responsible for setting with the **setMessageToSend** function passed down from our home page (index.tsx).

```
export default function ChatBox({
  messageToSend,
  setMessageToSend,
  ...

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setMessageToSend(val);
  };
  ...
  <textarea
    onChange={handleChange}
    ref={textAreaRef}
    id="default-input"
    rows={1}
    value={messageToSend}
    className="..."

```

**handleSendMessage** which is a handler that handles our onClick event for our button. This is where we will make a post request to the api that will emit our chat-update event to our presence channel to the api we created. Then it will reset our messageToSend back to nothing after sending.

```
<button onClick={(e) => handleSendMessage(e)} className="...">
  send
</button>
```

**Chats** is all the chats that is being handled by our channel.bind(’chat-update’). **Bind** allows us to listen to channel events realtime. Inside the event we are setting our chats using

```
{chats.map((c, i) => (
  <div key={i} className="mx-2 flex flex-row items-center">
    <div className="flex w-4 justify-center">
      <img
        className="object-contain"
        src={c.image}
        alt="profile picture"
      />
    </div>
    <div className="ml-2 text-sm">{c.name}:</div>
    <div
      className={`ml-2 ${
        session && session.user && session.user.email === c.email
          ? "bg-orange"
          : "bg-lightGray"
      } rounded-lg px-2 text-pureWhite`}
    >
      {c.message}
    </div>
  </div>
))}
```

**onlineUserCount** is our online users that is displayed next to the Users label. This is also handeled by more channel binds.

```
<div className="text-sm font-medium text-darkBlueGreen dark:text-pureWhite">
  Users ({onlineUserCount}):
</div>
```

And we have our **onlineUsers** which displays all the users in the chat

```
{onlineUsers.map((user) => (
  <div className="flex flex-row" key={user.id}>
    <div className="flex w-4 justify-center">
      <img
        className="object-contain"
        src={user.image}
        alt="profile-picture"
      />
    </div>
    <div className="ml-2 text-sm"> {user.name}</div>
  </div>
))}
```

<h1 id="pages">#Pages</h1>

### src/pages

When you look at the repo inside our src directory, you’ll see a **_/pages_** directory. In Next.js each file in this directory will be associated with a route based on its name with **_src/pages/index.tsx_** being our home page. This project we’ll only be rendering one page so this is where most of our application will be. More on this later.

### src/pages/api/\*

The next.js api directory allows us to build server side api end points.  
This is where our serverless functions will be on Vercel.

### src/pages/\_app.tsx

**_src/pages/\_app.tsx_** is a Next.js "App" component that Next.js uses to initizlize pages. In this file we override this component to control page initialization. We wrap our pages with the Nextauth SessionProvider (which gives us access to our session), next ThemeProvider to provide dark mode support, and our layout component **(components/layout.tsx)** to wrap each page with a consistent layout.

### src/pages/api/index.js

Inside the **/api** directory you'll notice an **index.js** file. This will be called using the route **/api** and we will use this endpoint to handle a post request that will trigger a **chat-update** event for Pusher. This will send our message to all the clients subscribed to our **presence-channel**.

**_Presence channels build on the security of Private channels and expose the additional feature of an awareness of who is subscribed to that channel._** via [Docs](https://pusher.com/docs/channels/using_channels/presence-channels/)

**_Note: We want to be able to see users who are online while remain private so using presence channel made the most sense._**

Here we will be triggering an event called **chat-update** and within the body of the request we have data on our message, name (name of sender), email, image (github image), and meta (the type of message; in case we wanted to update the chat with activity info as well)

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

### src/pages/api/pusher/auth.js

Inside our pusher/auth.js is our user authroization end point

Looking at the [Pusher docs](https://pusher.com/docs/channels/using_channels/user-authentication/); Pusher provides us with a way to implement our own logic of identifying who are users are and what they can access to based on how we provide our authorization token.

So here we get our userSession using next auth, if they are authenticated by github aka if theyre a github user authorize them.

**randomUserId** is just hash function we create to generate a userid based on the user email.

```
# auth.js

function hash(input, digits) {
  console.log("input ", input)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % (10 ** digits));
}

export default async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const randomUserId = hash(session.user.email, 6);

  try {
    if (session) {
      const socketId = req.body.socket_id
      const channel = req.body.channel_name
      const presenceData = {
        user_id: randomUserId,
        user_info: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image
        },
      };
      // generate auth token
      const auth = pusher.authorizeChannel(socketId, channel, presenceData);
      return res.send(auth)
    } else {
      throw new Error('Unauthorized')
    }
  } catch (err) {
    console.log('Pusher Auth Error: ', err)
    res.status(403).end()
  }
}
```

### src/pages/api/auth/[...nextAuth].tsx

inside the auth/[…nextAuth].tsx file is where we configure our authentication providers for NextAuth.
In this case we are using GitHub.

```
import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    ...
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

Then we will check the **status** of our authentication by invoking the **useSession** hook from the next auth library which provides us with information about the current user.

```
  const { data: session, status } = useSession();
```

If the user is **unauthenticated** a sign-in button is rendered which when clicked invokes a function called **handleAuth** which invokes a **SignIn** function that is imported from the **Nextauth** library. This **Signin** function sends a request to the authentication server (in this case github) to verify user credentials. When successfull it creates a session for the user.

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

This is where we will keep our states using the react **useState** hook

#### We also have a useEffect:

**useEffect** is a react hook that allows you to perform side effects in functional components.

```
  const pusher: any = useRef(null);
  useEffect(() => {

    ...
  }, [status]);
```

Afterwards if pusher is instantiated we will subscribe to our **presence-channel**

```
    if (pusher.current) {
      const channel = pusher.current.subscribe("presence-channel");
```

In this **useEffect** we will make use of useRef and assign our pusher instance to it. The reason why we use useRef instead of useState is to avoid a rerender if pusher changes.

If the user is **authenticated** and there currently is no Pusher instantiate we will assign our pusher ref a new instance. We will use the route we made earlier in our api directory as the **authEndPoint** which will authenticate clients connecting to the Pusher server. This **useEffect** is invoked everytime the status of the user changes to handle not instatiating pusher if the user signs out.

```
useEffect(() => {
  ...
  if (status === "authenticated" && !pusher.current) {
    console.log("instantiating");
    pusher.current = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "api/pusher/auth",
    });
  }
  ...
}, [status]);

```

Further down the useEffect houses our channel logic. We listen to a channel event by using **bind**.
Here if pusher is successfully instantiated we can subscribe to our presense channel.

If subscription succeeds we will update our **onlineUsers** and **onlineUserCount** state.

```
channel.bind("pusher:subscription_succeeded", (members: any) => {
...
}
```

Here we listen to a member being **added** to our channel and update **onlineUsers** and our **onlineUserCount** state

```
channel.bind("pusher:member_added", async (member: any) => {
```

Here we listen to a member being **removed** or signed out of our channel and we will remove that user from our **onlineUsersState** using our helper function **removeUser** and update our **onlineUserCount** state.

```
channel.bind("pusher:member_removed", async (member: any) => {

```

Here we listen to our even **chat-update**, whenever this event is **triggered** we will take our data and add it to our **chats** state.

```
channel.bind("chat-update", function (data: ChatType) {
```

At the end of the **useEffect** when the component unmounts we will **unsubscribe** from our channel.

```
return () => {
  pusher.current.unsubscribe("presence-channel");
};
```

Our **handleSendMessage** function will send a post request using axios to our api to that will trigger our chat-update event. Then we will reset our **messageToSend** state

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

<!-- ### src/pages/api/auth/[...nextauth].ts

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
### src/pages/index.tsx (Home) -->

