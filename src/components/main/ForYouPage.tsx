"use client";

import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import Post from "../posts/Post";

const ForYouPage = () => {
  const query = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: async () => {
      const res = await fetch("/api/posts/for-you");
      if (!res.ok) {
        throw Error(`Request failed with status code ${res.status}`);
      }
      return res.json();
    },
  });

  if (query.status === "pending") {
    return <PostsSkeleton />;
  }
  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading the posts
      </p>
    );
  }
  return (
    <>
      {query.data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
};

export default ForYouPage;
