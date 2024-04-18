import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAreaStore } from "@/stores/useAreaStore";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { areas, fetchAreas, selectArea } = useAreaStore();

  useEffect(() => {
    fetchAreas(); // Fetch areas when component mounts
  }, [fetchAreas]);

  const handleCardClick = (areaId: string) => {
    selectArea(areaId); // Set the selected area ID in the store
    navigate("/graph-view"); // Navigate to the GraphView
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
        Explore Graphs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((area) => (
          <Card
            key={area.id}
            onClick={() => handleCardClick(area.id)}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{area.name}</CardTitle>
              <img
                src={area.image}
                alt={area.name}
                className="w-full h-40 object-cover"
              />
            </CardHeader>
            <CardContent>
              <p>{area.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
