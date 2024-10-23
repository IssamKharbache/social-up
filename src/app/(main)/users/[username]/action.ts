"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export const updateUserProfile = async (values: UpdateUserProfileValues) => {
  const validatedValues = updateUserProfileSchema.parse(values);
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  const exisitingUsername = await prisma.user.findUnique({
    where: { username: validatedValues.username },
  });

  if (exisitingUsername && user.username !== validatedValues.username)
    throw new Error("duplicateusername");
  const noSpaceUsername = validatedValues.username.replace(/\s/g, "");

  const updatedUser = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: {
        ...validatedValues,
        username: noSpaceUsername,
      },
      select: getUserDataSelect(user.id),
    });
    await streamServerClient.partialUpdateUser({
      id: user.id,
      set: {
        name: validatedValues.displayName,
        username: validatedValues.username,
      },
    });
    return updatedUser;
  });
  return updatedUser;
};

export const deleteUser = async (id: string) => {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");
  await prisma.user.delete({
    where: { id: id },
  });
};
