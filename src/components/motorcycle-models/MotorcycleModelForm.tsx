
import { useState, useEffect } from "react";
import { MotorcycleModel } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface MotorcycleModelFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (model: Omit<MotorcycleModel, "id"> | MotorcycleModel) => void;
  isLoading?: boolean;
  currentModel?: MotorcycleModel | null;
  mode: 'add' | 'edit';
}

export const MotorcycleModelForm = ({
  isOpen,
  onOpenChange,
  onSave,
  isLoading = false,
  currentModel = null,
  mode
}: MotorcycleModelFormProps) => {
  const [modelName, setModelName] = useState("");
  const [brandName, setBrandName] = useState("");

  // Reset form when dialog opens or current model changes
  useEffect(() => {
    if (currentModel && mode === 'edit') {
      setModelName(currentModel.name);
      setBrandName(currentModel.brand || "");
    } else if (mode === 'add') {
      setModelName("");
      setBrandName("");
    }
  }, [currentModel, mode, isOpen]);

  const handleSave = () => {
    if (!modelName.trim()) {
      toast.error("Nome do modelo é obrigatório");
      return;
    }
    
    if (mode === 'edit' && currentModel) {
      onSave({
        id: currentModel.id,
        name: modelName.trim(),
        brand: brandName.trim()
      });
    } else {
      onSave({
        name: modelName.trim(),
        brand: brandName.trim()
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Adicionar Modelo' : 'Editar Modelo'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor={`${mode}-model-name`}>Nome do Modelo</Label>
            <Input 
              id={`${mode}-model-name`}
              value={modelName} 
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Ex: CG 160"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-brand-name`}>Marca (Opcional)</Label>
            <Input 
              id={`${mode}-brand-name`}
              value={brandName} 
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Ex: Honda"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Salvando...' : mode === 'add' ? 'Salvar' : 'Atualizar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
