import Image from "next/image";
import { cn } from "@/lib/utils";
import { User2Icon } from "lucide-react";
interface UserAvatar {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}
const UserAvatar = ({ avatarUrl, size, className }: UserAvatar) => {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt="avatar"
        width={size ?? 48}
        height={size ?? 48}
        className={cn(
          "aspect-square h-fit flex-none rounded-full bg-secondary object-center",
          className,
        )}
      />
    );
  } else {
    return (
      <div className="aspect-square h-fit flex-none rounded-full bg-secondary object-center p-2">
        <User2Icon />
      </div>
    );
  }
};

export default UserAvatar;
