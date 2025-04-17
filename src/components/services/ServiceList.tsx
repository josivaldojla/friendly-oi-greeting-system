
import { useState } from "react";
import { Service, ViewMode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, LayoutGrid, List as ListIcon } from "lucide-react";
import ServiceForm from "./ServiceForm";
import { toast } from "sonner";
import { ServiceListItem } from "./ServiceListItem";
import { ServiceCard } from "./ServiceCard";

interface ServiceListProps {
  services: Service[];
  onAddService: (service: Service) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  onSelectService?: (service: Service) => void;
  onAddToSelection?: (service: Service) => void;
  selectable?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showAddButton?: boolean;
}

const ServiceList = ({ 
  services, 
  onAddService, 
  onUpdateService, 
  onDeleteService,
  onSelectService,
  onAddToSelection,
  selectable = false,
  viewMode = 'list',
  onViewModeChange,
  showAddButton = false
}: ServiceListProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>(undefined);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleEdit = (service: Service, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedService(service);
    setFormOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      onDeleteService(serviceToDelete);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
      toast.success("Serviço excluído com sucesso");
    }
  };

  const handleSubmit = (service: Service) => {
    if (selectedService) {
      onUpdateService(service);
      toast.success("Serviço atualizado com sucesso");
    } else {
      onAddService(service);
      toast.success("Serviço adicionado com sucesso");
    }
    setSelectedService(undefined);
  };

  const handleOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setSelectedService(undefined);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Serviços</h2>
        <div className="flex items-center gap-2">
          {onViewModeChange && (
            <div className="flex border rounded-lg overflow-hidden mr-2">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => onViewModeChange('list')} 
                className="rounded-r-none"
              >
                <ListIcon size={18} />
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => onViewModeChange('grid')} 
                className="rounded-l-none"
              >
                <LayoutGrid size={18} />
              </Button>
            </div>
          )}
          <Button onClick={() => setFormOpen(true)} className="flex items-center gap-2">
            <Plus size={18} />
            <span>Novo Serviço</span>
          </Button>
        </div>
      </div>

      {services.length > 0 ? (
        viewMode === 'list' ? (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10%]">Imagem</TableHead>
                  <TableHead className="w-[25%]">Nome</TableHead>
                  <TableHead className="w-[15%] text-right">Valor</TableHead>
                  <TableHead className="w-[35%] hidden md:table-cell">Descrição</TableHead>
                  <TableHead className="w-[15%] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <ServiceListItem
                    key={service.id}
                    service={service}
                    selectable={selectable}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onClick={onSelectService}
                    formatPrice={formatPrice}
                    onAddToSelection={onAddToSelection}
                    showAddButton={showAddButton}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                selectable={selectable}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onClick={onSelectService}
                formatPrice={formatPrice}
                onAddToSelection={onAddToSelection}
                showAddButton={showAddButton}
              />
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center border rounded-lg p-8 bg-white">
          <p className="text-muted-foreground mb-4">Nenhum serviço cadastrado.</p>
          <Button onClick={() => setFormOpen(true)}>Adicionar Primeiro Serviço</Button>
        </div>
      )}

      <ServiceForm
        service={selectedService}
        onSubmit={handleSubmit}
        open={formOpen}
        onOpenChange={handleOpenChange}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
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

export default ServiceList;
