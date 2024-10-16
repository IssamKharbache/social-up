"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { createPost } from "./actions";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import "./styles.css";

const PostEditor = () => {
  const { user } = useSession();
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
    await createPost(input);
    editor?.commands.clearContent();
  };
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user?.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="max-h-[20rem] min-h-[4rem] w-full overflow-y-auto rounded-xl border-none bg-background px-5 py-3 outline-none"
        />
      </div>
      {/* post button */}
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20 rounded-full"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default PostEditor;
