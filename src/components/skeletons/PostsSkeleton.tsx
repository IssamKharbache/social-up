import React from "react";
import { Skeleton } from "../ui/skeleton";

const PostsSkeleton = () => {
  return (
    <>
      <div className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <Skeleton className="h-16 w-full" />
      </div>
    </>
  );
};

export default PostsSkeleton;
