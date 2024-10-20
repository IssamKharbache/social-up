import { useToast } from "@/hooks/use-toast";
import kyInstance from "@/lib/ky";

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { BookmarkIcon, HeartIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { BookmarkInfo } from "@/lib/types";

interface BookMarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

const BookMarkButton = ({ postId, initialState }: BookMarkButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });
  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`).json()
        : kyInstance.post(`/api/posts/${postId}/bookmark`).json(),
    onMutate: async () => {
      toast({
        title: "Bookmark",
        description: `Post ${data.isBookmarkedByUser ? "removed from " : "added to"}  your bookmarks`,
      });
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);
      //modifying the cach to get optimistic updates
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));
      return { previousState };
    },
    onError: (error, variable, context) => {
      queryClient.setQueryData<BookmarkInfo>(queryKey, context?.previousState);
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
      className="flex items-center gap-2"
    >
      <BookmarkIcon
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </Button>
  );
};

export default BookMarkButton;
