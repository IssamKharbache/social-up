"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

const SearchBar = () => {
  const router = useRouter();
  //handle submit function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //get the query value
    const form = e.currentTarget;
    const query = (form.query as HTMLInputElement).value.trim();
    //check if query is undefined
    if (!query) return;
    //push to the search page
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };
  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input
          name="query"
          placeholder="Search..."
          className="rounded-full pe-10"
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
};

export default SearchBar;
