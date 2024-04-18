import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraphRenderer } from "./GraphRenderer";
import GraphSelector from "./GraphSelector";
import { CreateGraph } from "./CreateGraph";
import { useAreaStore } from "@/stores/useAreaStore";
import { useUserStore } from "@/stores/useUserStore"; // Import user store
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NodeQuickView from "./NodeQuickView";

const GraphView: React.FC = () => {
  const navigate = useNavigate();
  const { areas, selectedAreaId, fetchAreas } = useAreaStore();
  const { currentUser } = useUserStore(); // Fetch current user details

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const isOwner = (areaId: string) => {
    const selectedArea = areas.find((area) => area.id === areaId);
    console.log("Selected Area:", selectedArea);
    console.log("Current User:", currentUser);
    console.log("Owner Details:", selectedArea?.owner);
    return currentUser?.id === selectedArea?.owner; // Check if the logged-in user is the owner
  };

  return (
    <div className="flex h-full">
      <aside className="w-64 p-4 h-full">
        <div className="flex mb-4">
          <CreateGraph />
        </div>
        <div className="flex mb-4">
          <GraphSelector />
        </div>
        {selectedAreaId && (
          <Card
            key={selectedAreaId}
            className="flex flex-col justify-center items-center text-center"
          >
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
                className="w-20 h-20 object-cover rounded-full m-4"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={() => navigate("/create-node")}>
                Create Node
              </Button>
              {isOwner(selectedAreaId) && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/edit-graph/${selectedAreaId}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      /* delete logic */
                    }}
                  >
                    Delete
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        )}
      </aside>
      <main className="flex-1 p-4 h-full">
        <div className="graph-renderer h-full w-full flex justify-center items-center">
          <div className="w-full h-full border-2 border-border shadow-lg rounded-lg flex justify-center items-center">
            {selectedAreaId ? (
              <>
                <GraphRenderer />
                <NodeQuickView />
              </>
            ) : (
              <div className="text-center font-semibold text-lg text-gray-700">
                Select a Graph
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GraphView;
