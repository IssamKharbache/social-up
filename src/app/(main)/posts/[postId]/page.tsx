import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import Linkify from "@/components/Linkify";
import Post from "@/components/posts/Post";
import LoadingSkeletonFollowSugg from "@/components/skeletons/LoadingSkeletonFollowSugg";
import UserAvatar from "@/components/UserAvatar";
import UserToolTip from "@/components/UserToolTip";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import { Loader2, ShieldAlertIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

interface PageProps {
  params: { postId: string };
}

const getPost = cache(async (postId: string, loggedInUser: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUser),
  });
  if (!post) return notFound();
  return post;
});

export const generateMetadata = async ({ params: { postId } }: PageProps) => {
  const { user } = await validateRequest();
  if (!user) return {};
  const post = await getPost(postId, user.id);
  return {
    title: `${post.user.displayName} : ${post.content.slice(0, 50)}...`,
  };
};
const SinglePostPage = async ({ params: { postId } }: PageProps) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-destructive p-3 text-center">
        <ShieldAlertIcon />
        <p className="">You are not authorized to view this page</p>
      </div>
    );
  }
  const post = await getPost(postId, loggedInUser.id);
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSideBar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
};

export default SinglePostPage;

interface UserInfoSideBarProps {
  user: UserData;
}

const UserInfoSideBar = async ({ user }: UserInfoSideBarProps) => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return null;
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="mb-4 text-xl font-bold">About {user.displayName}</div>
      <UserToolTip user={user}>
        <Link
          className="flex items-center gap-3"
          href={`/users/${user.username}`}
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div className="">
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserToolTip>
      <Linkify>
        <p className="text-sm font-semibold">More about {user.displayName}</p>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          currentUserId={loggedInUser.id}
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            following: user._count.following,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
};
