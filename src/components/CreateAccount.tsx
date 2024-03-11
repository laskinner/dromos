import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input, Textarea } from "@/components/ui/input"; // Assuming Textarea is available for bio

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

interface CreateAccountFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
}

const CreateAccount: React.FC = () => {
  const form = useForm<CreateAccountFormData>({
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

  const onSubmit: SubmitHandler<CreateAccountFormData> = (data) => {
    // Implement your submission logic here
    toast({
      title: "Account created successfully",
    });
    console.log(data);
  };

  return (
    <FormProvider {...form}>
      {" "}
      {/* Spread the form object to the FormProvider */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = form.getValues(); // Directly get form values
          onSubmit(data); // Call your onSubmit handler with form data
        }}
        className="grid gap-4 py-4"
      >
        {/* Username */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Additional fields follow a similar pattern */}
        {/* Email, Password, ConfirmPassword, FirstName, LastName, Bio */}
        {/* For brevity, only username field is shown; replicate for others */}
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Create account</Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </FormProvider>
  );
};

export default CreateAccount;
