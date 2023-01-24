import React, { useRef } from "react";
import autoSizeTextArea from "@/hooks/autoSizeTextArea";
import { ChatType, UserType } from "src/pages";
import { useSession } from "next-auth/react";

interface ChatBoxProps {
  messageToSend: string;
  setMessageToSend: (msg: string) => void;
  handleSendMessage: (e: any) => void;
  chats: ChatType[];
  onlineUserCount: number;
  onlineUsers: UserType[];
}

export default function ChatBox({
  messageToSend,
  setMessageToSend,
  handleSendMessage,
  chats,
  onlineUserCount,
  onlineUsers,
}: ChatBoxProps) {
  const { data: session } = useSession();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  autoSizeTextArea(textAreaRef.current, messageToSend, 125);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setMessageToSend(val);
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="flex h-96 w-40 flex-col rounded-l-lg bg-pureWhite p-5 dark:bg-blackGradient">
          <div className="text-sm font-medium text-darkBlueGreen dark:text-pureWhite">
            Users ({onlineUserCount}):
          </div>
          <div className="mt-2">
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
          </div>
        </div>
        <div className="flex h-96 w-96 flex-col rounded-r-lg border-l-2 border-l-paleBlueGreen bg-pureWhite p-5 dark:border-0 dark:bg-blackGradient">
          <div className="text-sm font-medium text-darkBlueGreen dark:text-pureWhite">
            Chat:
          </div>
          <div className="h-32 grow pt-2 pb-2 dark:text-pureWhite">
            <div className="flex h-full flex-col gap-2 overflow-y-auto rounded-lg border-2 border-paleBlueGreen	bg-pureWhite pt-2 dark:border-0 dark:bg-darkBlue dark:text-white">
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
            </div>
          </div>
          <div className="min-h-10 flex flex-row gap-4 dark:text-pureWhite">
            <textarea
              onChange={handleChange}
              ref={textAreaRef}
              id="default-input"
              rows={1}
              value={messageToSend}
              className="
            dark:placeholder-gray-400 
            dark:focus:border-blue-500 
            block 
            w-full 
            rounded-lg 
            border-2 
            border-paleBlueGreen 
            p-2.5
            text-sm
            focus:outline-4
            dark:border-0
            dark:bg-darkBlue 
            dark:text-white"
            />
            <div className="flex items-end">
              <button
                onClick={(e) => handleSendMessage(e)}
                className="h-7 w-20 rounded-lg bg-orange align-bottom text-sm text-pureWhite"
              >
                send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
