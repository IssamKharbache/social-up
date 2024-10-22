import { useSession } from "@/app/(main)/SessionProvider";
import React, { useCallback, useEffect, useState } from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";
import { Button } from "../ui/button";
import { ArrowRight, MessageCirclePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import NewChatModal from "../modals/NewChatModal";
import { useQueryClient } from "@tanstack/react-query";

interface ChatSideBarProps {
  open: boolean;
  onClose: () => void;
}
const ChatSideBar = ({ open, onClose }: ChatSideBarProps) => {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { channel } = useChatContext();
  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({ queryKey: ["unread-messages-count"] });
    }
  }, [channel?.id, queryClient]);
  const ChannelPreviewCustom = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );
  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <MenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: { members: { $in: [user.id] } },
            },
          },
        }}
        Preview={ChannelPreviewCustom}
      />
    </div>
  );
};

export default ChatSideBar;

interface MenuHeaderProps {
  onClose: () => void;
}
const MenuHeader = ({ onClose }: MenuHeaderProps) => {
  const [showChatModal, setShowChatModal] = useState(false);
  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size="icon" variant="ghost" onClick={onClose}>
            <ArrowRight className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Direct messages</h1>
        <Button
          size="icon"
          variant="ghost"
          title="start new chat"
          onClick={() => setShowChatModal(true)}
        >
          <MessageCirclePlus className="soize-5" />
        </Button>
      </div>
      {showChatModal && (
        <NewChatModal
          onOpenChange={setShowChatModal}
          onChatCreated={() => {
            setShowChatModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
