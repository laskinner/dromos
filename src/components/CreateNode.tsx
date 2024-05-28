"use client";

import React, { useState } from "react";
import { CauseSelector } from "@/components/CauseSelector";
import { GraphRenderer } from "@/components/GraphRenderer";
import { useToast } from "@/components/ui/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAreaStore } from "@/stores/useAreaStore";
import axios from "@/api/axiosDefaults"; // Use the configured axios instance
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
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Description is required."),
});

type FormData = z.infer<typeof formSchema>;

export const CreateNode: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { selectedAreaId } = useAreaStore();
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (selectedCauses.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one cause.",
      });
      return;
    }

    if (!selectedAreaId) {
      toast({
        title: "Error",
        description:
          "No area selected. Please select an area before creating a node.",
      });
      return;
    }

    const nodeData = {
      ...data,
      area: selectedAreaId, // Directly use the selected area ID from the store
    };

    try {
      const response = await axios.post("/api/nodes/", nodeData);
      console.log("Node Creation Response:", response.data); // Log the response
      const newNode = response.data; // API returns the newly created node

      // Create edges
      const edgePromises = selectedCauses.map((causeId) =>
        axios.post("/api/edges/", { source: causeId, target: newNode.id }),
      );

      await Promise.all(edgePromises);

      toast({ title: "Node and edges created successfully" });
      navigate("/graph-view", { state: { selectedAreaId } });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Failed to create node or edges:", error.response.data);
          toast({
            title: "Error",
            description: error.response.data.detail || "Please log in.",
          });
        } else {
          console.error("Network error or no response:", error.message);
          toast({
            title: "Network Error",
            description:
              "No response received, check your network or contact support.",
          });
        }
      } else {
        console.error(
          "An unexpected error occurred:",
          (error as Error).message,
        );
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  const handleBackClick = () => {
    navigate("/graph-view");
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
            <Button type="submit" className="mb-2">
              Create Node
            </Button>
          </form>
        </Form>
        <Button variant="outline" onClick={handleBackClick}>
          Back
        </Button>
      </div>
      <div className="w-1/2 m-2">
        <CauseSelector
          selectedCauses={selectedCauses}
          onSelectionChange={(newCauses) => {
            setSelectedCauses(newCauses);
          }}
        />
      </div>
      <div className="w-1/2 h-full m-2 border-2 border-border shadow-lg rounded-lg">
        <GraphRenderer />
      </div>
    </div>
  );
};
