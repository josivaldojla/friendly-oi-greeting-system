
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets } from "lucide-react";
import { MotorcycleModel } from "@/lib/types";
import { getSuspensionOilData } from "@/lib/suspension-oil-data";

interface EditOilDataDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  model: MotorcycleModel | null;
  onSave: (model: MotorcycleModel, oilQuantity: number) => void;
  isLoading?: boolean;
}

export const EditOilDataDialog = ({ 
  isOpen, 
  onOpenChange, 
  model, 
  onSave,
  isLoading = false
}: EditOilDataDialogProps) => {
  const [oilQuantity, setOilQuantity] = useState<string>("");

  useEffect(() => {
    if (model) {
      const existingData = getSuspensionOilData(model.brand || "", model.name);
      setOilQuantity(existingData ? existingData.oilQuantityML.toString() : "");
    }
  }, [model]);

  const handleSave = () => {
    if (model && oilQuantity) {
      const quantity = parseInt(oilQuantity);
      if (!isNaN(quantity) && quantity > 0) {
        onSave(model, quantity);
        onOpenChange(false);
      }
    }
  };

  if (!model) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            Editar Dados de Óleo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-900">{model.name}</div>
            <div className="text-sm text-gray-600">{model.brand}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="oil-quantity">Quantidade de Óleo (ML)</Label>
            <Input
              id="oil-quantity"
              type="number"
              value={oilQuantity}
              onChange={(e) => setOilQuantity(e.target.value)}
              placeholder="Ex: 630"
              min="0"
              className="w-full"
            />
            <div className="text-xs text-gray-500">
              Quantidade de óleo por bengala em mililitros
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !oilQuantity || parseInt(oilQuantity) <= 0}
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
