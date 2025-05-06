
import React, { memo } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMotorcycleModels } from "@/lib/mock-data";

interface MotorcycleModelSelectProps {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
}

// Usando memo para evitar renderizações desnecessárias
export const MotorcycleModelSelect = memo(({
  selectedModel,
  setSelectedModel
}: MotorcycleModelSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="motorcycle-model">Modelo</Label>
      <Select 
        value={selectedModel} 
        onValueChange={setSelectedModel}
      >
        <SelectTrigger id="motorcycle-model">
          <SelectValue placeholder="Selecione um modelo" />
        </SelectTrigger>
        <SelectContent>
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
