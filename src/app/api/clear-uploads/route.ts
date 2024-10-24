import prisma from "@/lib/prisma";
import { UTApi } from "uploadthing/server";

export const GET = async (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json(
        { message: "Invalid authorization header" },
        { status: 401 },
      );
    }
    const unusedMedia = await prisma.media.findMany({
      where: {
        postId: null,
        ...(process.env.NODE_ENV === "production"
          ? {
              //checking if the upload is older than 24 hours
              createdAt: {
                lte: new Date(Date.now() - 1000 * 60 * 60 * 24),
              },
            }
          : {}),
      },
      select: {
        id: true,
        url: true,
      },
    });
    //delete unused media from uploadthing
    new UTApi().deleteFiles(
      unusedMedia.map(
        (media) =>
          media.url.split(
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          )[1],
      ),
    );
    await prisma.media.deleteMany({
      where: {
        id: {
          in: unusedMedia.map((media) => media.id),
        },
      },
    });
    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
