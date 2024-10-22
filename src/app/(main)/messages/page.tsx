import Chat from "@/components/chat/Chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages",
};

const page = () => {
  return <Chat />;
};

export default page;
