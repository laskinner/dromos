"use client"; // Use client to validate form on client side

import React from "react";
import { LogIn } from "@/components/LogIn";
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
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters long." }),
    email: z.string().email("Invalid email address."),
    password1: z.string().min(6, "Password must be at least 6 characters."),
    password2: z.string().min(6, "Confirm Password must match Password."),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z.string().max(250, "Bio cannot exceed 250 characters.").optional(),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match.",
    path: ["password2"],
  });

type FormData = z.infer<typeof formSchema>;

export const CreateAccount: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const registrationData = {
      username: data.username,
      email: data.email,
      password: data.password1,
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
    };

    try {
      // Attempt to create an account
      await axios.post("/dj-rest-auth/registration/", registrationData);
      toast({ title: "Account created successfully" });

      // If account creation was successful, automatically log the user in
      const loginData = { username: data.username, password: data.password1 };
      const loginResponse = await axios.post("/api/token/", loginData);
      const { access: accessToken, refresh: refreshToken } = loginResponse.data;

      // Store tokens in local storage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Set the authorization header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Fetch and set the current user's profile
      const userResponse = await axios.get("/api/profiles/user/");
      setCurrentUser(userResponse.data); // Assuming setCurrentUser is a function from your user store to update the user state

      toast({ title: "Logged in successfully" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle errors (both for account creation and login attempt)
        const errorMessage = error.response?.data.detail || "An error occurred";
        toast({ title: "Error", description: errorMessage });
      } else {
        toast({ title: "Error", description: "An unexpected error occurred" });
      }
    }
  };

  const { setCurrentUser } = useUserStore();

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Create Account</Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto max-h-[100vh]">
          <SheetHeader>
            <SheetTitle>Create Account</SheetTitle>
            <SheetDescription>
              Enter account details or log in below.
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
                name="password1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormDescription>Please enter a password.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm Password" {...field} />
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter your first name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter your last name.
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
              <Button type="submit">Create Account</Button>
            </form>
          </Form>
          <SheetFooter>
            <SheetClose asChild>
              <LogIn />
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
