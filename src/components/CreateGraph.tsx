import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  content: z.string().min(1, "Description is required."),
  isPublic: z.boolean(),
});

export const CreateGraph: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    const payload = {
      name: data.name,
      content: data.content,
      is_public: data.isPublic,
    };

    try {
      await axios.post("/api/areas/", payload);
      form.reset();
      // Handle success (e.g., show confirmation, refresh list of areas/graphs)
    } catch (error) {
      // Handle error
      console.error("Failed to create area:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Graph</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Graph</DialogTitle>
          <DialogDescription>
            Add new graph details here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
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
              name="isPublic"
              render={({ field: { onChange, value, name, ref } }) => (
                <FormItem>
                  <Label htmlFor="isPublic">Public</Label>
                  <Switch
                    id="isPublic"
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked)}
                    name={name}
                    ref={ref}
                  />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
