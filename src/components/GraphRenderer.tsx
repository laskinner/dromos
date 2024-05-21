import React, { useEffect, useRef, useState } from "react";
import Graph from "graphology";
import Sigma from "sigma";
import axios from "axios";
import { useAreaStore } from "@/stores/useAreaStore";
import { useNodeStore } from "@/stores/useNodeStore";
import { dagLayout } from "@/lib/layouts/dagLayout";
import { useLayoutStore } from "@/stores/useLayoutStore";
import { NodeData, EdgeData } from "@/lib/interfaces/graphTypes";

interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}

export const GraphRenderer: React.FC = () => {
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);
  const { selectNode } = useNodeStore();
  const layoutAlgorithm = useLayoutStore((state) => state.layoutAlgorithm);
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    if (!selectedAreaId) return;

    const fetchGraphData = async () => {
      try {
        const response = await axios.get(
          `/api/areas/graph-data/${selectedAreaId}/`,
        );
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

    let laidOutNodes: NodeData[] = [];
    let cycleEdges: EdgeData[] = [];

    const result = dagLayout(graphData.nodes, graphData.edges);
    laidOutNodes = result.positionedNodes;
    cycleEdges = result.cycleEdges;

    const graph = new Graph();
    laidOutNodes.forEach((node) => {
      graph.addNode(node.id, {
        ...node,
        label: node.title, // Use title as label
        size: node.size || 10, // Set default size if not provided
        color: node.color || "#666", // Set default color if not provided
      });
    });
    graphData.edges.forEach((edge) => {
      const isCycleEdge = cycleEdges.some(
        (ce) => ce.source === edge.source && ce.target === edge.target,
      );
      graph.addEdge(edge.source, edge.target, {
        ...edge,
        type: "arrow",
        size: edge.size || 6, // Set default size if not provided
        color: isCycleEdge ? "red" : edge.color || "#ccc", // Set default color if not cycle edge
      });
    });

    const sigmaInstance = new Sigma(graph, containerRef.current, {
      renderLabels: true,
      defaultNodeColor: "#666",
      defaultEdgeColor: "#ccc",
      defaultEdgeType: "arrow",
      labelFont: "Arial",
      labelColor: {
        color: "#000",
      },
    });

    sigmaInstance.on("clickNode", ({ node }) => {
      const nodeData = graph.getNodeAttributes(node) as NodeData;
      selectNode(nodeData.id);
    });

    return () => sigmaInstance.kill();
  }, [graphData, layoutAlgorithm, selectNode]);

  return <div ref={containerRef} className="w-full h-full" />;
};
