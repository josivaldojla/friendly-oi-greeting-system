
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Service } from "@/lib/types";
import { MotorcycleModelSelect } from "./MotorcycleModelSelect";
import { CustomerSelect } from "./CustomerSelect";
import { CustomerSelection } from "@/lib/types";

// Dados simulados movidos para um arquivo separado
import { mockMotorcycleModels } from "@/lib/mock-data";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (comment: string) => void;
  service: Service;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  service
}) => {
  const [comment, setComment] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [customerSelection, setCustomerSelection] = useState<CustomerSelection>({ name: "" });
  
  // Limpar estados quando fechar o diálogo
  useEffect(() => {
    if (!open) {
      setComment("");
      setSelectedModel("");
      setCustomerSelection({ name: "" });
    }
  }, [open]);

  // Usar useCallback para evitar renderizações desnecessárias
  const handleModelChange = useCallback((value: string) => {
    setSelectedModel(value);
  }, []);
  
  const handleCustomerChange = useCallback((customer: CustomerSelection) => {
    setCustomerSelection(customer);
  }, []);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    let formattedComment = "";
    
    if (selectedModel) {
      const model = mockMotorcycleModels.find(m => m.id === selectedModel);
      if (model) {
        formattedComment += `Modelo: ${model.name}\n`;
      }
    }
    
    if (customerSelection && customerSelection.name) {
      formattedComment += `Cliente: ${customerSelection.name}\n`;
    }
    
    if (comment.trim()) {
      formattedComment += comment.trim();
    }
    
    onSave(formattedComment ? `_${formattedComment}_` : "");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        onClick={(e) => e.stopPropagation()} 
        className="sm:max-w-[425px] bg-background"
        style={{ zIndex: 100 }}
      >
        <DialogHeader>
          <DialogTitle>Adicionar Comentário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <MotorcycleModelSelect
            selectedModel={selectedModel}
            setSelectedModel={handleModelChange}
          />
          
          <CustomerSelect
            customerSelection={customerSelection}
            setCustomerSelection={handleCustomerChange}
          />
          
          <div className="space-y-2">
            <Label htmlFor="comment">Comentário (Opcional)</Label>
            <Textarea
              id="comment"
              className="w-full"
              rows={3}
              value={comment}
              placeholder="Digite um comentário adicional para o serviço"
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
