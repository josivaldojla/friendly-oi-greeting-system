
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Service } from "@/lib/types";

interface CommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (comment: string) => void;
  service: Service;
}

export const CommentDialog = ({ open, onOpenChange, onSave, service }: CommentDialogProps) => {
  const [comment, setComment] = useState("");
  const [modelName, setModelName] = useState("");
  const [clientName, setClientName] = useState("");
  const [identification, setIdentification] = useState("");

  const handleSave = () => {
    // Formata o comentário incluindo informações de modelo, cliente e identificação
    let formattedComment = "";
    
    if (modelName) {
      formattedComment += `• Modelo: ${modelName}\n`;
    }
    
    if (clientName) {
      formattedComment += `• Cliente: ${clientName}\n`;
    }
    
    if (identification) {
      formattedComment += `• ${identification}\n`;
    }
    
    if (comment) {
      formattedComment += comment;
    }
    
    onSave(formattedComment);
    
    // Limpa os campos após salvar
    setComment("");
    setModelName("");
    setClientName("");
    setIdentification("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar detalhes para {service.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="model">Modelo da Moto</Label>
            <Input
              id="model"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Ex: CB 500 Honda"
            />
          </div>
          
          <div>
            <Label htmlFor="client">Nome do Cliente</Label>
            <Input
              id="client"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: José Silva"
            />
          </div>
          
          <div>
            <Label htmlFor="identification">Identificação</Label>
            <Input
              id="identification"
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
              placeholder="Ex: f86c8tc8td5"
            />
          </div>
          
          <div>
            <Label htmlFor="comment">Comentário Adicional (opcional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Adicione informações extras aqui..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Cancelar</Button>
          <Button onClick={handleSave}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
