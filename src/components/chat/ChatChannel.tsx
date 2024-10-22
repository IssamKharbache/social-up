import { cn } from "@/lib/utils";
import React from "react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";
import { Button } from "../ui/button";
import { ArrowLeft, Menu } from "lucide-react";
interface ChatChannelProps {
  open: boolean;
  openSidebar: () => void;
}

const ChatChannel = ({ open, openSidebar }: ChatChannelProps) => {
  return (
    <div className={cn("w-full md:block", !open && "hidden")}>
      <Channel>
        <Window>
          <CustomChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
};

export default ChatChannel;

interface CustomChannelHeaderProps extends ChannelHeaderProps {
  openSidebar: () => void;
}

const CustomChannelHeader = ({
  openSidebar,
  ...props
}: CustomChannelHeaderProps) => {
  return (
    <div className={cn("flex items-center gap-3")}>
      <div className="mt-2 h-full p-2 md:hidden">
        <Button size="icon" variant="ghost" onClick={openSidebar}>
          <ArrowLeft className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
};
