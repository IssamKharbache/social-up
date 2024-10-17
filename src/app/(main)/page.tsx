import FollowingPage from "@/components/main/FollowingPage";
import ForYouPage from "@/components/main/ForYouPage";
import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSideBar from "@/components/TrendsSideBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home() {
  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouPage />
          </TabsContent>
          <TabsContent value="following">
            <FollowingPage />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSideBar />
    </div>
  );
}
