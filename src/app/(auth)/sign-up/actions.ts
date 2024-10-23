"use server";

import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { signUpSchema, SignUpValues } from "@/lib/validation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signUp = async (
  credentials: SignUpValues,
): Promise<{ error: string }> => {
  try {
    const { username, email, password } = signUpSchema.parse(credentials);
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);
    const lowerUsername = username.toLowerCase();

    //checking if user already exists
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: lowerUsername,
          mode: "insensitive",
        },
      },
    });
    if (existingUsername) {
      return { error: "Username already taken" };
    }

    //checking if email already exists
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
    if (existingEmail) {
      return { error: "Email already exists" };
    }
    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username: lowerUsername,
          displayName: lowerUsername,
          email,
          hashedPassword: passwordHash,
        },
      });
      await streamServerClient.upsertUser({
        id: userId,
        username: lowerUsername,
        name: lowerUsername,
      });
    });

    //creating session and cookie after signing up
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: "Something went wrong , Please try again later" };
  }
};
