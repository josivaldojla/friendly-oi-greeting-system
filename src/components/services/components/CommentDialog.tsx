
import React, { useState, useEffect, useCallback, useMemo } from "react";
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

  // Usar useCallback para evitar renderizações desnecessárias e memoizar as funções
  const handleModelChange = useCallback((value: string) => {
    setSelectedModel(value);
  }, []);
  
  const handleCustomerChange = useCallback((customer: CustomerSelection) => {
    setCustomerSelection(customer);
  }, []);

  const handleCommentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  }, []);

  // Memoizar a função handleSave para evitar recriações desnecessárias
  const handleSave = useCallback((e: React.MouseEvent) => {
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
  }, [selectedModel, customerSelection, comment, onSave, onOpenChange]);

  // Adicionar evento de click apenas uma vez
  const handleDialogClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        onClick={handleDialogClick} 
        className="sm:max-w-[425px] bg-background overflow-y-auto max-h-[90vh]"
        style={{ zIndex: 100 }}
        onPointerDownOutside={(e) => {
          // Evita que cliques fora do diálogo o fechem acidentalmente
          e.preventDefault();
        }}
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
              className="w-full bg-background"
              rows={3}
              value={comment}
              placeholder="Digite um comentário adicional para o serviço"
              onChange={handleCommentChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
            Cancelar
          </Button>
          <Button variant="default" onClick={handleSave} type="button">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
