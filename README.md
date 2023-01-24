# "MYCHAT"
#### Video Demo:  <URL HERE>
#### Description:
 A chat app using Next.JS, TypeScript, NextAuth, Github OAuth, and Pusher

#### Why
My main goal for the project is to learn more about social authentication and real time data by building a chat application that is secured using oauth.

I decided to go with Next.js specifically the t3 stack since they already integrate social authentication pretty seamlessly out of the box. I'm also just curious about what all the hype is about with this stack.

<!-- while also learning more about Next.js with serverless functions, social authentication, tailwind, and websockets. I figured the best project for that would be to build a chat application. -->

After some research I learned that its not possible possible to maintain a websocket connection to a serverless function which next.js uses. I decided to try and utilize a third-party servuce called Pusher which allow us send and recieve data in real time.

reference: https://vercel.com/guides/do-vercel-serverless-functions-support-websocket-connections
#### src/pages/_app.tsx
_app.tsx is a next.js "App" component that next.js uses to initizlize pages. In this file we override this component to control page initialization to wrap our our pages with the nextauth SessionProvider (which gives us access to our session), next ThemeProvider to provide dark  mode support, and out layout component which we use in the components directory to wrap each page with a consistent layout.

#### src/pages/api/index.js
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

#### src/pages/index.tsx
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
We also have two 'useEffects':