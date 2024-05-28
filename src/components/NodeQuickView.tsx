import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNodeStore } from "@/stores/useNodeStore";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { NodeData } from "@/lib/interfaces/graphTypes";
import {
  fetchFullNodeDetails,
  updateNode,
  deleteNode,
} from "@/lib/services/nodeService";

export const NodeQuickView: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [nodeDetails, setNodeDetails] = useState<NodeData | null>(null);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const [ownerDetails, setOwnerDetails] = useState<{ username: string }>({
    username: "Loading...",
  });

  useEffect(() => {
    if (selectedNodeId) {
      const node = useNodeStore.getState().getSelectedNode();
      if (node) {
        setNodeDetails(node);
        if (node.owner) {
          fetchFullNodeDetails(node.owner)
            .then(({ owner }) => setOwnerDetails(owner))
            .catch(() => setOwnerDetails({ username: "Unknown" }));
        } else {
          setOwnerDetails({ username: "Unknown" });
        }
        setIsOpen(true);
      } else {
        fetchFullNodeDetails(selectedNodeId)
          .then(({ node, owner }) => {
            setNodeDetails(node);
            setOwnerDetails(owner);
            setIsOpen(true);
          })
          .catch(() => {
            setOwnerDetails({ username: "Unknown" });
            setIsOpen(false);
          });
      }
    } else {
      setNodeDetails(null);
      setOwnerDetails({ username: "Unknown" });
      setIsOpen(false);
    }
  }, [selectedNodeId]);

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
      setIsOpen(false); // Close the drawer after deletion
      // Optionally, navigate or refresh the list of nodes
    }
  };

  const closeDrawer = () => setIsOpen(false);

  return (
    <Drawer open={isOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm p-4">
          <DrawerHeader>
            <DrawerTitle className="font-bold text-lg">
              {nodeDetails?.title || "Node Details"}
            </DrawerTitle>
          </DrawerHeader>
          <div className="space-y-2">
            <p>
              <strong>Description:</strong>{" "}
              {nodeDetails?.content || "No details available."}
            </p>
            <p>
              <strong>Owner:</strong> {ownerDetails.username}
            </p>
            <p className="text-sm text-gray-600">
              To view comments and more details, go to the full node view.
            </p>
          </div>
          {nodeDetails?.is_owner && (
            <div className="space-y-2">
              <Button onClick={handleEdit}>Edit</Button>
              <Button variant="outline" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
          <DrawerFooter>
            <Button onClick={() => navigate("/node-view")}>View Node</Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={closeDrawer}>
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
