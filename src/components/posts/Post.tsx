import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";

interface PostProps {
  post: PostData;
}
const Post = ({ post }: PostProps) => {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      {/* post header */}
      <div className="flex flex-wrap gap-3">
        {/* avatar */}
        <Link href={`/users/${post.user.username}`}>
          <UserAvatar avatarUrl={post.user.avatarUrl} className="h-10 w-10" />
        </Link>
        <div>
          {/* username */}
          <Link href={`/users/${post.user.username}`}>
            <h1 className="block font-bold hover:underline">
              {post.user.displayName}
            </h1>
          </Link>
          {/* date */}
          <Link href={`/posts/${post.id}`}>
            <p className="text-[11px] text-muted-foreground hover:underline">
              {/* {formatRelativeDate(post.createdAt)} */}
            </p>
          </Link>
        </div>
      </div>
      {/* content */}
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
};

export default Post;
