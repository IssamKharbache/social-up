"use server";

import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";
import { isRedirectError } from "next/dist/client/components/redirect";
import { verify } from "@node-rs/argon2";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (
  credentials: LoginValues,
): Promise<{ error: string }> => {
  try {
    const { username, password } = loginSchema.parse(credentials);
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    //check if user exits || check if password is incorrect
    if (!existingUser || !existingUser.hashedPassword) {
      return {
        error: "Incorrect username or password",
      };
    }
    //compare password and hashed password
    const validPassword = await verify(existingUser.hashedPassword, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    //check if password matches
    if (!validPassword) {
      return {
        error: "Incorrect username or password",
      };
    }
    //creating session and cookie after successfull login
    const session = await lucia.createSession(existingUser.id, {});
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
    return { error: "Something went wrong. Please try again latee" };
  }
};
