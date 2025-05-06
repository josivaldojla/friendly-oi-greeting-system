
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Service } from "@/lib/types";
import { MotorcycleModelSelect } from "./MotorcycleModelSelect";
import { CustomerSelect } from "./CustomerSelect";
import { CustomerSelection } from "@/lib/types";

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
    
    if (customerSelection.name) {
      formattedComment += `Cliente: ${customerSelection.name}\n`;
    }
    
    if (comment.trim()) {
      formattedComment += comment.trim();
    }
    
    onSave(formattedComment ? `_${formattedComment}_` : undefined);
    
    // Fechamento do diálogo é gerenciado pelo componente pai
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Adicionar Comentário</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <MotorcycleModelSelect
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
          
          <CustomerSelect
            customerSelection={customerSelection}
            setCustomerSelection={setCustomerSelection}
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

// Dados simulados (Eventualmente estes dados seriam movidos para um contexto global ou API)
export const mockMotorcycleModels = [
  { id: "1", name: "Fazer 250" },
  { id: "2", name: "CG 160" },
  { id: "3", name: "XRE 300" },
  { id: "4", name: "CB 300" },
  { id: "5", name: "Biz 125" }
];

export const mockCustomers = [
  { id: "1", name: "Valdo" },
  { id: "2", name: "João" },
  { id: "3", name: "Maria" },
  { id: "4", name: "Pedro" },
  { id: "5", name: "Ana" }
];
