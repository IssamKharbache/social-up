"use client";
import { useSession } from "@/app/(main)/SessionProvider";
import { FollowerInfo, UserData } from "@/lib/types";
import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import Linkify from "./Linkify";
import FollowerAndFollowingCount from "./user/FollowerAndFollowingCount";

interface UserToolTipProps extends PropsWithChildren {
  user: UserData;
}

const UserToolTip = ({ children, user }: UserToolTipProps) => {
  const { user: loggedInUser } = useSession();
  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
    following: user._count.following,
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar avatarUrl={user.avatarUrl} size={70} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton
                  userId={user.id}
                  initialState={followerState}
                  currentUserId={loggedInUser.id}
                />
              )}
            </div>
            <div className="">
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
              </Link>
              <div className="text-muted-foreground">@{user.username}</div>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerAndFollowingCount
              userId={user.id}
              initialState={followerState}
              typeOfFollow="Followers"
            />
            <FollowerAndFollowingCount
              userId={user.id}
              initialState={followerState}
              typeOfFollow="Following"
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserToolTip;
