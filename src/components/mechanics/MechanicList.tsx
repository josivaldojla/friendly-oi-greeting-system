
import { useState } from "react";
import { Mechanic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import MechanicForm from "./MechanicForm";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MechanicListProps {
  mechanics: Mechanic[];
  onAddMechanic: (mechanic: Mechanic) => void;
  onUpdateMechanic: (mechanic: Mechanic) => void;
  onDeleteMechanic: (id: string) => void;
}

const MechanicList = ({ 
  mechanics, 
  onAddMechanic, 
  onUpdateMechanic, 
  onDeleteMechanic 
}: MechanicListProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | undefined>(undefined);
  const [mechanicToDelete, setMechanicToDelete] = useState<string | null>(null);

  const handleEdit = (mechanic: Mechanic) => {
    setSelectedMechanic({...mechanic});
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setMechanicToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (mechanicToDelete) {
      onDeleteMechanic(mechanicToDelete);
      setDeleteDialogOpen(false);
      setMechanicToDelete(null);
    }
  };

  const handleSubmit = (mechanic: Mechanic) => {
    if (selectedMechanic) {
      onUpdateMechanic(mechanic);
    } else {
      onAddMechanic(mechanic);
    }
    setSelectedMechanic(undefined);
  };

  const handleOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setSelectedMechanic(undefined);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center w-full">
          <h2 className="text-2xl font-bold">Mecânicos</h2>
          <Button 
            onClick={() => setFormOpen(true)} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-2 rounded-md"
          >
            <Plus size={14} className="mr-1" />
            <span className="text-xs">Novo</span>
          </Button>
        </div>
      </div>

      {mechanics.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Especialização</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mechanics.map((mechanic) => (
                <TableRow key={mechanic.id}>
                  <TableCell className="font-medium">{mechanic.name}</TableCell>
                  <TableCell>{mechanic.specialization || "-"}</TableCell>
                  <TableCell>{mechanic.phone || "-"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(mechanic)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(mechanic.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border rounded-lg p-8 bg-white">
          <p className="text-muted-foreground mb-4">Nenhum mecânico cadastrado.</p>
        </div>
      )}

      <MechanicForm
        mechanic={selectedMechanic}
        onSubmit={handleSubmit}
        open={formOpen}
        onOpenChange={handleOpenChange}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este mecânico? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MechanicList;
