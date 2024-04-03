import { LayoutFunction } from "@/lib/interfaces/graphTypes";

export const circularLayout: LayoutFunction = (nodes) => {
  const radius = 100; // Radius of the circle on which nodes will be placed
  const center = { x: 100, y: 100 }; // Center of the circle

  const updatedNodes = nodes.map((node, index, arr) => {
    const angle = (index / arr.length) * 2 * Math.PI; // Angle for this node
    return {
      ...node,
      x: center.x + radius * Math.cos(angle),
      y: center.y + radius * Math.sin(angle),
    };
  });

  return updatedNodes;
};
