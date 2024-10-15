import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, MessageCircleMoreIcon } from "lucide-react";
import Link from "next/link";

interface MenuBarProps {
  className?: string;
}
const SideBar = ({ className }: MenuBarProps) => {
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
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3 p-8"
        title="Notifications"
        asChild
      >
        <Link href="/notifications">
          <Bell />
          <span className="hidden md:block">Notifications</span>
        </Link>
      </Button>
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
        <Link href="/messages">
          <Bookmark />
          <span className="hidden md:block">Saved</span>
        </Link>
      </Button>
    </div>
  );
};

export default SideBar;
