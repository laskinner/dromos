import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Interface for a single area
interface Area {
  id: string;
  name: string;
  description: string;
  image: string; // Add image field
}

const Home: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]); // Types as an array of Area
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get(
          "https://dromos-backend-1542a6a0bcb1.herokuapp.com/api/areas/",
        );
        setAreas(response.data); // Sets fetched areas
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
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Graphs with recent updates
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((area) => (
          <Card key={area.id}>
            <CardHeader>
              <CardTitle>{area.name}</CardTitle>
              {/* Display area image */}
              <img
                src={area.image}
                alt={area.name}
                className="w-full h-40 object-cover"
              />
            </CardHeader>
            <CardContent>
              <p>{area.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
