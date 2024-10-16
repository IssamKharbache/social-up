import { PostData } from "@/lib/types";
import { useDeletePostMutation } from "../posts/mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../main/LoadingButton";
import { Button } from "../ui/button";

interface DeletePostModalProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}

const DeletePostModal = ({ post, open, onClose }: DeletePostModalProps) => {
  const mutation = useDeletePostMutation();
  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post ? This action cannot be
            undone !
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={mutation.isPending}
            onClick={onClose}
            variant="outline"
          >
            Cancel
          </Button>
          <LoadingButton
            loading={mutation.isPending}
            variant="destructive"
            onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostModal;
