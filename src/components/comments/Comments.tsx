import { CommentData, CommentsPage, PostData } from "@/lib/types";
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import Comment from "./Comment";
import { Button } from "../ui/button";
import LoadingIndicator from "../LoadingIndicator";
import { ShieldAlertIcon } from "lucide-react";

interface CommentsProps {
  post: PostData;
}

const Comments = ({ post }: CommentsProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/${post.id}/comments`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<CommentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });
  const comments = data?.pages.flatMap((page) => page.comments) || null;
  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load more comments
        </Button>
      )}
      {status === "pending" && <LoadingIndicator />}
      {status === "success" && comments?.length === 0 && (
        <p className="mt-4 text-center text-muted-foreground">
          Oops. No comments yet here
        </p>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-destructive p-3 text-center">
          <ShieldAlertIcon />
          <p className="">An error occured while getting comments</p>
        </div>
      )}
      <div>
        {comments?.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
