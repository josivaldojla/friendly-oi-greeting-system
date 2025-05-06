
import React, { memo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMotorcycleModels } from "@/lib/mock-data";

interface MotorcycleModelSelectProps {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
}

export const MotorcycleModelSelect = memo(({
  selectedModel,
  setSelectedModel
}: MotorcycleModelSelectProps) => {
  // Use useCallback to ensure the handler doesn't cause unnecessary re-renders
  const handleValueChange = useCallback((value: string) => {
    setSelectedModel(value);
  }, [setSelectedModel]);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="motorcycle-model">Modelo</Label>
      <Select 
        value={selectedModel} 
        onValueChange={handleValueChange}
        open={undefined} // Let the component control its own open state
      >
        <SelectTrigger id="motorcycle-model" className="bg-background">
          <SelectValue placeholder="Selecione um modelo" />
        </SelectTrigger>
        <SelectContent 
          className="bg-background z-[200]"
          position="popper"
          sideOffset={5}
          align="start"
        >
          {mockMotorcycleModels.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

MotorcycleModelSelect.displayName = "MotorcycleModelSelect";
