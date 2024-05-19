import {
  LayoutFunction,
  NodeData,
  EdgeData,
} from "@/lib/interfaces/graphTypes";

export const dagLayout: LayoutFunction = (nodes, edges = []) => {
  const levels: Record<string, number> = {};
  const cycleEdges: EdgeData[] = [];

  const visited: Record<string, boolean> = {};
  const onStack: Record<string, boolean> = {};

  function dfs(node: NodeData, level: number) {
    visited[node.id] = true;
    onStack[node.id] = true;
    levels[node.id] = Math.max(levels[node.id] || 0, level);

    edges
      .filter((edge) => edge.source === node.id)
      .forEach((edge) => {
        if (!visited[edge.target]) {
          dfs(nodes.find((n) => n.id === edge.target)!, level + 1);
        } else if (onStack[edge.target]) {
          cycleEdges.push(edge);
        }
      });

    onStack[node.id] = false;
  }

  nodes.forEach((node) => {
    if (!visited[node.id]) {
      dfs(node, 0);
    }
  });

  const positionedNodes = nodes.map((node) => ({
    ...node,
    x: levels[node.id] * 200,
    y: Math.random() * 500,
  }));

  return { positionedNodes, cycleEdges };
};
