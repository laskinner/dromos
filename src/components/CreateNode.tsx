"use client";

import React, { useState, useEffect } from "react";
import { CauseSelector } from "@/components/CauseSelector";
import { GraphRenderer } from "@/components/GraphRenderer";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAreaStore } from "@/stores/useAreaStore";
import { useNodeStore } from "@/stores/useNodeStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Description is required."),
  area: z.string().optional(),
  causedBy: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

export const CreateNode: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Provides default value for area in form,
      // brought by state and sets a fallback value if selectedAreaId might be null
      area: selectedAreaId || "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Submitting new node...");
    const node = {
      title: data.title,
      content: data.content,
      area: data.area,
      causedBy: data.causedBy,
    };
    try {
      await axios.post("/api/nodes/", node);
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
    navigate("/graph-view", { state: { selectedAreaId } });
  };

  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);

  // If area ID changes the state here is updated for form
  useEffect(() => {
    form.setValue("area", selectedAreaId || "");
  }, [selectedAreaId, form]);

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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="causedBy"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel>Caused By</FormLabel>
                  <CauseSelector
                    selectedCauses={selectedCauses}
                    onSelectionChange={(nodeId: string) => {
                      const newSelectedCauses = selectedCauses.includes(nodeId)
                        ? selectedCauses.filter((id) => id !== nodeId)
                        : [...selectedCauses, nodeId];
                      setSelectedCauses(newSelectedCauses);
                      form.setValue("causedBy", newSelectedCauses); // Directly update form state
                    }}
                  />
                  <FormDescription>
                    These are the nodes which cause this node.
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" className="mb-2">
              Create Node
            </Button>
          </form>
        </Form>
        <Button variant="outline" onClick={handleBackClick}>
          Back
        </Button>
      </div>
      <div className="w-1/2 h-full m-2 border-2 border-border shadow-lg rounded-lg">
        <GraphRenderer />
      </div>
    </div>
  );
};
