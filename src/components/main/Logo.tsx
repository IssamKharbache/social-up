"use client";
import Image from "next/image";
import logo from "@/assets/logo.png";
import lightLogo from "@/assets/lightlogo.png";
import { useTheme } from "next-themes";

interface Logo {
  className?: string;
}
const Logo = ({ className }: Logo) => {
  const { theme } = useTheme();
  if (theme === "dark" || theme === "system") {
    return (
      <div className="">
        <Image
          src={lightLogo}
          alt=""
          className={`${className ? className : "w-40"}`}
        />
      </div>
    );
  }
  return (
    <div className="">
      <Image
        src={logo}
        alt=""
        className={`${className ? className : "w-40"}`}
      />
    </div>
  );
};

export default Logo;
