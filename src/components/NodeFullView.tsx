import React, { useEffect, useState } from "react";
import { CommentList } from "@/components/CommentList";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNodeStore } from "@/stores/useNodeStore";
import { useAreaStore } from "@/stores/useAreaStore";
import { Button } from "@/components/ui/button";
import { NodeData } from "@/lib/interfaces/graphTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const NodeFullView: React.FC = () => {
  const navigate = useNavigate();
  const [nodeDetails, setNodeDetails] = useState<NodeData | null>(null);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);

  const handleBackClick = () => {
    // Navigate back to GraphView with selectedAreaId state
    navigate("/graph-view", { state: { selectedAreaId } });
  };

  useEffect(() => {
    if (!selectedNodeId) {
      setNodeDetails(null);
      return;
    }

    const node = useNodeStore.getState().getSelectedNode();
    console.log("Selected node details:", node);
    if (node) {
      setNodeDetails(node);
    } else {
      // Fetch node details if necessary
      const fetchNodeDetails = async () => {
        try {
          const response = await axios.get(`/api/nodes/${selectedNodeId}`);
          setNodeDetails(response.data);
        } catch (error) {
          console.error("Failed to fetch node details:", error);
        }
      };

      fetchNodeDetails();
    }
  }, [selectedNodeId]);

  return (
    <>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Card className="mb-8">
          <CardHeader className="bg-gray-100 p-4">
            <CardTitle className="text-lg font-semibold">
              {nodeDetails?.title || "Node Details"}
            </CardTitle>
            <CardDescription className="text-gray-700 mt-2">
              {nodeDetails?.content}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-600">Owner: {nodeDetails?.owner}</p>
          </CardContent>
        </Card>
        <CommentList />
      </div>
      <div>
        <Button
          variant="outline"
          className="max-w-4xl mx-auto px-4"
          onClick={handleBackClick}
        >
          Back
        </Button>
      </div>
    </>
  );
};
