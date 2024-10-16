"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export const deletePost = async (id: string) => {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });
  //check if there is no post
  if (!post) throw new Error("Post not found");
  //check if the user trying to delete the post is the owner
  if (post.userId !== user.id)
    throw new Error("You are not the owner of this post");

  //delete post
  const deletedPost = await prisma.post.delete({
    where: {
      id,
    },
    include: postDataInclude,
  });
  return deletedPost;
};
