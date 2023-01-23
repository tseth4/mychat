import { type NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import ChatBox from "@/components/chatbox";
import { env } from "src/env/client.mjs";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/header";

enum ChatTypeMeta {
  Message = "message",
  Activity = "activity",
}

export interface ChatType {
  name?: string;
  email?: string;
  message: string;
  image?: string;
  meta: ChatTypeMeta;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  image: string;
}

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  // console.log("Status ", status);
  let pusher: any;
  useEffect(() => {
    if (status === "authenticated") {
      pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
        authEndpoint: "api/pusher/auth",
      });
    }
  }, [status]);

  const [chats, setChats] = useState<ChatType[]>([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<UserType[]>([]);

  const handleAuth = () => {
    signIn()
      .then((res) => {
        console.log(res);
      })
      .catch((e) => console.log(e));
  };

  const addUser = (newUser: UserType) => {
    let temp = onlineUsers;
    for (const u of temp) {
      if (u.id === newUser.id) {
        return;
      }
    }
    setOnlineUsers((prevOnlineUsers) =>
      prevOnlineUsers ? [...prevOnlineUsers, newUser] : [newUser]
    );
  };
  const removeUser = (id: number) => {
    let tempOnlineUsers = onlineUsers;
    for (let i = 0; i < tempOnlineUsers.length; i++) {
      if (tempOnlineUsers[i] && tempOnlineUsers[i]?.id === id) {
        // console.log("splicing");
        tempOnlineUsers.splice(i, 1);
      }
    }
    // console.log("tempOnlineUsers", tempOnlineUsers);
    setOnlineUsers(tempOnlineUsers);
  };

  useEffect(() => {
    // console.log("home mounted");
    if (pusher) {
      // console.log("pusher available");

      const channel = pusher.subscribe("presence-channel");
      channel.bind("pusher:subscription_succeeded", (members: any) => {
        // console.log("subscribing", members);
        setOnlineUserCount(members.count);
        for (const m in members.members) {
          let temp_user = {
            id: parseInt(m),
            name: members.members[m].name,
            email: members.members[m].email,
            image: members.members[m].image,
          };
          addUser(temp_user);
        }
      });
      // console.log("index channel: ", channel);

      channel.bind("pusher:member_added", async (member: any) => {
        console.log("member added", member);
        let memberCount =
          channel && channel.members ? channel.members.count : 0;
        setOnlineUserCount(memberCount);
        let newUser = {
          id: member.id,
          name: member.info.name,
          email: member.info.email,
          image: member.info.image,
        };
        addUser(newUser);
      });

      channel.bind("pusher:member_removed", async (member: any) => {
        console.log("member removed", member);
        let memberCount =
          channel && channel.members ? channel.members.count : 0;
        setOnlineUserCount(memberCount);
        removeUser(member.id);
      });

      channel.bind("chat-update", function (data: ChatType) {
        console.log("chat update");
        const { name, email, image, message, meta } = data;
        let newMessage = { name, message, email, image, meta };
        setChats((prevChats) =>
          prevChats ? [...prevChats, newMessage] : [newMessage]
        );
      });

      return () => {
        pusher.unsubscribe("presence-channel");
      };
    }

    // when user closes, unsub from channel
  }, [status]);

  const handleSendMessage = async (e: any) => {
    // console.log("handleSendMessage: ", messageToSend);
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
};

export default Home;
