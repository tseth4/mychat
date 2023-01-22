import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import ChatBox from "@/components/chatbox";
import { env } from "src/env/client.mjs";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { ChatContext } from "@/lib/chat-context";
// import { useContext } from "react";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: "api/pusher/auth",
});
const Home: NextPage = () => {
  // const contextData = useContext(ChatContext);
  let channel = null;
  const { status } = useSession();

  useEffect(() => {
    channel = pusher.subscribe("presence-channel");
  }, [pusher]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <>Please login</>;
  }

  return (
    <ChatContext.Provider value={{ channel: channel }}>
      <ChatBox />
    </ChatContext.Provider>
  );
};

export default Home;
