import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export const GET = async () => {
  try {
    const { user } = await validateRequest();
    console.log("Calling get token for user", user?.displayName);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamServerClient.createToken(
      user.id,
      expirationTime,
      issuedAt,
    );
    return Response.json({ token });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
