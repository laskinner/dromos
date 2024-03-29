import React, { useEffect, useState } from "react";
import axios from "axios";
import NodeGraphView from "@/components/NodeGraphView";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null); // Track selected area ID

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(
          "https://dromos-backend-1542a6a0bcb1.herokuapp.com/api/areas/",
        );
        setAreas(response.data);
      } catch (error) {
        console.error("Failed to fetch areas:", error);
        setError("Failed to fetch areas. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleSelectArea = (areaId: string) => {
    console.log("Selected Area ID:", areaId);
    setSelectedAreaId(areaId);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <aside className="w-64 p-4">
        <Select onValueChange={handleSelectArea}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Graph" />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                <Input id="name" value="Graph Name" className="col-span-3" />
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
        {areas.map((area) => (
          <Card key={area.id}>
            <CardHeader>
              <CardTitle>{area.name}</CardTitle>
              <CardDescription>{area.content}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={area.image}
                alt={area.name}
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
        ))}
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
      <main className="flex-1 p-4">
        {selectedAreaId && <NodeGraphView areaId={selectedAreaId} />}
      </main>
    </div>
  );
};

export default GraphView;
