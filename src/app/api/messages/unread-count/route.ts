import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";
import { MessageCountInfo } from "@/lib/types";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { total_unread_count } = await streamServerClient.getUnreadCount(
      user.id,
    );
    const data: MessageCountInfo = {
      unreadCount: total_unread_count,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
