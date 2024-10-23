import TrendsSideBar from "@/components/TrendsSideBar";
import { Metadata } from "next";
import SearchResultPage from "./SearchResult";

interface SearchPageProps {
  searchParams: { query: string };
}

export const generateMetadata = ({
  searchParams: { query },
}: SearchPageProps): Metadata => {
  return {
    title: `Search results for "${query}"`,
    description: `Search results for "${query}"`,
  };
};
const page = ({ searchParams: { query } }: SearchPageProps) => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-xl font-bold">
            Search results for &quot;{query}&quot;
          </h1>
        </div>
        <SearchResultPage query={query} />
      </div>

      <TrendsSideBar />
    </main>
  );
};

export default page;
