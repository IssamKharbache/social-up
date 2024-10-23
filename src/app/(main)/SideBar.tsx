import { validateRequest } from "@/auth";

import NotificationButton from "@/components/notification/NotificationButton";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, Home, PlusIcon } from "lucide-react";
import Link from "next/link";
import MessagesButtonComponent from "./messages/MessagesButton";
import UserSideBarButton from "@/components/main/UserSideBarButton";
import CreatePostButton from "@/components/posts/CreatePostButton";

interface MenuBarProps {
  className?: string;
}
const SideBar = async ({ className }: MenuBarProps) => {
  const { user } = await validateRequest();
  if (!user) return null;
  const [unreadNotificationCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);
  return (
    <div className={className}>
      {/* Home */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 rounded-full p-8"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden md:block">Home</span>
        </Link>
      </Button>
      {/* Notifications */}
      <NotificationButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      {/* messages  */}
      <MessagesButtonComponent
        initialState={{ unreadCount: unreadMessagesCount }}
      />
      {/* bookmarks */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 rounded-full p-8"
        title="Messages"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden md:block">Saved</span>
        </Link>
      </Button>
      {/* create post button */}
      <CreatePostButton />
      {/*  */}
      <UserSideBarButton />
    </div>
  );
};

export default SideBar;
