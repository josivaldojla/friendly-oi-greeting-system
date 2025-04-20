
import { useState } from "react";
import { toast } from "sonner";

interface UseDeleteDialogProps {
  onDelete: (id: string) => void;
}

export const useDeleteDialog = ({ onDelete }: UseDeleteDialogProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      onDelete(serviceToDelete);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
      toast.success("Serviço excluído com sucesso");
    }
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDelete,
    confirmDelete
  };
};
