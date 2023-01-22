import React from "react";

interface ChatContextData {
  channel: any;
}
export const ChatContext = React.createContext<ChatContextData>({ channel: "" });
