import Logo from "@/components/main/Logo";
import UserButton from "@/components/navbar/UserButton";
import SearchBar from "@/components/SearchBar";

import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-3">
        {/*  */}
        <Link href="/">
          <Logo className="w-32" />
        </Link>
        {/* search bar */}
        <SearchBar />
        {/* user button */}
        <UserButton />
      </div>
    </header>
  );
};

export default NavBar;
