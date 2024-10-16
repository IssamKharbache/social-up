import { PostData } from "@/lib/types";
import { useState } from "react";
import DeletePostModal from "../modals/DeletePostModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";

interface PostMoreButtonProps {
  post: PostData;
  className?: string;
}

export const PostMoreButton = ({ post, className }: PostMoreButtonProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteModal(true)}>
            <span className="flex items-center gap-3 text-sm font-semibold text-destructive">
              <Trash2 className="size-4" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostModal
        post={post}
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
};
