import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import axios from "axios";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  password1: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }), // Note the field name change to password1
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
    },
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    try {
      await axios.post("/dj-rest-auth/registration/", data);
      toast({
        title: "Login successful",
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
        <Input {...register("username")} placeholder="Username" />
        {errors.username && <p>{errors.username.message}</p>}
      </div>
      <div>
        <Input
          type="password"
          {...register("password1")}
          placeholder="Password"
        />
        {errors.password1 && <p>{errors.password1.message}</p>}
      </div>
      <button type="submit" style={{ display: "none" }} id="hidden-submit" />
    </form>
  );
};

export default CreateAccount;
