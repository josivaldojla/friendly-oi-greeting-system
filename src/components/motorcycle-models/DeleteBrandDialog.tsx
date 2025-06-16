
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface DeleteBrandDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  brand: string | null;
  modelCount: number;
  isLoading?: boolean;
}

export const DeleteBrandDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  brand,
  modelCount,
  isLoading = false,
}: DeleteBrandDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão da Marca</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Tem certeza que deseja excluir a marca <strong>"{brand}"</strong>?</p>
          <p className="text-sm text-muted-foreground mt-2">
            Esta ação irá excluir todos os <strong>{modelCount}</strong> modelos desta marca.
          </p>
          <p className="text-sm text-red-600 mt-2 font-medium">Esta ação não pode ser desfeita.</p>
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
            variant="destructive" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir Marca'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
