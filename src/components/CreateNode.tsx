("use client");

import React, { useState } from "react";
import { CauseSelector } from "@/components/CauseSelector";
import { GraphRenderer } from "@/components/GraphRenderer";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAreaStore } from "@/stores/useAreaStore";
import { useNodeStore } from "@/stores/useNodeStore";
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
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Description is required."),
  image: z.string().optional(),
  area: z.string(),
  causedBy: z.array(z.string()),
});

export const CreateNode: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    const nodeData = {
      title: data.title,
      content: data.content,
      image: data.image, // Assuming this is now just a URL string
      area: selectedAreaId || "", // Handle case where selectedAreaId might be null
      causedBy: data.causedBy,
    };

    try {
      await axios.post("/api/nodes/", nodeData);
      toast({ title: "Node created successfully" });
      navigate("/graph-view", { state: { selectedAreaId } });
      if (selectedAreaId) {
        useNodeStore.getState().fetchNodes(selectedAreaId);
      }
    } catch (error) {
      console.error("Failed to create node:", error);
      toast({ title: "Error", description: "Failed to create node" });
    }
  };

  const handleBackClick = () => {
    // Navigate back to GraphView with selectedAreaId state
    navigate("/graph-view", { state: { selectedAreaId } });
  };

  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);

  const handleSelectionChange = (nodeId: string) => {
    setSelectedCauses((prevSelected) =>
      prevSelected.includes(nodeId)
        ? prevSelected.filter((id) => id !== nodeId)
        : [...prevSelected, nodeId],
    );
  };

  return (
    <div className="flex h-full">
      <div className="w-1/2 p-28 m-2">
        <h1 className="text-xl font-bold">Create Node</h1>
        <h2 className="text-md mb-4">
          Add new node details here. Save when done.
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <CauseSelector
              selectedCauses={selectedCauses}
              onSelectionChange={handleSelectionChange}
            />
            <Button type="submit" className="mb-2">
              Create Node
            </Button>
            <Button variant="outline" onClick={handleBackClick}>
              Back
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-1/2 h-full m-2 border-2 border-border shadow-lg rounded-lg">
        <GraphRenderer />
      </div>
    </div>
  );
};
