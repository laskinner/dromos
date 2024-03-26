import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import NodeGraphView from "@/components/NodeGraphView";
import { Card, CardContent } from "@/components/ui/card";

// Interface for an area
export interface Area {
  id: string;
  name: string;
  image: string; // Assuming each area has an image URL
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
    <div className="flex h-screen">
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
      </aside>
      <main className="flex-1 p-4">
        {selectedAreaId && <NodeGraphView areaId={selectedAreaId} />}
      </main>
    </div>
  );
};

export default GraphView;
