import { validateRequest } from "@/auth";
import NotificationButton from "@/components/notification/NotificationButton";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Bell, Bookmark, Home, MessageCircleMoreIcon } from "lucide-react";
import Link from "next/link";

interface MenuBarProps {
  className?: string;
}
const SideBar = async ({ className }: MenuBarProps) => {
  const { user } = await validateRequest();
  if (!user) return null;
  const unreadNotificationCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });
  return (
    <div className={className}>
      {/* Home */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 p-8"
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
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 p-8"
        title="Messages"
        asChild
      >
        <Link href="/messages">
          <MessageCircleMoreIcon />
          <span className="hidden md:block">Messages</span>
        </Link>
      </Button>
      {/* bookmarks */}
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 p-8"
        title="Messages"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden md:block">Saved</span>
        </Link>
      </Button>
    </div>
  );
};

export default SideBar;
