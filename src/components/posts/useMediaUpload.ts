import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export const useMediaUpload = () => {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin: (files) => {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          { type: file.type },
        );
      });
      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);
      return renamedFiles;
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
    onClientUploadComplete: (res) => {
      setAttachments((prev) =>
        prev.map((att) => {
          const uploadResult = res.find((r) => r.name === att.file.name);
          if (!uploadResult) return att;
          return {
            ...att,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError: (error) => {
      setAttachments((prev) => prev.filter((att) => !att.isUploading));
      toast({
        variant: "destructive",
        title: "Error uploading media",
        description: error.message,
      });
    },
  });
  //start uploading
  const handleStartUpload = (files: File[]) => {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish",
      });
      return;
    }
    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload 5 files per post",
      });
      return;
    }
    startUpload(files);
  };

  //remove file
  const removeAttachment = (fileName: string) => {
    setAttachments((prev) => prev.filter((att) => att.file.name !== fileName));
  };
  //reset
  const reset = () => {
    setAttachments([]);
    setUploadProgress(undefined);
  };
  return {
    startUpload: handleStartUpload,
    attachments,
    uploadProgress,
    removeAttachment,
    reset,
    isUploading,
  };
};
