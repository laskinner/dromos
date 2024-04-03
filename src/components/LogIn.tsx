import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useUserStore } from "@/stores/useUserStore"; // Import Zustand store hook
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

type FormData = z.infer<typeof formSchema>;

const LogIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();
  const { setCurrentUser } = useUserStore(); // Use Zustand store for setting the current user

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
      reset(); // Resets the form fields after successful login
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div>
        <p className="text-sm text-gray-600 font-medium mb-2">
          Log in or create account below.
        </p>
      </div>
      <div>
        <Input {...register("username")} placeholder="Username" />
        {errors.username && <p>{errors.username.message}</p>}
      </div>
      <div>
        <Input
          type="password"
          {...register("password")}
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <Button type="submit" className="btn-primary">
        Log In
      </Button>
      {/* Customize with your styling */}
    </form>
  );
};

export default LogIn;
