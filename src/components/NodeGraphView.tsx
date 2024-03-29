import React, { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface NodeData {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface EdgeData {
  source: string;
  target: string;
  size?: number;
  color?: string;
}

interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

interface NodeGraphViewProps {
  areaId: string;
}

function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
): void {
  useEffect(() => {
    // Correctly type the event parameter as a MouseEvent
    function handleClickOutside(event: MouseEvent): void {
      // Adding a type assertion here for ref.current
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    // Attach the event listener for mousedown events
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

const NodeGraphView: React.FC<NodeGraphViewProps> = ({ areaId }) => {
  // Drawer state hooks
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null); // Correct placement
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  // Call useOutsideClick here
  useOutsideClick(drawerRef, () => setIsDrawerOpen(false));

  useEffect(() => {
    const fetchGraphData = async () => {
      const response = await axios.get(`/api/graph-data/${areaId}/`);
      setGraphData(response.data);
    };
    fetchGraphData();
  }, [areaId]);

  useEffect(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    // Checks the styling, guarantees the container will
    // have size before this code executes.
    if (
      containerRef.current.offsetWidth > 0 &&
      containerRef.current.offsetHeight > 0
    ) {
      console.log("Graph data:", graphData); // Log to verify data structure

      const graph = new Graph();
      graphData.nodes.forEach((node) => {
        graph.addNode(node.id, {
          label: node.label,
          x: node.x || Math.random(), // Fallback to random if no x, y provided
          y: node.y || Math.random(),
          size: node.size || 10,
          color: node.color || "#666",
        });
      });

      graphData.edges.forEach((edge) => {
        if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
          // Check if source and target nodes exist
          graph.addEdge(edge.source, edge.target, {
            size: edge.size || 6,
            color: edge.color || "#ccc",
            type: "arrow",
          });
        }
      });

      // Initialize Sigma without 'renderer' options since it's not accepted here.
      const sigmaInstance = new Sigma(graph, containerRef.current, {
        renderLabels: true,
      });

      sigmaInstance.setSetting("nodeReducer", (_node, data) => {
        return { ...data, size: data.size * 2 }; // Adjusts the node size
      });

      sigmaInstance.setSetting("edgeReducer", (_edge, data) => {
        return { ...data, size: Math.max(data.size, 2) }; // Adjusts the node size
      });

      sigmaInstance.on("clickNode", ({ node }) => {
        const nodeData = graph.getNodeAttributes(node) as NodeData;
        setSelectedNode(nodeData); // Update state with the selected node data
        setIsDrawerOpen(true); // Open the drawer
      });

      return () => sigmaInstance.kill(); // Cleanup on unmount
    }
  }, [graphData]);

  return (
    <div className="node-graph-view h-full w-full">
      <div
        ref={containerRef}
        className="w-full h-full border border-border shadow-lg rounded-lg"
      />
      {isDrawerOpen && (
        // Use the drawerRef here to reference the actual Drawer or its wrapper div
        <div ref={drawerRef}>
          <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <DrawerContent>
              <div style={{ minHeight: "200px" }}>
                <DrawerHeader>
                  <DrawerTitle>Node Details</DrawerTitle>
                </DrawerHeader>
                {/* Node details */}
                <p>{selectedNode?.label}</p>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </div>
  );
};

export default NodeGraphView;
