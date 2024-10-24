import Logo from "@/components/main/Logo";
import ThemeChanger from "@/components/main/ThemeChanger";
import MobileSearch from "@/components/MobileSearch";
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
          <Logo className="w-24 md:w-36" />
        </Link>
        {/* search bar */}
        <div className="hidden md:block">
          <SearchBar />
        </div>
        <div className="md:hidden">
          <MobileSearch />
        </div>

        <div className="flex items-center gap-4">
          {/* theme  */}
          <ThemeChanger />
          {/* user button */}
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
