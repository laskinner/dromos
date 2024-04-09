import React from "react";
import { useNodeStore } from "@/stores/useNodeStore";
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

export const CauseSelector: React.FC<{
  selectedCauses: string[];
  onSelectionChange: (nodeId: string) => void;
}> = ({ selectedCauses, onSelectionChange }) => {
  const { nodes } = useNodeStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Select Causes</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder="Search nodes" />
          {nodes.length ? ( // Corrected to use 'nodes'
            nodes.map((node) => (
              <CommandItem
                key={node.id}
                onSelect={() => onSelectionChange(node.id)}
              >
                {node.title} {selectedCauses.includes(node.id) ? "✓" : ""}
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
