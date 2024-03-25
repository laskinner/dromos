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
      const graph = new Graph();
      graphData.nodes.forEach((node) => graph.addNode(node.id, node));
      graphData.edges.forEach((edge) =>
        graph.addEdge(edge.source, edge.target, edge),
      );

      // Initialize Sigma without 'renderer' options since it's not accepted here.
      const sigmaInstance = new Sigma(graph, containerRef.current);

      return () => sigmaInstance.kill(); // Cleanup on unmount
    }
  }, [graphData]);

  return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
};

export default NodeGraphView;
