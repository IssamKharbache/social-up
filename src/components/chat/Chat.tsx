"use client";

import { useInitializeChatClient } from "@/app/(main)/messages/useInitializeChatClient";
import LoadingIndicator from "../LoadingIndicator";
import { Chat as StreamChat } from "stream-chat-react";
import ChatSideBar from "./ChatSideBar";
import ChatChannel from "./ChatChannel";
import { useTheme } from "next-themes";
import { useState } from "react";

const Chat = () => {
  const chatClient = useInitializeChatClient();
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!chatClient) {
    return <LoadingIndicator />;
  }
  return (
    <main className="relative w-full overflow-hidden rounded-2xl bg-card shadow-sm">
      <div className="absolute bottom-0 top-0 flex w-full">
        <StreamChat
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
          client={chatClient}
        >
          <ChatSideBar
            onClose={() => setSidebarOpen(false)}
            open={sidebarOpen}
          />
          <ChatChannel
            open={!sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </main>
  );
};

export default Chat;
