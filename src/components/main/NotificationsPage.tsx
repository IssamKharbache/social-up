"use client";

import { NotificationsPage, PostsPage } from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import Post from "../posts/Post";
import kyInstance from "@/lib/ky";
import { ShieldAlertIcon } from "lucide-react";
import { HashLoader } from "react-spinners";
import InfiniteScrollContainer from "../posts/InfiniteScrollContainer";
import Notification from "@/app/(main)/notifications/Notification";
import { useEffect } from "react";

const NotificationsPageComponent = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () =>
      kyInstance.patch("/api/notifications/marked-as-read").json(),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notifications-count"], {
        unreadCount: 0,
      });
    },
    onError: () => {
      console.log("Failed to mark notifications as read");
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

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
        <p className="">An error occured while loading bookmarks</p>
      </div>
    );
  }
  if (status === "success" && !notifications.length && !hasNextPage) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-red-200 p-3 text-center">
        <ShieldAlertIcon />
        <p className="font-semibold">You have no notifications </p>
      </div>
    );
  }
  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {notifications.map((notification) => (
        <Notification notification={notification} key={notification.id} />
      ))}
      {isFetchingNextPage && (
        <HashLoader className="mx-auto my-3 text-primary" color="#c48abc" />
      )}
    </InfiniteScrollContainer>
  );
};

export default NotificationsPageComponent;
