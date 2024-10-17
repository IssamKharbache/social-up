"use client";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface FollowerAndFollowingCountProps {
  userId: string;
  initialState: FollowerInfo;
  typeOfFollow: string;
}

const FollowerAndFollowingCount = ({
  userId,
  initialState,
  typeOfFollow,
}: FollowerAndFollowingCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);
  console.log(data.followers);

  return (
    <div className="flex items-center gap-1">
      <span className="font-bold">
        {typeOfFollow === "Followers"
          ? formatNumber(data.followers)
          : formatNumber(data.following)}
      </span>
      <span>{typeOfFollow}</span>
    </div>
  );
};

export default FollowerAndFollowingCount;
