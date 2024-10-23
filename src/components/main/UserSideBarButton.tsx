"use client";
import { useUser } from "@/app/context/UserProvider";
import { Button } from "../ui/button";

import { useSession } from "@/app/(main)/SessionProvider";
import UserAvatar from "../UserAvatar";
import { LogOutIcon, MoreHorizontalIcon, User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "@/app/(auth)/actions";

const UserSideBarButton = () => {
  const { user: userContext } = useUser();
  const { user } = useSession();
  const queryClient = useQueryClient();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full justify-between gap-4 rounded-full p-8"
          title="Profile"
        >
          <UserAvatar
            avatarUrl={userContext?.avatarUrl || user.avatarUrl}
            size={userContext?.avatarUrl || user.avatarUrl ? 24 : 14}
          />
          <div className="hidden flex-col text-start md:flex">
            <span className="line-clamp-1">
              {userContext?.displayName || user.displayName}
            </span>
            <span className="line-clamp-1 text-start text-muted-foreground">
              @{userContext?.username || user.username}
            </span>
          </div>

          <div className="hidden md:block">
            <MoreHorizontalIcon className="size-5" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[14rem] p-4">
        {/* logged in user */}

        {/* profile */}
        <Link
          href={`/users/${userContext?.username === undefined ? user.username : userContext.username}`}
        >
          <DropdownMenuItem>
            <User2Icon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="my-3" />
        {/* logout button */}
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            logout();
          }}
        >
          <LogOutIcon className="mr-2 size-4" />
          <div className="flex items-center gap-3">
            <span>Logout</span>
            <span className="line-clamp-1 font-semibold">
              @{userContext?.username || user.username}
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserSideBarButton;
