
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMotorcycleModels } from "./CommentDialog";

interface MotorcycleModelSelectProps {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
}

export const MotorcycleModelSelect: React.FC<MotorcycleModelSelectProps> = ({
  selectedModel,
  setSelectedModel
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="motorcycle-model">Modelo</Label>
      <Select value={selectedModel} onValueChange={setSelectedModel}>
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
};
