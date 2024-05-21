import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAreaStore } from "@/stores/useAreaStore";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { NodeData } from "@/lib/interfaces/graphTypes";

interface GraphData {
  nodes: NodeData[];
}

interface CauseSelectorProps {
  selectedCauses: string[];
  onSelectionChange: (causes: string[]) => void;
}

export const CauseSelector: React.FC<CauseSelectorProps> = ({
  selectedCauses,
  onSelectionChange,
}) => {
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [] });

  useEffect(() => {
    if (!selectedAreaId) return;

    const fetchGraphData = async () => {
      try {
        const response = await axios.get(
          `/api/areas/graph-data/${selectedAreaId}/`,
        );
        if (response.data && Array.isArray(response.data.nodes)) {
          setGraphData({ nodes: response.data.nodes });
        } else {
          console.error("Unexpected data format:", response.data);
        }
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

  const handleSelectionChange = (nodeId: string) => {
    const index = selectedCauses.indexOf(nodeId);
    const newSelectedCauses = [...selectedCauses];
    if (index > -1) {
      newSelectedCauses.splice(index, 1); // Removes the node ID from the selection
    } else {
      newSelectedCauses.push(nodeId); // Adds the node ID to the selection
    }
    onSelectionChange(newSelectedCauses); // Calls the passed function with the new array
  };

  const getSelectedNodeTitles = () =>
    graphData.nodes
      .filter((node) => selectedCauses.includes(node.id))
      .map((node) => node.title)
      .join(", ");

  return (
    <>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search causes..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Causes">
            {graphData.nodes.map((node) => (
              <CommandItem
                key={node.id}
                onSelect={() => handleSelectionChange(node.id)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCauses.includes(node.id)
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {node.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
      <br />
      <h1>Selected Causes</h1>
      <p>{getSelectedNodeTitles()}</p>
    </>
  );
};
