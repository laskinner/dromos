import React, { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import axios from "axios";
import { useAreaStore } from "@/stores/useAreaStore";
import { useNodeStore } from "@/stores/useNodeStore";

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

const GraphRenderer: React.FC = () => {
  const { selectedAreaId } = useAreaStore((state) => ({
    selectedAreaId: state.selectedAreaId,
  }));
  const { selectNode } = useNodeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  // Fetch graph data when selectedAreaId changes
  useEffect(() => {
    if (!selectedAreaId) return;

    const fetchGraphData = async () => {
      try {
        const response = await axios.get(`/api/graph-data/${selectedAreaId}/`);
        setGraphData(response.data);
        console.log("Fetched graph data:", response.data);
      } catch (error) {
        console.error(
          "Error fetching graph data for area:",
          selectedAreaId,
          error,
        );
      }
    };

    fetchGraphData();
  }, [selectedAreaId]);

  // Initialize and render graph with Sigma when graphData changes
  useEffect(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    const graph = new Graph();
    console.log("Graph data for Sigma:", graphData);
    graphData.nodes.forEach((node) => graph.addNode(node.id, { ...node }));
    graphData.edges.forEach((edge) => {
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        graph.addEdge(edge.source, edge.target, { ...edge, type: "arrow" });
      }
    });

    const sigmaInstance = new Sigma(graph, containerRef.current, {
      renderLabels: true,
      defaultNodeColor: "#666",
      defaultEdgeColor: "#ccc",
    });

    sigmaInstance.on("clickNode", ({ node }) => {
      const nodeData = graph.getNodeAttributes(node) as NodeData;
      console.log("Node clicked:", nodeData);
      selectNode(nodeData.id);
    });

    return () => sigmaInstance.kill(); // Cleanup on unmount
  }, [graphData, selectNode]);

  return (
    <div className="graph-renderer h-full w-full">
      <div
        ref={containerRef}
        className="w-full h-full border border-border shadow-lg rounded-lg"
      />
    </div>
  );
};

export default GraphRenderer;
