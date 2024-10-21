import { CommentData } from "@/lib/types";
import { useDeleteCommentMutation } from "../comments/mutations";
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

interface DeleteCommentModalProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

export const DeleteCommentModal = ({
  comment,
  open,
  onClose,
}: DeleteCommentModalProps) => {
  const mutation = useDeleteCommentMutation();
  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Comment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment ? This action cannot be
            undone !
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={mutation.isPending}
            onClick={onClose}
            variant="secondary"
            className="rounded-full"
          >
            Cancel
          </Button>
          <LoadingButton
            loading={mutation.isPending}
            variant="destructive"
            onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}
            className="rounded-full"
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
