import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "./ReactQueryProvider";
import NextTopLoader from "nextjs-toploader";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "./api/uploadthing/core";
import { UserProvider } from "./context/UserProvider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Social up",
    default: "Social up",
  },
  description: "The full stack social media app ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistSans.className} ${geistMono.variable}`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <UserProvider>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader color="#b36ba9" showSpinner={false} />
              {children}
            </ThemeProvider>
            <Toaster />
          </ReactQueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
