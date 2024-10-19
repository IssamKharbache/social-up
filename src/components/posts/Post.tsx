"use client";
import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import { PostMoreButton } from "./PostMoreButton";
import Linkify from "../Linkify";
import UserToolTip from "../UserToolTip";
import { Media } from "@prisma/client";
import Image from "next/image";

interface PostProps {
  post: PostData;
}
const Post = ({ post }: PostProps) => {
  const { user } = useSession();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        {/* post header */}
        <div className="flex flex-wrap gap-3">
          {/* avatar */}
          <UserToolTip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar
                avatarUrl={post.user.avatarUrl}
                className={`h-10 w-10`}
              />
            </Link>
          </UserToolTip>

          <div>
            {/* username */}
            <UserToolTip user={post.user}>
              <Link href={`/users/${post.user.username}`}>
                <h1 className="block font-bold hover:underline">
                  {post.user.displayName}
                </h1>
              </Link>
            </UserToolTip>

            {/* date */}
            <Link href={`/posts/${post.id}`}>
              <p className="text-[11px] text-muted-foreground hover:underline">
                {formatRelativeDate(post.createdAt)}
              </p>
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>

      {/* content */}
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachment={post.attachments} />
      )}
    </article>
  );
};

export default Post;

interface MediaPreviewsProps {
  attachment: Media[];
}
const MediaPreviews = ({ attachment }: MediaPreviewsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachment.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachment.map((media) => (
        <MediaPreview key={media.id} media={media} />
      ))}
    </div>
  );
};

interface MediaPreviewProps {
  media: Media;
}

const MediaPreview = ({ media }: MediaPreviewProps) => {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="media"
        width={500}
        height={500}
        className="mx-auto size-fit h-80 max-h-[30rem] w-80 rounded-xl object-cover"
      />
    );
  }
  if (media.type === "VIDEO") {
    return (
      <div className="">
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-xl"
        />
      </div>
    );
  }
  return <div className="text-destructive">Unsuppored media type file</div>;
};
