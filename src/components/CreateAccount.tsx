import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password1: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }), // Note the field name change to password1
  password2: z
    .string()
    .min(6, { message: "Confirm Password must match Password." }), // Note the field name change to password2
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z
    .string()
    .max(250, { message: "Bio cannot exceed 250 characters." })
    .optional(),
});

const CreateAccount: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password1: "",
      password2: "",
      firstName: "",
      lastName: "",
      bio: "",
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    try {
      await axios.post("/dj-rest-auth/registration/", data);
      toast({
        title: "Account created successfully",
      });
      console.log("Registration successful", data);
      reset(); // Reset the form fields
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Registration error:", error.response?.data);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div>
        <label htmlFor="username">Username (required)</label>
        <Input {...register("username")} placeholder="Username" />
        {errors.username && <p>{errors.username.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email (required)</label>
        <Input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password (required)</label>
        <Input
          type="password"
          {...register("password1")}
          placeholder="Password"
        />
        {errors.password1 && <p>{errors.password1.message}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password (required)</label>
        <Input
          type="password"
          {...register("password2")}
          placeholder="Confirm password"
        />
        {errors.password2 && <p>{errors.password2.message}</p>}
      </div>
      <div>
        <label htmlFor="firstName">First Name (optional) </label>
        <Input {...register("firstName")} placeholder="First Name" />
        {/* No validation error for optional fields unless needed */}
      </div>
      <div>
        <label htmlFor="lastName">Last Name (optional)</label>
        <Input {...register("lastName")} placeholder="Last Name" />
        {/* No validation error for optional fields unless needed */}
      </div>
      <div>
        <label htmlFor="bio">Bio (optional) </label>
        <Textarea
          {...register("bio")}
          placeholder="Enter any bio details about yourself"
        />
        {errors.bio && <p>{errors.bio.message}</p>}
      </div>
      <button type="submit" style={{ display: "none" }} id="hidden-submit" />
    </form>
  );
};

export default CreateAccount;
