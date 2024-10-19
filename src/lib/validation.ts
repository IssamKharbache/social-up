import { z } from "zod";

const requiredString = (message?: string) => z.string().trim().min(1, message);
export const signUpSchema = z.object({
  email: requiredString("Email is required").email("Invalid email address"),
  username: requiredString("Username is required").regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers , undercore and dash are allowed",
  ),
  password: requiredString("Password is required").min(
    8,
    "Password must be at least 8 characters",
  ),
});
/**
 sign up types
 */
export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  username: requiredString("Username is required"),
  password: requiredString("Password is required"),
});
/* login types */
export type LoginValues = z.infer<typeof loginSchema>;

export const createPostSchema = z.object({
  content: requiredString("You can't create a post without content"),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString("Display name is required"),
  bio: z.string().max(1000, "Bio is too long"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
