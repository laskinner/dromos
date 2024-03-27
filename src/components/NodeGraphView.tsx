import React, { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import axios from "axios";

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

const NodeGraphView: React.FC<NodeGraphViewProps> = ({ areaId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    const fetchGraphData = async () => {
      const response = await axios.get(`/api/graph-data/${areaId}/`);
      setGraphData(response.data);
    };
    fetchGraphData();
  }, [areaId]);

  useEffect(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    // A more sophisticated check here to ensure the styling
    // guarantees the container will have size before this code executes could be needed.
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
          size: node.size || 4,
          color: node.color || "#666",
        });
      });

      graphData.edges.forEach((edge) => {
        if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
          // Check if source and target nodes exist
          graph.addEdge(edge.source, edge.target, {
            size: edge.size || 2,
            color: edge.color || "#ccc",
            type: "arrow",
          });
        }
      });

      // Initialize Sigma without 'renderer' options since it's not accepted here.
      const sigmaInstance = new Sigma(graph, containerRef.current);

      sigmaInstance.setSetting("nodeReducer", (_node, data) => {
        return { ...data, size: data.size * 2 }; // Adjusts the node size
      });

      sigmaInstance.setSetting("edgeReducer", (_edge, data) => {
        return { ...data, size: Math.max(data.size, 2) }; // Adjusts the node size
      });

      return () => sigmaInstance.kill(); // Cleanup on unmount
    }
  }, [graphData]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full border border-border shadow-lg rounded-lg"
    />
  );
};

export default NodeGraphView;
