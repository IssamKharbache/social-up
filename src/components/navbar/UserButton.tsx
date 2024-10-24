"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import UserAvatar from "../UserAvatar";
import Link from "next/link";
import { LogOutIcon, User2Icon } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/app/context/UserProvider";

interface UserButtonProps {
  className?: string;
}

const UserButton = ({ className }: UserButtonProps) => {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { user: userContext } = useUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar
            avatarUrl={userContext?.avatarUrl || user.avatarUrl}
            size={user.avatarUrl ? 20 : 14}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 p-4 md:mr-0">
        {/* logged in user */}
        <DropdownMenuLabel>
          @
          {userContext?.username === undefined
            ? user.username
            : userContext.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* profile */}
        <Link
          href={`/users/${userContext?.username === undefined ? user.username : userContext.username}`}
        >
          <DropdownMenuItem>
            <User2Icon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        {/* logout button */}
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            logout();
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
