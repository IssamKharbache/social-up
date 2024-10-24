"use client";
import { MessageCountInfo, NotificationCountInfo } from "@/lib/types";
import Link from "next/link";
import { Bell, MessageCircleMore } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Button } from "@/components/ui/button";

interface MessagesButtonProps {
  initialState: MessageCountInfo;
}

const MessagesButtonComponent = ({ initialState }: MessagesButtonProps) => {
  const { data } = useQuery({
    queryKey: ["unread-messages-count"],
    queryFn: () =>
      kyInstance.get("/api/messages/unread-count").json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 60 * 1000,
  });
  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3 rounded-full md:p-8"
      title="Notifications"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <MessageCircleMore className="size-5 md:size-7" />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary text-center text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>

        <span className="hidden md:block">Messages</span>
      </Link>
    </Button>
  );
};

export default MessagesButtonComponent;
