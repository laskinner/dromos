import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Welcome to the Graph View!
      </h1>
      <ScrollArea className="w-full h-96 overflow-y-auto">
        <div className="flex flex-col space-y-4 p-4">
          {areas.map((area) => (
            <div key={area.id} className="flex items-center space-x-4">
              <img
                src={area.image}
                alt={area.name}
                className="w-20 h-20 object-cover rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold">{area.name}</h2>
                {/* Render additional area details here */}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GraphView;
