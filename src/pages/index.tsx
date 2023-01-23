import { type NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import ChatBox from "@/components/chatbox";
import { env } from "src/env/client.mjs";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import axios from "axios";

const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: "api/pusher/auth",
});

export interface ChatType {
  name: string;
  email: string;
  message: string;
  image: string;
}

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersRemoved, setUsersRemoved] = useState([]);

  const handleAuth = () => {
    signIn()
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
  };

  console.log("session: ", session);

  useEffect(() => {
    const channel = pusher.subscribe("presence-channel");
    channel.bind("pusher:subscription_succeeded", (members: any) => {
      setOnlineUserCount(members.count);
    });

    TODO: channel.bind("pusher:member_added", (member: any) => {
      // setOnlineUsersCount(channel?.members?.count);
      // setUsersRemoved([...prevState, member.info.name]);
    });

    channel.bind("chat-update", function (data: any) {
      const { name, email, image, message } = data;
      setChats([...chats, { name, message, email, image }]);
    });

    console.log("index channel: ", channel);

    // when user closes, unsub from channel
    return () => {
      pusher.unsubscribe("presence-channel");
    };
  }, []);

  const handleSendMessage = async (e: any) => {
    console.log("handleSendMessage: ", messageToSend);
    e.preventDefault();
    await axios.post("/api", {
      message: messageToSend,
      name: session && session.user ? session.user.name : "",
      email: session && session.user ? session.user.email : "",
      image: session && session.user ? session.user.image : "",
    });
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <>
        <div className="text-white">Not signed in</div> <br />
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
      </>
    );
  }

  // TODO: handle props
  return (
    <>
      <ChatBox
        messageToSend={messageToSend}
        setMessageToSend={setMessageToSend}
        handleSendMessage={handleSendMessage}
        chats={chats}
      />
    </>
  );
};

export default Home;
