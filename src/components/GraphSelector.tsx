import React, { useEffect } from "react";
import { useAreaStore } from "@/stores/useAreaStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const GraphSelector: React.FC = () => {
  const { areas, fetchAllAreas, selectedAreaId, selectArea } = useAreaStore();

  useEffect(() => {
    fetchAllAreas(); // Fetch all areas when the component mounts
  }, [fetchAllAreas]);

  const handleSelectArea = (areaId: string) => {
    selectArea(areaId); // Directly use selectArea action from the store
  };

  const selectedAreaName =
    areas.find((area) => area.id === selectedAreaId)?.name || "Select a Graph";

  return (
    <Select onValueChange={handleSelectArea} value={selectedAreaName}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>{selectedAreaName}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {areas.map((area) => (
          <SelectItem key={area.id} value={area.id}>
            {area.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
