import Logo from "@/components/main/Logo";
import { Metadata } from "next";
import LoginForm from "./LoginForm";
import Link from "next/link";
import loginImage from "@/assets/login.jpg";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-xl bg-card shadow-2xl">
        {/* left side {form} */}
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <Logo className="w-28" />
          <div className="space-y-5">
            <LoginForm />
            <Link
              href="/sign-up"
              className="block text-center text-sm hover:underline"
            >
              Don&apos;t have an account ? Sign up
            </Link>
          </div>
        </div>
        {/* right side {image} */}
        <Image
          src={loginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default LoginPage;
