import React, { useEffect, useState } from "react";
import { CommentList } from "@/components/CommentList";
import { useNavigate } from "react-router-dom";
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
import { useUserStore } from "@/stores/useUserStore";
import {
  fetchFullNodeDetails,
  updateNode,
  deleteNode,
} from "@/lib/services/nodeService";

export const NodeFullView: React.FC = () => {
  const navigate = useNavigate();
  const [nodeDetails, setNodeDetails] = useState<NodeData | null>(null);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);
  const fetchUserProfile = useUserStore((state) => state.fetchUserProfile);

  const handleBackClick = () => {
    navigate("/graph-view", { state: { selectedAreaId } });
  };

  useEffect(() => {
    if (!selectedNodeId) {
      setNodeDetails(null);
      return;
    }

    const node = useNodeStore.getState().getSelectedNode();
    if (node) {
      setNodeDetails(node);
    } else {
      fetchFullNodeDetails(selectedNodeId)
        .then(({ node }) => setNodeDetails(node))
        .catch(() => console.error("Failed to fetch node details"));
    }

    fetchUserProfile();
  }, [selectedNodeId, fetchUserProfile]);

  const handleEdit = async () => {
    if (nodeDetails) {
      const updatedNode = await updateNode(nodeDetails.id, {
        ...nodeDetails,
        title: "Updated Title",
      });
      setNodeDetails(updatedNode);
    }
  };

  const handleDelete = async () => {
    if (nodeDetails) {
      await deleteNode(nodeDetails.id);
      navigate("/graph-view", { state: { selectedAreaId } }); // Navigate after deletion
    }
  };

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
        {nodeDetails?.is_owner && (
          <div className="space-y-2">
            <Button onClick={handleEdit}>Edit</Button>
            <Button variant="outline" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
        <CommentList />
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <Button variant="outline" onClick={handleBackClick}>
          Back
        </Button>
      </div>
    </>
  );
};
