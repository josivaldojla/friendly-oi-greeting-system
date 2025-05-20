
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceHistory } from "@/lib/types";

interface EditHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historyItem: ServiceHistory | null;
  onSave: (id: string, title: string) => Promise<void>;
}

export const EditHistoryDialog = ({ 
  open, 
  onOpenChange, 
  historyItem, 
  onSave 
}: EditHistoryDialogProps) => {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Atualizar o título quando o item de histórico mudar
  React.useEffect(() => {
    if (historyItem) {
      setTitle(historyItem.title);
    }
  }, [historyItem]);

  const handleSave = async () => {
    if (historyItem && title.trim()) {
      setIsSaving(true);
      try {
        await onSave(historyItem.id, title.trim());
        onOpenChange(false);
      } catch (error) {
        console.error("Erro ao salvar histórico:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Histórico</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do histórico"
              autoFocus
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim() || isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
