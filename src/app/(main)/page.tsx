import ForYouPage from "@/components/main/ForYouPage";
import Logo from "@/components/main/Logo";
import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import TrendsSideBar from "@/components/TrendsSideBar";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export default async function Home() {
  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouPage />
      </div>
      <TrendsSideBar />
    </div>
  );
}
