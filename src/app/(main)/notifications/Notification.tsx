import UserAvatar from "@/components/UserAvatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import {
  Heart,
  MessageCircleDashed,
  MessageCircleQuestion,
  User2,
} from "lucide-react";
import Link from "next/link";

interface NotificationProps {
  notification: NotificationData;
}

const Notification = ({ notification }: NotificationProps) => {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: React.ReactNode; href: string }
  > = {
    FOLLOW: {
      message: `started following you`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `commented on your post`,
      icon: (
        <MessageCircleDashed className="size-7 fill-primary text-primary" />
      ),
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: `liked your post`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.postId}`,
    },
  };
  const { message, href, icon } = notificationTypeMap[notification.type];
  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/40",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="flex items-center gap-4">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <div className="flex gap-2">
              <span className="font-bold">
                {notification.issuer.displayName}
              </span>
              <span>{message}</span>
            </div>
            {notification.post && (
              <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
                {notification.post.content}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default Notification;