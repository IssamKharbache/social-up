import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { updateUserProfile } from "./action";
import { PostsPage } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserProvider";

export const useUpdateProfileMutation = () => {
  const { toast } = useToast();
  const router = useRouter();

  const queryCLient = useQueryClient();
  const { setUser } = useUser();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");
  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfile(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;
      // Update user context
      setUser({
        ...updatedUser,
        avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
      });
      const queryFilter: QueryFilters = {
        queryKey: ["post-feed"],
      };
      await queryCLient.cancelQueries(queryFilter);
      queryCLient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                      username: updatedUser.username,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );
      // Redirect to the new user profile route
      router.push(`/users/${updatedUser.username}`);
      router.refresh();

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update profile , try again later",
        variant: "destructive",
      });
    },
  });
  return mutation;
};
