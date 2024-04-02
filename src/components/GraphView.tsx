import React, { useEffect } from "react";
import GraphRenderer from "./GraphRenderer";
import GraphSelector from "./GraphSelector";
import { useAreaStore } from "@/stores/useAreaStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Interface for an area
export interface Area {
  id: string;
  name: string;
  image: string;
  content: string;
  is_user_area: boolean;
  // Add more fields as necessary
}

const GraphView: React.FC = () => {
  const {
    areas,
    selectedAreaId,
    fetchAreas, // Now using fetchAreas from the store
  } = useAreaStore();

  useEffect(() => {
    fetchAreas(); // Fetch areas using the store action
  }, [fetchAreas]);

  return (
    <div className="flex h-full">
      {/* Moved aside to the left and applied conditional rendering */}
      {selectedAreaId && (
        <aside className="w-64 p-4 h-full">
          <Card key={selectedAreaId}>
            <CardHeader>
              <CardTitle>
                {areas.find((area) => area.id === selectedAreaId)?.name}
              </CardTitle>
              <CardDescription>
                {areas.find((area) => area.id === selectedAreaId)?.content}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={areas.find((area) => area.id === selectedAreaId)?.image}
                alt={areas.find((area) => area.id === selectedAreaId)?.name}
                className="w-10 h-10 object-cover rounded-full"
              />
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Create Node</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Node</DialogTitle>
                    <DialogDescription>
                      Add new node details here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="title"
                        value="Node Name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="content" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="content"
                        value="Description"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <p>Select a node</p>
            </CardHeader>
            <CardContent>
              <p>Node content goes here</p>
            </CardContent>
            <CardFooter>
              <Button>Enter Node View</Button>
            </CardFooter>
          </Card>
        </aside>
      )}
      <main className="flex-1 p-4 h-full">
        <div className="flex justify-between mb-4">
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Create Graph</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Graph</DialogTitle>
                  <DialogDescription>
                    Add new graph details here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value="Graph Name"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="content" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="content"
                      value="Description"
                      className="col-span-3"
                    />
                  </div>
                  <div>
                    <Switch id="is_public" />
                    <Label htmlFor="is_public"> Private</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <GraphSelector />
          </div>
          {selectedAreaId ? (
            <GraphRenderer /> // Assuming GraphRenderer uses selectedAreaId from useAreaStore internally
          ) : (
            <div>Select a Graph to view its details.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GraphView;
