import React, { useEffect, useRef } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import axios from "axios";
import { useAreaStore } from "@/stores/useAreaStore";
import { useNodeStore } from "@/stores/useNodeStore"; // Import your node store

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
  const { selectNode } = useNodeStore(); // Use selectNode action from the node store
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = React.useState<GraphData>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (!selectedAreaId) return;

    const fetchGraphData = async () => {
      try {
        const response = await axios.get(`/api/graph-data/${selectedAreaId}/`);
        setGraphData(response.data);
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

  useEffect(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    const graph = new Graph();
    graphData.nodes.forEach((node) => graph.addNode(node.id, { ...node }));
    graphData.edges.forEach((edge) => {
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        graph.addEdge(edge.source, edge.target, { ...edge, type: "arrow" });
      }
    });

    const sigmaInstance = new Sigma(graph, containerRef.current, {
      renderLabels: true,
    });

    sigmaInstance.on("clickNode", ({ node }) => {
      const nodeData = graph.getNodeAttributes(node) as NodeData;
      selectNode(nodeData.id); // Use selectNode action from the node store
    });

    return () => sigmaInstance.kill();
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
