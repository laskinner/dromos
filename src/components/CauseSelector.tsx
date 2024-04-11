import React, { useState, useEffect } from "react";
import { useNodeStore } from "@/stores/useNodeStore";
import { useAreaStore } from "@/stores/useAreaStore";
import { NodeData } from "@/lib/interfaces/graphTypes";
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
import { ChevronsUpDown } from "lucide-react";

interface CauseSelectorProps {
  selectedCauses: string[];
  onSelectionChange: (nodeId: string) => void;
}

export const CauseSelector: React.FC<CauseSelectorProps> = ({
  selectedCauses,
  onSelectionChange,
}) => {
  const { nodes, fetchNodes } = useNodeStore();
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedAreaId) {
      fetchNodes(selectedAreaId);
    }
  }, [fetchNodes, selectedAreaId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedCauses.length > 0 ? "Selected Nodes..." : "Select Nodes..."}
          <ChevronsUpDown className="ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-xs p-0">
        <Command>
          <CommandInput placeholder="Search nodes..." autoFocus />
          {nodes.length === 0 ? (
            <CommandEmpty>No nodes found.</CommandEmpty>
          ) : (
            nodes.map((node: NodeData) => (
              <CommandItem
                key={node.id}
                onSelect={() => onSelectionChange(node.id)}
              >
                {selectedCauses.includes(node.id) ? "✓ " : ""}
                {node.title}
              </CommandItem>
            ))
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
