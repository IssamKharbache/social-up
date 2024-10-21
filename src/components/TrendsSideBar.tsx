import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import LoadingSkeletonFollowSugg from "./skeletons/LoadingSkeletonFollowSugg";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";
import UserToolTip from "./UserToolTip";

const TrendsSideBar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block md:w-36 lg:w-80">
      <Suspense
        fallback={
          <>
            <Skeleton className="h-7 w-full rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingSkeletonFollowSugg key={i} />
            ))}
          </>
        }
      >
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
};

export default TrendsSideBar;

const WhoToFollow = async () => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return null;
  const userToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: loggedInUser.id,
      },
      followers: {
        none: {
          followerId: loggedInUser.id,
        },
      },
    },
    select: getUserDataSelect(loggedInUser.id),
    take: 5,
  });
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-center text-xl font-bold">You might like</div>
      {userToFollow.map((user) => (
        <div className="flex items-center justify-between" key={user.id}>
          <UserToolTip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className={`h-10 w-10`} />
              <div className="">
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserToolTip>
          <FollowButton
            currentUserId={loggedInUser.id}
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              following: user._count.following,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}
      {userToFollow && userToFollow.length === 0 && (
        <div className="text-center text-muted-foreground">
          You have no follow suggestions
        </div>
      )}
    </div>
  );
};

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
        SELECT LOWER(unnest(regexp_matches(content,'#[[:alnum:]_]+','g'))) AS hashtag,COUNT(*) AS count
        FROM posts 
        GROUP BY (hashtag)
        ORDER BY count DESC, hashtag ASC
        LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  { revalidate: 3 * 60 * 60 },
);
const TrendingTopics = async () => {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-center text-xl font-bold">Trends for you</div>
      {trendingTopics.map(({ hashtag, count }, index) => {
        const title = hashtag.split("#")[1];
        return (
          <Link key={index} href={`/hashtag/${title}`} className="block">
            <p
              title={hashtag}
              className="line-clamp-1 break-all font-semibold hover:underline"
            >
              {hashtag}
            </p>
            <p className="text-sm">
              {formatNumber(count)}
              {count === 1 ? " post" : " posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
};
