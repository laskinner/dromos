import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

export const NodeQuickView: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [nodeDetails, setNodeDetails] = useState<NodeData | null>(null);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const [ownerDetails, setOwnerDetails] = useState<{ username: string }>({
    username: "Loading...",
  });

  useEffect(() => {
    const fetchOwnerDetails = async (ownerId: string) => {
      try {
        const response = await axios.get(`/api/profiles/${ownerId}/`);
        setOwnerDetails({ username: response.data.username });
      } catch (error) {
        console.error("Failed to fetch owner details:", error);
        setOwnerDetails({ username: "Unknown" });
      }
    };

    const fetchNodeDetails = async (nodeId: string) => {
      try {
        const response = await axios.get(`/api/nodes/${nodeId}`);
        setNodeDetails(response.data);
        if (response.data.owner) {
          fetchOwnerDetails(response.data.owner);
        } else {
          setOwnerDetails({ username: "Unknown" });
        }
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to fetch node details:", error);
        setIsOpen(false);
      }
    };

    if (selectedNodeId) {
      const node = useNodeStore.getState().getSelectedNode();
      if (node) {
        setNodeDetails(node);
        if (node.owner) {
          fetchOwnerDetails(node.owner);
        } else {
          setOwnerDetails({ username: "Unknown" });
        }
        setIsOpen(true);
      } else {
        fetchNodeDetails(selectedNodeId);
      }
    } else {
      setNodeDetails(null);
      setOwnerDetails({ username: "Unknown" });
      setIsOpen(false);
    }
  }, [selectedNodeId]);

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
