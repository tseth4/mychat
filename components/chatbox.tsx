import React, { useRef, useState, useEffect } from "react";
import autoSizeTextArea from "hooks/autoSizeTextArea";
// import Pusher from "pusher-js";
// import { env } from "src/env/client.mjs";
import { useSession } from "next-auth/react";
import { ChatContext } from "@/lib/chat-context";
import { useContext } from "react";

export default function ChatBox() {
  const contextData = useContext(ChatContext);

  const { data: session } = useSession();

  const [messageValue, setMessageValue] = useState("");
  const [localMembers, setLocalMembers] = useState<any>([]);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  autoSizeTextArea(textAreaRef.current, messageValue, 125);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setMessageValue(val);
  };

  useEffect(() => {
    // const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
    //   cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    //   authEndpoint: "api/pusher/auth",
    // });
    // const channel = pusher.subscribe("presence-channel");
    // channel.bind("pusher:subscription_succeeded", function (members: any) {
    //   members.each(function (member: any) {
    //     setLocalMembers([...localMembers, member]);
    //   });
    // });
    // // channel.bind("pusher:member_added", memberAdded);
    // // channel.bind("pusher:member_removed", memberRemoved);
    // channel.bind("pusher:member_added", function (member: any) {
    //   console.log("pusher:member_added", member);
    //   // console.log(channel.members.count);
    // });
    // channel.bind("pusher:member_removed", function (member: any) {
    //   console.log("pusher:member_removed", member);
    //   // console.log(channel.members.count);
    // });
    // channel.bind("client-my-event", (data: any) => {
    //   console.log("data.message: ", data.message);
    // });
    // console.log(pusher);
  }, []);

  useEffect(() => {
    // const pusher = contextData.pusher;
    // const channel = pusher.subscribe("presence-channel");
    const channel = contextData.channel;
    if (channel) {
      channel.bind("pusher:subscription_succeeded", function (members: any) {
        members.each(function (member: any) {
          setLocalMembers([...localMembers, member]);
        });
      });
      // channel.bind("pusher:member_added", memberAdded);
      // channel.bind("pusher:member_removed", memberRemoved);
      channel.bind("pusher:member_added", function (member: any) {
        console.log("pusher:member_added", member);
      });
      channel.bind("client-my-event", (data: any) => {
        console.log("data.message: ", data.message);
      });
      console.log(channel);
    }
  }, [contextData]);

  useEffect(() => {
    console.log("localMembers: ", localMembers);
  }, [localMembers]);

  const handleMyEvent = () => {
    const channel = contextData.channel;
  };

  return (
    <>
      <div className="flex h-96 w-96 flex-col rounded-lg bg-mediumGray p-5 dark:bg-blackGradient">
        <div className="text-lightGray">chat:</div>
        <div className="grow pt-2 pb-2 dark:text-pureWhite">
          <div className="h-full rounded-lg bg-pureWhite p-4 dark:bg-darkBlue dark:text-white">
            messages
          </div>
        </div>
        <div className="min-h-10 flex flex-row gap-4 dark:text-pureWhite">
          <textarea
            onChange={handleChange}
            ref={textAreaRef}
            id="default-input"
            rows={1}
            value={messageValue}
            className="
            dark:placeholder-gray-400 
            dark:focus:border-blue-500 
            block 
            w-full 
            rounded-lg 
            p-2.5 
            text-sm 
            focus:outline-4
            dark:bg-darkBlue 
            dark:text-white"
          />
          <div className="flex items-end">
            <button
              onClick={() => handleMyEvent()}
              className="h-7 w-20 rounded-lg bg-orange align-bottom text-sm text-pureWhite"
            >
              send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
