import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios"; // Ensure axios is imported
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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

  const onSubmit = async (data: FormData) => {
    if (nodeId) {
      try {
        // Directly use 'data.content' now that the form field is named 'content'
        await axios.post("/api/comments/", {
          content: data.content,
          node: nodeId, // Assuming your API also expects a 'node' field
        });
        form.reset(); // Reset the form after successful submission
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Failed to submit comment:", axiosError.response?.data);
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
              <FormLabel>Comment</FormLabel>
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
