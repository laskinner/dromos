"use client"; // Use client validiot for form

import React from "react";
import { CreateAccount } from "@/components/CreateAccount";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";
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

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

type FormData = z.infer<typeof formSchema>;

export const LogIn: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  }); // Use `form` to capture all useForm return values

  const { toast } = useToast();
  const { setCurrentUser } = useUserStore();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const loginResponse = await axios.post("/api/token/", data);
      const { access: accessToken, refresh: refreshToken } = loginResponse.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const userResponse = await axios.get("/api/profiles/user/");
      setCurrentUser(userResponse.data); // Update Zustand store with the user data

      toast({ title: "Login successful" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error logging in",
          description: error.response?.data.detail || "An error occurred",
        });
      } else {
        toast({
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
          <Button>Log In</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Log In</SheetTitle>
            <SheetDescription>
              Enter log in details or create account below.
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please enter your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
          <SheetFooter>
            <SheetClose asChild>
              <div>
                <Button type="submit">Log In</Button>
                <hr />
                <CreateAccount />
              </div>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};
