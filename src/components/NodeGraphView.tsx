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
      // Adjust this URL to match the correct endpoint for fetching graph data for a specific area, should the GraphView in back-end be refactored
      const response = await axios.get(`/api/graph-data/${areaId}/`);

      setGraphData(response.data);
    };

    fetchGraphData();
  }, [areaId]);

  useEffect(() => {
    if (!containerRef.current || graphData.nodes.length === 0) return;

    const graph = new Graph();
    graphData.nodes.forEach((node) => {
      graph.addNode(node.id, {
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color,
      });
    });

    graphData.edges.forEach((edge) => {
      graph.addEdge(edge.source, edge.target, {
        size: edge.size || 1,
        color: edge.color || "grey",
      });
    });

    const sigmaInstance = new Sigma(graph, containerRef.current);

    return () => sigmaInstance.kill(); // Cleanup the sigma instance on component unmount
  }, [graphData]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "500px" }}></div>
  );
};

export default NodeGraphView;
