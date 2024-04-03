import React, { useEffect, useState } from "react";
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
  const [nodeDetails, setNodeDetails] = useState<NodeData | null>(null);
  const { selectedNodeId, getSelectedNode } = useNodeStore((state) => ({
    selectedNodeId: state.selectedNodeId,
    getSelectedNode: state.getSelectedNode,
  }));

  useEffect(() => {
    const node = getSelectedNode();
    console.log("Selected node details:", node); // Debugging line
    if (node) {
      setNodeDetails(node);
    } else if (selectedNodeId) {
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
  }, [selectedNodeId, getSelectedNode]);

  return (
    <Drawer open={!!nodeDetails}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{nodeDetails?.title || "Node Details"}</DrawerTitle>
          </DrawerHeader>
          <div>
            <p>{nodeDetails?.content}</p>
            <p>Owner: {nodeDetails?.owner}</p>
            <p>Create: {nodeDetails?.created_at}</p>
            <p>Last Update: {nodeDetails?.updated_at}</p>
            <p>To view comments, go to node full view.</p>
          </div>
          <DrawerFooter>
            <Button>View Node</Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NodeQuickView;
