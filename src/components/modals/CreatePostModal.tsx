import { Dialog } from "@radix-ui/react-dialog";
import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import PostEditor from "../posts/editor/PostEditor";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

const CreatePostModal = ({ open, onClose }: CreatePostModalProps) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader></DialogHeader>
        <PostEditor />
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
