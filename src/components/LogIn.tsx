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

const LogIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { toast } = useToast();

  // Inside your LogIn component or wherever the login form submission is handled
  const setCurrentUser = useContext(SetCurrentUserContext);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    try {
      const response = await axios.post("/dj-rest-auth/login/", data);
      const token = response.data.key; // Assuming token is under `key`
      localStorage.setItem("token", token); // Save the token for future requests

      // Update the current user state with the logged in user's information
      // This assumes the backend returns user info along with the token
      // Adjust according to your actual API response structure
      if (setCurrentUser) {
        setCurrentUser(response.data.user);
      }

      toast({
        title: "Login successful",
      });
      console.log("Login successful", response.data);

      reset(); // Resets the form fields after successful login
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data);
      } else {
        console.error("An unexpected error occurred:", error);
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
