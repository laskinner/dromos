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

const NodeQuickView: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // New state to control drawer visibility
  const [nodeDetails, setNodeDetails] = useState<NodeData | null>(null);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);

  useEffect(() => {
    if (!selectedNodeId) {
      setNodeDetails(null);
      setIsOpen(false); // Close drawer when there is no selected node
      return;
    }

    const node = useNodeStore.getState().getSelectedNode();
    console.log("Selected node details:", node);
    if (node) {
      setNodeDetails(node);
      setIsOpen(true); // Open drawer when node details are fetched
    } else {
      // Fetch node details if necessary
      const fetchNodeDetails = async () => {
        try {
          const response = await axios.get(`/api/nodes/${selectedNodeId}`);
          setNodeDetails(response.data);
          setIsOpen(true); // Open drawer when node details are fetched from API
        } catch (error) {
          console.error("Failed to fetch node details:", error);
          setIsOpen(false);
        }
      };

      fetchNodeDetails();
    }
  }, [selectedNodeId]);

  // Function to close the drawer
  const closeDrawer = () => setIsOpen(false);

  return (
    <Drawer open={isOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{nodeDetails?.title || "Node Details"}</DrawerTitle>
          </DrawerHeader>
          <div>
            <p>{nodeDetails?.content}</p>
            <p>Owner: {nodeDetails?.owner}</p>
            <p>To view comments, go to node full view.</p>
          </div>
          <DrawerFooter>
            <Button onClick={() => navigate("/node-full-view")}>
              View Node
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

export default NodeQuickView;
