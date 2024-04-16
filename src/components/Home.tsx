import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAreaStore } from "@/stores/useAreaStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InfiniteScroll from "react-infinite-scroll-component";

const Home: React.FC = () => {
  const { areas, selectArea, fetchAreas } = useAreaStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchInitialAreas = useCallback(async () => {
    const hasMoreAreas = await fetchAreas(1); // Fetch the first page
    if (hasMoreAreas) {
      setCurrentPage(2); // Prepare to fetch the next page
    } else {
      setHasMore(false); // No more pages to fetch
    }
  }, [fetchAreas]);

  useEffect(() => {
    fetchInitialAreas();
  }, [fetchInitialAreas]);

  const loadMoreAreas = async () => {
    const hasMoreAreas = await fetchAreas(currentPage);
    if (hasMoreAreas) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
  };

  const handleCardClick = (areaId: string) => {
    selectArea(areaId);
    navigate("/graph-view");
  };

  return (
    <InfiniteScroll
      dataLength={areas.length}
      next={loadMoreAreas} // Function to load more items
      hasMore={hasMore} // Whether there are more items to load
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
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
    </InfiniteScroll>
  );
};

export default Home;
