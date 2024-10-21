import { PostData } from "@/lib/types";
import { useState } from "react";
import { useCreateCommentMutation } from "./mutations";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, SendHorizonalIcon } from "lucide-react";

interface CommentInputProps {
  post: PostData;
}

const CommentInput = ({ post }: CommentInputProps) => {
  const [input, setInput] = useState("");
  const mutation = useCreateCommentMutation(post.id);
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    mutation.mutate(
      { post, content: input },
      {
        onSuccess: () => setInput(""),
      },
    );
  };
  return (
    <form className="flex w-full items-center gap-2 px-4" onSubmit={onSubmit}>
      <Input
        placeholder="Comment..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        variant="default"
        type="submit"
        size="icon"
        disabled={!input || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonalIcon className="size-5" />
        ) : (
          <Loader2 className="animate-spin" />
        )}
      </Button>
    </form>
  );
};

export default CommentInput;
