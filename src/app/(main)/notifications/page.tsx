import BookmarksPage from "@/components/main/BookMarksPage";
import NotificationsPageComponent from "@/components/main/NotificationsPage";
import TrendsSideBar from "@/components/TrendsSideBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your Notifications",
};

const page = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-xl font-bold">Notifications</h1>
        </div>
        <NotificationsPageComponent />
      </div>
      <TrendsSideBar />
    </main>
  );
};

export default page;
