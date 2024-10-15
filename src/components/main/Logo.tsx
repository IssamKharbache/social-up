import Image from "next/image";
import logo from "@/assets/logo.png";

interface Logo {
  className?: string;
}
const Logo = ({ className }: Logo) => {
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
