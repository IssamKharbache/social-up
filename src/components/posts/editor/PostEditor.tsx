"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { createPost } from "./actions";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { useSubmitPostMutation } from "./mutations";
import LoadingButton from "@/components/main/LoadingButton";
import { Attachment, useMediaUpload } from "../useMediaUpload";
import { ClipboardEvent, useRef } from "react";
import { ImagePlusIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { useUser } from "@/app/context/UserProvider";

const PostEditor = () => {
  const { user } = useSession();
  const mutation = useSubmitPostMutation();
  const { setOpenModal } = useUser();
  const {
    attachments,
    removeAttachment,
    startUpload,
    uploadProgress,
    reset: resetMediaUpload,
    isUploading,
  } = useMediaUpload();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });
  const { onClick, ...rootProps } = getRootProps();
  //configure the editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
    ],
    immediatelyRender: false,
  });
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";
  //on submit function
  const onSubmit = async () => {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments
          .map((att) => att.mediaId)
          .filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUpload();
          setOpenModal(false);
        },
      },
    );
  };
  const pasteFiles = (e: ClipboardEvent<HTMLInputElement>) => {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  };
  const { user: userContext } = useUser();
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar
          avatarUrl={userContext?.avatarUrl || user?.avatarUrl}
          className="hidden sm:inline"
        />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] min-h-[4rem] w-full overflow-y-auto rounded-xl bg-background px-5 py-3",
              isDragActive && "outline-dashed outline-primary",
            )}
            onPaste={pasteFiles}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {/* file upload */}
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      {/* post button */}
      <div className="flex items-center justify-end gap-5">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress || 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          loading={mutation.isPending}
          onClick={onSubmit}
          disabled={!input.trim() || isUploading}
          className="min-w-20 rounded-full"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
};

export default PostEditor;

interface AttachmentPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
}
const AttachmentPreviews = ({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((atta) => (
        <AttachmentPreview
          attachment={atta}
          onRemoveClick={() => removeAttachment(atta.file.name)}
          key={atta.file.name}
        />
      ))}
    </div>
  );
};
interface AddAttatchmentButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled: boolean;
}
const AddAttachmentButton = ({
  onFilesSelected,
  disabled,
}: AddAttatchmentButtonProps) => {
  const { startUpload } = useMediaUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <ImagePlusIcon size={25} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        ref={fileInputRef}
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFilesSelected(files);
            e.target.value = "";
          }
        }}
        className="sr-only hidden"
        multiple
      />
    </>
  );
};

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

const AttachmentPreview = ({
  attachment: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) => {
  const src = URL.createObjectURL(file);
  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="attachment"
          width={500}
          height={500}
          className="size-fit h-72 max-h-[30rem] w-72 rounded-xl object-cover"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-background p-1.5 text-background transition-colors hover:bg-background/60"
        >
          <X size={20} className="text-destructive" />
        </button>
      )}
    </div>
  );
};
