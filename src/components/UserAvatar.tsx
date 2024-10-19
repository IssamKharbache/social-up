import Image from "next/image";
import { cn } from "@/lib/utils";
import avatar from "@/assets/avatar.png";
interface UserAvatar {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}
const UserAvatar = ({ avatarUrl, size, className }: UserAvatar) => {
  return (
    <div
      className={cn(
        `h-fit rounded-full bg-secondary ${!avatarUrl && "p-2"} `,
        className,
      )}
    >
      <Image
        src={avatarUrl || avatar}
        alt="avatar"
        width={size ?? 25}
        height={size ?? 25}
        className={`h-full w-full flex-none object-cover ${avatarUrl ? "rounded-full" : ""} `}
      />
    </div>
  );
};

export default UserAvatar;
