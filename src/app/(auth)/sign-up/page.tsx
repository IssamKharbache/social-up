import { Metadata } from "next";
import signup from "@/assets/signup.png";

import Image from "next/image";
import Logo from "@/components/main/Logo";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign up",
};

const SignupPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      {/* main div */}
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-xl bg-card shadow-2xl">
        {/*  left sife {form } */}
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-between">
              <Logo className="w-28" />
              <h1 className="text-xl font-bold">Start your journey</h1>
            </div>
            <p className="text-muted-foreground">
              A place where you can share your thoughts with the world
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link
              href="/login"
              className="block text-center text-sm hover:underline"
            >
              Already have an account ? Login
            </Link>
          </div>
        </div>
        {/*  right side {image} */}
        <Image
          src={signup}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default SignupPage;
