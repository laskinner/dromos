import React, { useState, useEffect } from "react";
import { useAreaStore } from "@/stores/useAreaStore";
import { useNodeStore } from "@/stores/useNodeStore";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CauseSelector: React.FC<{
  selectedCauses: string[];
  onSelectionChange: (nodeId: string) => void;
}> = ({ selectedCauses, onSelectionChange }) => {
  const [open, setOpen] = useState(false);
  const { nodes, fetchNodes } = useNodeStore();
  const selectedAreaId = useAreaStore((state) => state.selectedAreaId);

  // Fetch nodes whenever the selectedAreaId changes or the component initially mounts
  useEffect(() => {
    if (selectedAreaId) {
      fetchNodes(selectedAreaId);
    }
  }, [fetchNodes, selectedAreaId]);

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
            ? nodes
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
          {nodes.length ? (
            <CommandGroup>
              {nodes.map((node) => (
                <CommandItem
                  key={node.id}
                  onSelect={() => {
                    onSelectionChange(node.id);
                    setOpen(false);
                  }}
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
          ) : (
            <CommandEmpty>No nodes found.</CommandEmpty>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
