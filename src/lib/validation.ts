import { z } from "zod";

//check if the string is empty function
const requiredString = (message?: string) => z.string().trim().min(1, message);

//sign up schema
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

//login schema
export const loginSchema = z.object({
  username: requiredString("Username is required"),
  password: requiredString("Password is required"),
});
/* login types */
export type LoginValues = z.infer<typeof loginSchema>;

//create post schema
export const createPostSchema = z.object({
  content: requiredString("You can't create a post without content"),
  mediaIds: z.array(z.string()).max(5, "You can't add more than 5 attachment"),
});

//update user schema
export const updateUserProfileSchema = z.object({
  displayName: requiredString("Display name is required"),
  bio: z.string().max(1000, "Bio is too long"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

//comment schema

export const createCommentSchema = z.object({
  content: requiredString("A comment cannot be empty"),
});
