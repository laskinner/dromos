import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAreaStore } from "@/stores/useAreaStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import axios from "@/api/axiosDefaults";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Name is required."),
  content: z.string().min(1, "Description is required."),
  image: z.any(),
  area: z.string(), // Assuming area ID is a string; adjust if it's numeric.
  // `caused_by` can be an array of IDs and needs to be handled differently.
});

export const CreateNode: React.FC = () => {
  const navigate = useNavigate();
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    // Ensure selectedAreaId is not null before proceeding
    if (!selectedAreaId) {
      console.error("Area ID is required to create a node.");
      // Optionally, show a toast or dialog to inform the user
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("area", selectedAreaId.toString()); // Safe to use toString() now

    if (data.image && data.image.length > 0)
      formData.append("image", data.image[0]);

    try {
      await axios.post("/api/nodes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.reset();
      navigate("/graph-view", { state: { selectedAreaId } });
    } catch (error) {
      console.error("Failed to create node:", error);
    }
  };

  const handleBackClick = () => {
    // Navigate back to GraphView with selectedAreaId state
    navigate("/graph-view", { state: { selectedAreaId } });
  };

  return (
    <>
      <h1>Create Node</h1>
      <h2> Add new node details here. Save when done.</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <input {...field} id="image" type="file" accept="image/*" />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            onClick={handleBackClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Node
          </Button>
        </form>
      </Form>
    </>
  );
};
