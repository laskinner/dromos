import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAreaStore } from "@/stores/useAreaStore";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandInput,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NodeData } from "@/lib/interfaces/graphTypes";

interface GraphData {
  nodes: NodeData[];
}

export const CauseSelector: React.FC<{
  selectedCauses: string[];
  onSelectionChange: (nodeId: string) => void;
}> = ({ selectedCauses, onSelectionChange }) => {
  const [open, setOpen] = useState(false);
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [] });

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCauses.length > 0
            ? graphData.nodes
                .filter((node) => selectedCauses.includes(node.id))
                .map((node) => node.title)
                .join(", ")
            : "Select Nodes..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search nodes..." />
          {graphData.nodes.length > 0 ? (
            graphData.nodes.map((node) => (
              <CommandItem
                key={node.id}
                onSelect={() => {
                  onSelectionChange(node.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2",
                    selectedCauses.includes(node.id)
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {node.title}
              </CommandItem>
            ))
          ) : (
            <CommandEmpty>No nodes found.</CommandEmpty>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
