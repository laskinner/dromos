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
  const [isOpen, setIsOpen] = useState(false); // State to control drawer visibility
  const [nodeDetails, setNodeDetails] = useState<NodeData | null>(null);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const [ownerDetails, setOwnerDetails] = useState({ username: "Loading..." }); // Holds the username of the node owner

  useEffect(() => {
    const fetchOwnerDetails = async (ownerId?: string) => {
      if (!ownerId) {
        console.error("Owner ID is undefined.");
        setOwnerDetails({ username: "Unknown" });
        return;
      }
      try {
        const response = await axios.get(`/api/users/${ownerId}`);
        setOwnerDetails({ username: response.data.username });
      } catch (error) {
        console.error("Failed to fetch owner details:", error);
        setOwnerDetails({ username: "Unknown" });
      }
    };

    if (!selectedNodeId) {
      setNodeDetails(null);
      setOwnerDetails({ username: "Unknown" });
      setIsOpen(false);
      return;
    }

    const node = useNodeStore.getState().getSelectedNode();
    if (node) {
      setNodeDetails(node);
      fetchOwnerDetails(node.owner); // Fetch owner details using owner ID
      setIsOpen(true);
    } else {
      const fetchNodeDetails = async () => {
        try {
          const response = await axios.get(`/api/nodes/${selectedNodeId}`);
          setNodeDetails(response.data);
          if (response.data.owner) {
            fetchOwnerDetails(response.data.owner); // Fetch owner details if owner ID is present
          }
          setIsOpen(true);
        } catch (error) {
          console.error("Failed to fetch node details:", error);
          setIsOpen(false);
        }
      };

      fetchNodeDetails();
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
              <strong>Owner:</strong>{" "}
              {ownerDetails?.username || "No user found."}
            </p>
            <p className="text-sm text-gray-600">
              To view comments and more details, go to the full node view.
            </p>
          </div>
          <DrawerFooter>
            <Button onClick={() => navigate("/node-view")}>
              View Full Node
            </Button>
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
