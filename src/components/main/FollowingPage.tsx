"use client";

import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import Post from "../posts/Post";
import kyInstance from "@/lib/ky";
import { ShieldAlertIcon } from "lucide-react";
import { HashLoader } from "react-spinners";
import InfiniteScrollContainer from "../posts/InfiniteScrollContainer";

const FollowingPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/following",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return (
      <div className="space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <PostsSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-destructive p-3 text-center">
        <ShieldAlertIcon />
        <p className="">An error occured while loading the posts</p>
      </div>
    );
  }
  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-red-400 p-3 text-center">
        <ShieldAlertIcon />
        <p className="font-semibold">Follow more people to see posts here !</p>
      </div>
    );
  }
  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && (
        <HashLoader className="mx-auto my-3 text-primary" color="#c48abc" />
      )}
    </InfiniteScrollContainer>
  );
};

export default FollowingPage;
