
import { useState, useEffect } from "react";
import { MotorcycleModel } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getMotorcycleModels } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  
  // Get all models to extract unique brands
  const { data: allModels = [] } = useQuery({
    queryKey: ['motorcycleModels'],
    queryFn: getMotorcycleModels
  });
  
  // Extract unique brands for suggestions
  const uniqueBrands = Array.from(
    new Set(allModels.map(model => model.brand).filter(Boolean) as string[])
  ).sort();

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
    
    const finalBrandName = brandName.trim() 
      ? brandName.trim().charAt(0).toUpperCase() + brandName.trim().slice(1)
      : "";
    
    if (mode === 'edit' && currentModel) {
      onSave({
        id: currentModel.id,
        name: modelName.trim(),
        brand: finalBrandName
      });
    } else {
      onSave({
        name: modelName.trim(),
        brand: finalBrandName
      });
    }
  };
  
  const selectBrandSuggestion = (brand: string) => {
    setBrandName(brand);
    setShowBrandSuggestions(false);
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
              autoComplete="off"
            />
          </div>
          <div className="space-y-2 relative">
            <Label htmlFor={`${mode}-brand-name`}>Marca</Label>
            <Input 
              id={`${mode}-brand-name`}
              value={brandName} 
              onChange={(e) => setBrandName(e.target.value)}
              onFocus={() => uniqueBrands.length > 0 && setShowBrandSuggestions(true)}
              placeholder="Ex: Honda"
              autoComplete="off"
            />
            
            {showBrandSuggestions && uniqueBrands.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
                <ScrollArea className="h-[180px]">
                  <div className="p-1">
                    {uniqueBrands.map(brand => (
                      <Button
                        key={brand}
                        variant="ghost"
                        className="w-full justify-start text-left font-normal"
                        onClick={() => selectBrandSuggestion(brand)}
                        type="button"
                      >
                        {brand}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
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
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : mode === 'add' ? 'Adicionar' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
