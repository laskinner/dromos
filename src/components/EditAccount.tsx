import React, { useEffect } from "react";
import { AuthService } from "@/lib/AuthService";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email address." }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z
    .string()
    .max(250, { message: "Bio cannot exceed 250 characters." })
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export const EditAccount: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: currentUser ?? {},
  });

  const handleLogout = async () => {
    AuthService.logout();
    setCurrentUser(null);
    toast({
      description: "Successfully logged out",
    });
  };

  useEffect(() => {
    // Update form default values if currentUser changes
    reset(currentUser ?? {});
  }, [currentUser, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.put("/api/user/update/", data);
      setCurrentUser({ ...currentUser, ...data }); // Update local user state with new data
      toast({ title: "Account updated successfully" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error updating account",
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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
      <div>
        <div className="mb-1 text-sm font-semibold text-gray-700">Required</div>
        <div className="mb-4">
          <Input
            {...register("username")}
            defaultValue={currentUser?.username}
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
            defaultValue={currentUser?.email}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm font-semibold text-gray-700">Optional</div>
        <div className="mb-4">
          <Input
            {...register("firstName")}
            defaultValue={currentUser?.firstName}
            className="w-full px-4 py-2 border rounded-md focus:outlsne-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <Input
            {...register("lastName")}
            defaultValue={currentUser?.lastName}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <Textarea
            {...register("bio")}
            defaultValue={currentUser?.bio}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.bio && (
            <p className="mt-1 text-xs text-red-500">{errors.bio.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" className="btn-primary">
        Save
      </Button>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </form>
  );
};

export default EditAccount;
