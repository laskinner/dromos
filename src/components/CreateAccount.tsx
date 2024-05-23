import React from "react";
import { LogIn } from "@/components/LogIn";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios"; // Import AxiosError from axios package
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
import axiosInstance from "@/api/axiosDefaults";

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters long." }),
    email: z.string().email("Invalid email address."),
    password1: z.string().min(6, "Password must be at least 6 characters."),
    password2: z.string().min(6, "Confirm Password must match Password."),
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
  const { setCurrentUser } = useUserStore();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Form submitted");
    const registrationData = {
      username: data.username,
      email: data.email,
      password1: data.password1,
      password2: data.password2,
      bio: data.bio,
    };

    try {
      console.log("Attempting to create account");

      const response = await axiosInstance.post(
        "/dj-rest-auth/registration/",
        registrationData,
      );

      console.log("Registration response:", response);
      toast({ variant: "success", title: "Account created successfully" });

      const loginData = { username: data.username, password: data.password1 };
      console.log("Attempting to log in");
      const loginResponse = await axiosInstance.post("/api/token/", loginData);
      const { access: accessToken, refresh: refreshToken } = loginResponse.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${accessToken}`;

      console.log("Fetching user profile");
      const userResponse = await axiosInstance.get("/api/profiles/user/");
      setCurrentUser(userResponse.data);

      toast({ variant: "success", title: "Logged in successfully" });
    } catch (error) {
      console.log("Error occurred", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const errorMessage =
          axiosError.response?.data?.detail || "An error occurred";
        console.error("Error message:", errorMessage);
        toast({
          variant: "warning",
          title: "Error",
          description: errorMessage,
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          variant: "warning",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

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
            <form
              onSubmit={(e) => {
                console.log("Form submission attempted");
                form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-8"
            >
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
                    <FormDescription>Please enter your email.</FormDescription>
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
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
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
                      <Input
                        type="password"
                        placeholder="Confirm Password"
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
