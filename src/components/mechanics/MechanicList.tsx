
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
import { Edit, Trash2, Plus, User } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
  const isMobile = useIsMobile();

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
    <div className="container mx-auto px-2 space-y-6 pb-16">
      <div className="flex flex-col">
        <div className="flex justify-between items-center w-full py-4">
          <h2 className="text-2xl font-bold">Mecânicos</h2>
          <Button 
            onClick={() => setFormOpen(true)} 
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 rounded-md flex items-center"
          >
            <Plus size={14} className="mr-1" />
            <span className="text-xs">Novo Mecânico</span>
          </Button>
        </div>
      </div>

      {mechanics.length > 0 ? (
        isMobile ? (
          <div className="grid grid-cols-1 gap-4">
            {mechanics.map((mechanic) => (
              <Card key={mechanic.id} className="shadow-sm">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gray-100 rounded-full p-2">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{mechanic.name}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {mechanic.specialization || "Sem especialização"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm mt-2">
                    <p className="text-gray-600 truncate">
                      <span className="font-medium">Telefone:</span> {mechanic.phone || "-"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2 pt-0 px-4 pb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(mechanic)}
                    className="h-8 px-2 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(mechanic.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2 text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto w-full">
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
          </div>
        )
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
        <AlertDialogContent className="max-w-[90%] w-[450px] mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este mecânico? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="mt-0">Cancelar</AlertDialogCancel>
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
