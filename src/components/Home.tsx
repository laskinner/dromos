import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAreaStore } from "@/stores/useAreaStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Home: React.FC = () => {
  const { areas, fetchAreas, currentPage, totalPages, selectArea } =
    useAreaStore(); // Ensure selectArea is included here
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialAreas = async () => {
      setLoading(true);
      await fetchAreas(1); // Fetch the first page
      setLoading(false);
    };
    fetchInitialAreas();
  }, [fetchAreas]);

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      setLoading(true);
      await fetchAreas(currentPage - 1);
      setLoading(false);
    }
  };

  const handleNextPage = async () => {
    if (currentPage < totalPages) {
      setLoading(true);
      await fetchAreas(currentPage + 1);
      setLoading(false);
    }
  };

  const handleCardClick = (areaId: string) => {
    selectArea(areaId); // This is where selectArea is used
    navigate("/graph-view");
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((area) => (
          <Card key={area.id} onClick={() => handleCardClick(area.id)}>
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
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage <= 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
          Next
        </button>
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Home;
