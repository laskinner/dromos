import React, { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import axios from "axios";
import { useAreaStore } from "@/stores/useAreaStore";
import { useNodeStore } from "@/stores/useNodeStore";
import { circularLayout } from "@/lib/layouts/circularLayout";
import { useLayoutStore } from "@/stores/useLayoutStore";
// Import centralized types
import { NodeData, EdgeData } from "@/lib/interfaces/graphTypes";

interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

const GraphRenderer: React.FC = () => {
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);
  const { selectNode } = useNodeStore();
  const layoutAlgorithm = useLayoutStore((state) => state.layoutAlgorithm);
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

  // Apply the layout and render graph with Sigma when graphData or layoutAlgorithm changes
  useEffect(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    // Apply the selected layout algorithm
    let laidOutNodes = graphData.nodes;
    switch (layoutAlgorithm) {
      // Add cases for other layout algorithms
      // case 'otherLayout':
      //   laidOutNodes = otherLayoutAlgorithm(graphData.nodes, graphData.edges);
      //   break;
      case "circular":
      default:
        laidOutNodes = circularLayout(graphData.nodes, graphData.edges);
        break;
    }

    // Initialize Graphology instance with laid out nodes
    const graph = new Graph();
    laidOutNodes.forEach((node) => graph.addNode(node.id, node));
    graphData.edges.forEach((edge) =>
      graph.addEdge(edge.source, edge.target, edge),
    );

    // Render the graph with Sigma
    const sigmaInstance = new Sigma(graph, containerRef.current, {
      renderLabels: true,
      defaultNodeColor: "#666",
      defaultEdgeColor: "#ccc",
    });

    sigmaInstance.on("clickNode", ({ node }) => {
      const nodeData = graph.getNodeAttributes(node) as NodeData;
      selectNode(nodeData.id);
    });

    return () => sigmaInstance.kill(); // Cleanup on unmount
  }, [graphData, layoutAlgorithm, selectNode]);

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
