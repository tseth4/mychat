import React, { useRef, useState, useEffect } from "react";
import autoSizeTextArea from "hooks/autoSizeTextArea";
import Pusher from "pusher-js";
// import * as PusherTypes from "pusher-js";
import { env } from "src/env/client.mjs";
import { useSession } from "next-auth/react";

export default function ChatBox() {
  const { data: session } = useSession();

  const [value, setValue] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  autoSizeTextArea(textAreaRef.current, value, 125);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setValue(val);
  };

  // var presenceChannel: PusherTypes.PresenceChannel;
  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: "api/pusher/auth"
    });
    const channel = pusher.subscribe("presence-channel");
    channel.bind("pusher:subscription_succeeded", function (members: any) {
      members.each(function (member: any) {
        // do something with member
        console.log(member);
      });
    });
    console.log(pusher);
  }, []);

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
            value={value}
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
            <button className="h-7 w-20 rounded-lg bg-orange align-bottom text-sm text-pureWhite">
              send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
