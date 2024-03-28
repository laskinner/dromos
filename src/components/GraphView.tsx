import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import NodeGraphView from "@/components/NodeGraphView";
import { Card, CardContent } from "@/components/ui/card";
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

// Interface for an area
export interface Area {
  id: string;
  name: string;
  image: string;
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

  const handleAreaClick = (areaId: string) => {
    console.log("Area clicked:", areaId);
    setSelectedAreaId(areaId); // Update state to indicate selected area
    // Later, this will trigger rendering of the node graph for this area
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
        <ScrollArea className="w-full h-1/2 bg-gray-200 shadow-lg overflow-y-auto rounded-lg border p-2">
          <div className="flex flex-col space-y-2">
            {areas.map((area) => (
              <Card className="rounded-xl">
                <CardContent className="p-4">
                  <div
                    key={area.id}
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() => handleAreaClick(area.id)}
                  >
                    <img
                      src={area.image}
                      alt={area.name}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div>
                      <h2 className="text-md font-semibold">{area.name}</h2>
                      {/* Render any desired additional area details here */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
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
                  <Input id="title" value="Node Name" className="col-span-3" />
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
        </div>
      </aside>
      <main className="flex-1 p-4">
        {selectedAreaId && <NodeGraphView areaId={selectedAreaId} />}
      </main>
    </div>
  );
};

export default GraphView;
