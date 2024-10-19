"use client";
import { useToast } from "@/hooks/use-toast";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
  currentUserId: string; // ID of the currently logged-in user
}

import React, { useState } from "react";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";
import { Check, X } from "lucide-react";

const FollowButton = ({
  userId,
  initialState,
  currentUserId,
}: FollowButtonProps) => {
  const { toast } = useToast();
  const { data } = useFollowerInfo(userId, initialState);

  const queryClient = useQueryClient();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const queryKey: QueryKey = ["follower-info", userId];
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`).json()
        : kyInstance.post(`/api/users/${userId}/followers`).json(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      //modifying the cach to get optimistic updates
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        following: previousState?.following || 0,
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));
      // If the current user is the one performing the action, update their profile too
      if (userId !== currentUserId) {
        const currentUserKey: QueryKey = ["follower-info", currentUserId];
        const currentUserData =
          queryClient.getQueryData<FollowerInfo>(currentUserKey);

        if (currentUserData) {
          queryClient.setQueryData<FollowerInfo>(currentUserKey, () => ({
            followers: currentUserData.followers,
            following:
              currentUserData.following +
              (previousState?.isFollowedByUser ? -1 : 1), // Update following count
            isFollowedByUser: !previousState?.isFollowedByUser,
          }));
        }
      }
      return { previousState };
    },
    onError: (error, variable, context) => {
      queryClient.setQueryData<FollowerInfo>(queryKey, context?.previousState);
      console.log(error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong , try again later",
      });
    },
  });
  if (data.isFollowedByUser) {
    return (
      <Button
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        onClick={() => mutate()}
        className={`${isButtonHovered ? "hover:bg-red-100" : ""} rounded-full duration-300`}
        variant={"secondary"}
      >
        {isButtonHovered ? (
          <div className="flex items-center gap-2">
            <span>Unfollow</span>
            <X className="size-4 text-red-500" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Followed</span>
            <Check className="size-4 text-green-500" />
          </div>
        )}
      </Button>
    );
  }
  return (
    <Button className="rounded-full" onClick={() => mutate()} variant="default">
      Follow
    </Button>
  );
};

export default FollowButton;
