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
import { useCommentStore } from "@/stores/useCommentStore"; // Import the comment store

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Write a comment.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface CommentFormProps {
  nodeId?: string;
  commentId?: string; // Add commentId prop for editing
  initialContent?: string; // Add initialContent prop for editing
  onCancelEdit?: () => void; // Add onCancelEdit prop for canceling edit mode
}

export const CommentForm: React.FC<CommentFormProps> = ({
  nodeId,
  commentId,
  initialContent,
  onCancelEdit,
}) => {
  console.log("Received Node ID in CommentForm:", nodeId);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialContent || "",
    },
  });

  const { toast } = useToast();
  const addComment = useCommentStore((state) => state.addComment); // Get the addComment method
  const editComment = useCommentStore((state) => state.editComment); // Get the editComment method

  const onSubmit = async (data: FormData) => {
    if (nodeId) {
      try {
        if (commentId) {
          // Edit existing comment
          await editComment(commentId, data.content, nodeId);
          toast({ variant: "success", title: "Comment edited successfully" });
          if (onCancelEdit) onCancelEdit();
        } else {
          // Add new comment
          const response = await axios.post("/api/comments/", {
            content: data.content,
            node: nodeId,
          });
          toast({ variant: "success", title: "Comment added successfully" });
          addComment(response.data); // Add the new comment to the state
          form.reset(); // Reset the form after successful submission
        }
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
        <div className="flex space-x-4">
          <Button type="submit">{commentId ? "Update" : "Submit"}</Button>
          {commentId && onCancelEdit && (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
