import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import ChatBox from "@/components/chatbox";

const Home: NextPage = () => {
  const { status } = useSession();
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <>Please login</>;
  }

  return (
    <>
      <ChatBox />
    </>
  );
};

export default Home;
