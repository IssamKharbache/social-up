import { useToast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

const LikeButton = ({ postId, initialState }: LikeButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`).json()
        : kyInstance.post(`/api/posts/${postId}/likes`).json(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);
      //modifying the cach to get optimistic updates
      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));
      return { previousState };
    },
    onError: (error, variable, context) => {
      queryClient.setQueryData<LikeInfo>(queryKey, context?.previousState);
      console.log(error);

      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong , try again later",
      });
    },
  });
  return (
    <Button
      variant="ghost"
      onClick={() => mutate()}
      className="flex items-center gap-2 rounded-full"
    >
      <HeartIcon
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes}
        <span className="hidden sm:inline">
          {" "}
          {data.likes === 1 ? "like" : "likes"}
        </span>
      </span>
    </Button>
  );
};

export default LikeButton;
