import React, { useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { SetCurrentUserContext } from "@/App";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
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

  const setCurrentUser = useContext(SetCurrentUserContext);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // Updates the login endpoint to use the JWT token endpoint
      const loginResponse = await axios.post("/api/token/", data);
      // Assumes the response now includes both access and refresh tokens
      const { access: accessToken, refresh: refreshToken } = loginResponse.data;
      localStorage.setItem("accessToken", accessToken); // Store access token
      localStorage.setItem("refreshToken", refreshToken); // Optionally store refresh token

      // Sets default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // Update or remove the user data fetch
      // This assumes a separate endpoint to fetch user details
      const userResponse = await axios.get("/api/profiles/user/"); // Uses simplyjwt intstead of dj-rest
      if (setCurrentUser) {
        setCurrentUser(userResponse.data); // Update user state with fetched data
      }

      toast({ title: "Login successful" });
      console.log("Login successful", userResponse.data);
      reset(); // Resets the form fields after successful login
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data);
        toast({
          title: "Error logging in",
          description: error.response?.data.detail || "An error occurred",
        });
      } else {
        console.error("An unexpected error occurred:", error);
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
      <button type="submit" style={{ display: "none" }} id="hidden-submit" />
    </form>
  );
};

export default LogIn;
