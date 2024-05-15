import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Write a comment.",
  }),
});

type FormData = z.infer<typeof formSchema>;

// Updated props type to include `nodeId`
interface CommentFormProps {
  nodeId?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ nodeId }) => {
  console.log("Received Node ID in CommentForm:", nodeId);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    if (nodeId) {
      try {
        // Directly use 'data.content' now that the form field is named 'content'
        await axios.post("/api/comments/", {
          content: data.content,
          node: nodeId,
        });
        toast({ variant: "success", title: "Account created successfully" });

        form.reset(); // Reset the form after successful submission
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Failed to submit comment:", axiosError.response?.data);
        toast({
          variant: "warning",
          title: "Failed to submit comment",
          description: "Please try again",
        });
      }
    } else {
      console.error("Node ID is missing, cannot submit comment.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="content"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Add comment here" {...field} />
              </FormControl>
              {error && <FormMessage>{error.message}</FormMessage>}
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
