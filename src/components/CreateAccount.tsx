import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";

// Updated form schema with password confirmation logic
const formSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password1: z.string().min(6, "Password must be at least 6 characters."),
    password2: z.string().min(6, "Confirm Password must match Password."),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    bio: z
      .string()
      .max(250, { message: "Bio cannot exceed 250 characters." })
      .optional(),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match.",
    path: ["password2"], // Specify the path of the field that the error should be associated with
  });

type FormData = z.infer<typeof formSchema>;

const CreateAccount: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const postData = {
      username: data.username,
      email: data.email,
      password: data.password1, // Assuming your API expects a "password" field
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
    };

    try {
      await axios.post("/dj-rest-auth/registration/", postData);
      toast({ title: "Account created successfully" });
      reset(); // Reset the form fields after successful registration
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Registration error:", error.response?.data);
        toast({
          title: "Error creating account",
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
      <div>
        <div>
          <p className="text-sm text-gray-600 font-medium mb-2">
            Create account or log in below.
          </p>
        </div>
        <div className="mb-1 text-sm font-semibold text-gray-700">Required</div>
        <div className="mb-4">
          <Input
            {...register("username")}
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <Input
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <Input
            type="dassword"
            {...register("password1")}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password1 && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password1.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <Input
            type="password"
            {...register("password2")}
            placeholder="Confirm password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.password2 && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password2.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm font-semibold text-gray-700">Optional</div>
        <div className="mb-4">
          <Input
            {...register("firstName")}
            placeholder="First Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <Input
            {...register("lastName")}
            placeholder="Last Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <Textarea
            {...register("bio")}
            placeholder="Enter any bio details about yourself"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" className="btn-primary">
        Create Account
      </Button>
    </form>
  );
};

export default CreateAccount;
