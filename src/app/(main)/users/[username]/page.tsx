import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import TrendsSideBar from "@/components/TrendsSideBar";
import { Button } from "@/components/ui/button";
import FollowerAndFollowingCount from "@/components/user/FollowerAndFollowingCount";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Calendar, ShieldAlertIcon } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache, use } from "react";
import UserPostPage from "../UserPostPage";

interface UserPageProps {
  params: { username: string };
}

const getUser = cache(async (username: string, loggedInUser: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUser),
  });
  if (!user) notFound();
  return user;
});

export const generateMetadata = async ({
  params: { username },
}: UserPageProps): Promise<Metadata> => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};
  const user = await getUser(username, loggedInUser.id);
  return {
    title: `${user.displayName}'s profile (@${user.username})`,
    description: `Follow ${user.displayName} on SocialUp`,
  };
};

const UserPage = async ({ params: { username } }: UserPageProps) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-destructive p-3 text-center">
        <ShieldAlertIcon />
        <p className="">You are not authorized to view this page</p>
      </div>
    );
  }
  const user = await getUser(username, loggedInUser.id);
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s Posts
          </h2>
        </div>
        <UserPostPage userId={user.id} />
      </div>
      <TrendsSideBar />
    </main>
  );
};

export default UserPage;

interface UserPofile {
  user: UserData;
  loggedInUserId: string;
}
const UserProfile = async ({ user, loggedInUserId }: UserPofile) => {
  const followerInfo: FollowerInfo = {
    followers: user?._count.followers,
    following: user?._count.following,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };
  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      {/* user avatar */}
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full p-8"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        {/* user info  */}
        <div className="me-auto w-full space-y-3">
          <div className="">
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">@{user.username}</div>
          </div>
          {/* member since */}
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            Joined{" "}
            <span className="font-semibold">
              {formatDate(user.createdAt, "MMMM  yyyy")}
            </span>
          </div>
          {/* followers and posts info */}
          <div className="flex items-center justify-between gap-4">
            {/* followers and following */}
            <div className="flex gap-4">
              {/* followers */}
              <FollowerAndFollowingCount
                typeOfFollow="Followers"
                userId={user.id}
                initialState={followerInfo}
              />
              {/* following */}
              <FollowerAndFollowingCount
                typeOfFollow="Following"
                userId={user.id}
                initialState={followerInfo}
              />
            </div>
            {/* posts */}
            <div className="">
              <div className="flex items-center gap-1">
                <span className="font-bold">
                  {formatNumber(user._count.posts)}
                </span>
                <span>Posts</span>
              </div>
            </div>
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button className="rounded-full">Edit Profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      )}
    </div>
  );
};
