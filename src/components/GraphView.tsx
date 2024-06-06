import React from "react";
import { useNavigate } from "react-router-dom";
import { useAreaStore } from "@/stores/useAreaStore";
import { useUserStore } from "@/stores/useUserStore";
import { CreateGraph } from "@/components/CreateGraph";
import { GraphSelector } from "@/components/GraphSelector";
import { GraphRenderer } from "@/components/GraphRenderer";
import { NodeQuickView } from "@/components/NodeQuickView";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GraphView: React.FC = () => {
  const navigate = useNavigate();
  const { selectedAreaId, areas } = useAreaStore();
  const { currentUser } = useUserStore();

  const isOwner = (areaId: string) => {
    const area = areas.find((area) => area.id === areaId);
    return area?.owner === currentUser?.username;
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <aside className="w-full lg:w-64 p-4 h-full">
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
