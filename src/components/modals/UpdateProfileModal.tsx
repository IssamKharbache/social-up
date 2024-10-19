import { UserData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useForm } from "react-hook-form";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfileMutation } from "@/app/(main)/users/[username]/mutations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import LoadingButton from "../main/LoadingButton";
import Image, { StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { Label } from "../ui/label";
import defaultAvatar from "@/assets/avatar.png";
import { CameraIcon } from "lucide-react";
import CropImageModal from "../CropImageModal";
import Resizer from "react-image-file-resizer";

interface UpdateProfileModalProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const UpdateProfileModal = ({
  user,
  open,
  onOpenChange,
}: UpdateProfileModalProps) => {
  const [croppedAvatar, setCroppedAvatar] = useState<Blob | null>(null);
  // form hook initialization
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayName: user.displayName,
      bio: user.bio || "",
    },
  });
  // mutation hook
  const mutation = useUpdateProfileMutation();
  //on submit function

  const onSubmit = async (values: UpdateUserProfileValues) => {
    const newAvatarFile = croppedAvatar
      ? new File([croppedAvatar], `avatar_${user.id}.webp`)
      : undefined;
    mutation.mutate(
      {
        values,
        avatar: newAvatarFile,
      },
      {
        onSuccess: () => {
          setCroppedAvatar(null);
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <AvatarInput
            croppedAvatar={croppedAvatar}
            userAvatar={user.avatarUrl}
            src={
              croppedAvatar
                ? URL.createObjectURL(croppedAvatar)
                : user.avatarUrl || defaultAvatar
            }
            onImageCropped={setCroppedAvatar}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type a bit about yourself"
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileModal;

interface AvatarInputProps {
  src: string | StaticImageData;
  onImageCropped: (blob: Blob | null) => void;
  userAvatar: string | null | undefined;
  croppedAvatar: Blob | null;
}

const AvatarInput = ({
  src,
  onImageCropped,
  croppedAvatar,
  userAvatar,
}: AvatarInputProps) => {
  const [imageToCrop, setImageToCrop] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onImageSelected = (image: File | undefined) => {
    if (!image) return;
    Resizer.imageFileResizer(
      image,
      1024,
      1024,
      "WEBP",
      100,
      0,
      (uri) => setImageToCrop(uri as File),
      "file",
    );
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onImageSelected(e.target?.files?.[0])}
        accept="image/*"
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block"
      >
        <Image
          src={src}
          alt="Avatar"
          className={`${croppedAvatar || userAvatar ? "rounded-full" : "p-5"} flex-none object-cover`}
          width={150}
          height={150}
        />
        <span className="absolute inset-0 m-auto flex items-center justify-center rounded-full bg-black bg-muted-foreground/10 bg-opacity-30 p-2 text-muted-foreground text-white transition-colors duration-200 group-hover:bg-opacity-50">
          <CameraIcon size={30} />
        </span>
      </button>
      {imageToCrop && (
        <CropImageModal
          src={URL.createObjectURL(imageToCrop)}
          cropAscpectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}
    </>
  );
};
