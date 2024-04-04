import React, { useEffect, useState } from "react";
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
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId); // Access the global state

  const handleBackClick = () => {
    // Navigate back to GraphView with selectedAreaId state
    navigate("/graph-view", { state: { selectedAreaId } });
  };

  useEffect(() => {
    const node = useNodeStore.getState().getSelectedNode();
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{nodeDetails?.title || "Node Details"}</CardTitle>
          <CardDescription>{nodeDetails?.content}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Owner: {nodeDetails?.owner}</p>
        </CardContent>
      </Card>
      <Button onClick={handleBackClick}>Back</Button>
    </div>
  );
};
