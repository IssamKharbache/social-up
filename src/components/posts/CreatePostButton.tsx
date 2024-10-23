"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import CreatePostModal from "../modals/CreatePostModal";
import { useUser } from "@/app/context/UserProvider";

const CreatePostButton = () => {
  const { openModal, setOpenModal } = useUser();
  return (
    <>
      <div className="hidden md:block">
        {" "}
        <Button
          onClick={() => setOpenModal(true)}
          variant="default"
          className="flex w-full items-center gap-3 rounded-full p-4 text-center text-lg"
          title="Post"
        >
          <PlusIcon className="size-4 md:hidden" />
          <span className="hidden md:block">Post</span>
        </Button>
      </div>
      {openModal && (
        <CreatePostModal open={openModal} onClose={() => setOpenModal(false)} />
      )}
    </>
  );
};

export default CreatePostButton;
