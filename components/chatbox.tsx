import Head from "next/head";
// import Link from "next/link";
import React, { FunctionComponent, ReactNode, useRef, useState } from "react";
import autoSizeTextArea from "hooks/autoSizeTextArea";

export default function ChatBox() {
  const [value, setValue] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  autoSizeTextArea(textAreaRef.current, value);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setValue(val);
  };

  return (
    <>
      <div className="flex h-96 w-96 flex-col rounded-lg p-5 dark:bg-blackGradient">
        <div className="dark:text-pureWhite">Chat</div>
        <div className="grow border dark:text-pureWhite">messages</div>
        <div className="min-h-10 flex flex-row gap-4 dark:text-pureWhite">
          <textarea
            onChange={handleChange}
            ref={textAreaRef}
            id="default-input"
            rows={1}
            value={value}
            className="
            dark:placeholder-gray-400 
            dark:focus:ring-blue-500 
            dark:focus:border-blue-500 
            block 
            w-full 
            rounded-lg border 
            border-mediumGray 
            p-2.5 text-sm 
            dark:bg-darkBlue 
            dark:text-white"
          />
          <button className="h-fit w-20 border">send</button>
        </div>
      </div>
    </>
  );
}
