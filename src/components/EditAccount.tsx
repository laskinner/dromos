"use client"; // Use client validation for form

import React from "react";
import { AuthService } from "@/lib/AuthService";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useUserStore } from "@/stores/useUserStore";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    currentPassword: z
      .string()
      .min(6, "Current password is required.")
      .optional(),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters.")
      .optional(),
    confirmNewPassword: z
      .string()
      .min(6, "Confirm new password must match.")
      .optional(),
    bio: z.string().max(250, "Bio cannot exceed 250 characters.").optional(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match.",
    path: ["confirmNewPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export const EditAccount: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserStore();
  const { toast } = useToast();

  // Set up form with default values from currentUser
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      bio: currentUser?.content, // Map to 'content'
      // Password fields not prefilled for security reasons
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleLogout = async () => {
    try {
      AuthService.logout();
      setCurrentUser(null);
      toast({ variant: "success", description: "Successfully logged out" });
    } catch (error) {
      toast({
        title: "Logout failed",
        variant: "warning",
        description: "Unable to logout. Please try again.",
      });
    }
  };

  // Define UserUpdateData type to include 'content' instead of 'bio'
  type UserUpdateData = Omit<
    FormData,
    "confirmNewPassword" | "currentPassword" | "newPassword"
  > & {
    content?: string;
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Prepare data for submission by omitting the password fields
    const updateData: UserUpdateData = {
      username: data.username,
      email: data.email,
      content: data.bio, // Map 'bio' to 'content'
    };

    try {
      // Update user information
      await axios.put("/api/profiles/user/", updateData);
      setCurrentUser({ ...currentUser, ...data, content: data.bio }); // Update currentUser with content
      toast({ variant: "success", title: "Account updated successfully" });

      // Optional: Logout the user after password change for security reasons
      // Consider prompting the user before doing so
      if (data.newPassword) {
        await axios.post("/dj-rest-auth/password/change/", {
          old_password: data.currentPassword,
          new_password1: data.newPassword,
          new_password2: data.confirmNewPassword,
        });
        handleLogout();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "warning",
          title: "Error updating account",
          description: error.response?.data.detail || "An error occurred",
        });
      } else {
        toast({
          variant: "warning",
          title: "Error",
          description: "An unexpected error occurred",
        });
      }
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          {currentUser?.image ? (
            <img
              src={currentUser?.image}
              alt="Profile"
              className="rounded-full w-12 h-12 object-cover"
              onLoad={() => {
                /* Image loaded successfully */
              }}
              onError={(e) => {
                // Fallback to default icon if image fails to load
                e.currentTarget.src = "path_to_default_image";
              }}
            />
          ) : (
            // Fallback icon if no image URL or currentUser is null
            <i className="fa-solid fa-user text-slate-900 text-3xl cursor-pointer"></i>
          )}
        </SheetTrigger>
        <SheetContent className="overflow-y-auto max-h-[100vh]">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Change account details and save below.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Current password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please enter your current password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please enter a new password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please reenter the same password as above.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Bio" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter a short bio about yourself.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
