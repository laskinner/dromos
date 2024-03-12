import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password must match Password." }),
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
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      bio: "",
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    toast({
      title: "Account created successfully",
    });
    console.log(data);
  };

  return (
    <form
      id="create-account-form"
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 py-4"
    >
      <div>
        <label htmlFor="username">Username</label>
        <Input {...register("username")} placeholder="Username" />
        {errors.username && <p>{errors.username.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Input
          type="password"
          {...register("password")}
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <Input
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
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
