import BookmarksPage from "@/components/main/BookMarksPage";
import TrendsSideBar from "@/components/TrendsSideBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Your bookmarks",
};

const page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-xl font-bold">Bookmarks</h1>
        </div>
        <BookmarksPage />
      </div>

      <TrendsSideBar />
    </main>
  );
};

export default page;
