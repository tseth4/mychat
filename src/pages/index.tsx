import { type NextPage } from "next";
import Layout from "@/components/layout";
import Login from "@/components/login";
import { useSession, getSession } from "next-auth/react";
import ChatBox from "@/components/chatbox";
const Home: NextPage = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <>
        "Please login"
      </>
    );
  }

  return (
    <>
      <ChatBox />
    </>
  );
};

export default Home;
