import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios"; // Ensure axios is imported

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
  comment: z.string().min(1, {
    message: "Enter a comment.",
  }),
});

type FormData = z.infer<typeof formSchema>;

// Updated props type to include `nodeId`
interface CommentFormProps {
  nodeId?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ nodeId }) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (nodeId) {
      try {
        await axios.post("/api/comments/", { ...data, node: nodeId });
        form.reset(); // Reset the form after successful submission
      } catch (error) {
        console.error("Failed to submit comment:", error);
      }
    } else {
      console.error("Node ID is missing.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="comment"
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
