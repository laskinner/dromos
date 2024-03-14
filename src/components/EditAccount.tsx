// Assuming you have defined a UserType elsewhere in your application
import { useContext, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios"; // Make sure to import AxiosError
import { CurrentUserContext, UserType } from "@/App";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  // Omitting password for simplicity in this example
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z
    .string()
    .max(250, { message: "Bio cannot exceed 250 characters." })
    .optional(),
});

// Ensure your component receives any props as needed
const EditAccount: React.FC = () => {
  const currentUser = useContext<UserType | null>(CurrentUserContext);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    // This will correctly handle an undefined currentUser
    defaultValues: currentUser || {},
  });

  useEffect(() => {
    // This effect will update the form's default values when currentUser changes
    reset(currentUser || {});
  }, [currentUser, reset]);

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    try {
      await axios.put("/api/user/update/", data); // Ensure you have the correct endpoint
      toast({ title: "Account updated successfully" });
      console.log("Update successful", data);
      // Optionally reset form here
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // TypeScript now understands error is an AxiosError.
        console.error("Update error:", error.response?.data);
      } else {
        // Handle any other errors that might occur
        console.error("An unexpected error occurred:", error);
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
      <button type="submit" style={{ display: "none" }} id="hidden-submit" />
    </form>
  );
};

export default EditAccount;
