"use client";

import React from "react";
import { CauseSelector } from "@/components/CauseSelector";
import { GraphRenderer } from "@/components/GraphRenderer";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAreaStore } from "@/stores/useAreaStore";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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
      area: selectedAreaId || "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await axios.post("/api/nodes/", data);
      toast({ title: "Node created successfully" });
      navigate("/graph-view", { state: { selectedAreaId } });
      // Additional logic for fetching nodes if necessary
    } catch (error) {
      console.error("Failed to create node:", error);
      toast({ title: "Error", description: "Failed to create node" });
    }
  };

  const handleBackClick = () => {
    navigate("/graph-view", { state: { selectedAreaId } });
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
            />
            <Button type="submit" className="mb-2">
              Create Node
            </Button>
            {form.formState.errors.causedBy && (
              <p>{form.formState.errors.causedBy.message}</p>
            )}
          </form>
        </Form>
        <Button variant="outline" onClick={handleBackClick}>
          Back
        </Button>
      </div>
      <Controller
        name="causedBy"
        control={form.control}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Caused By</FormLabel>
            <CauseSelector
              selectedCauses={field.value}
              onSelectionChange={(nodeIds) => {
                field.onChange(nodeIds); // This ensures the form state is updated correctly
              }}
            />
            <FormDescription>
              These are the nodes which cause this node.
            </FormDescription>
          </FormItem>
        )}
      />

      <div className="w-1/2 h-full m-2 border-2 border-border shadow-lg rounded-lg">
        <GraphRenderer />
      </div>
    </div>
  );
};
