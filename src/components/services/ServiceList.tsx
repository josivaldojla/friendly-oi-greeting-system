
import { useState } from "react";
import { Service, ViewMode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { Edit, Trash2, Plus, LayoutGrid, List as ListIcon } from "lucide-react";
import ServiceForm from "./ServiceForm";
import { toast } from "sonner";

interface ServiceListProps {
  services: Service[];
  onAddService: (service: Service) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  onSelectService?: (service: Service) => void;
  selectable?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

const ServiceList = ({ 
  services, 
  onAddService, 
  onUpdateService, 
  onDeleteService,
  onSelectService,
  selectable = false,
  viewMode = 'list',
  onViewModeChange
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

  const handleServiceClick = (service: Service) => {
    if (selectable && onSelectService) {
      onSelectService(service);
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
                  {!selectable && <TableHead className="w-[100px]">Imagem</TableHead>}
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow 
                    key={service.id} 
                    className={selectable ? "cursor-pointer hover:bg-muted/50" : ""}
                    onClick={selectable ? () => handleServiceClick(service) : undefined}
                  >
                    {!selectable && (
                      <TableCell>
                        {service.imageUrl ? (
                          <img 
                            src={service.imageUrl} 
                            alt={service.name} 
                            className="w-12 h-12 object-cover rounded" 
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <ImagePlaceholder />
                          </div>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{formatPrice(service.price)}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {service.description || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleEdit(service, e)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDelete(service.id, e)}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <Card 
                key={service.id}
                className={selectable ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
                onClick={selectable ? () => handleServiceClick(service) : undefined}
              >
                <div className="relative h-40">
                  {service.imageUrl ? (
                    <img 
                      src={service.imageUrl} 
                      alt={service.name} 
                      className="w-full h-full object-cover rounded-t-lg" 
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center rounded-t-lg">
                      <ImagePlaceholder size={48} />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg line-clamp-1">{service.name}</h3>
                    <span className="font-bold text-moto-blue">{formatPrice(service.price)}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {service.description || "Sem descrição"}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
                  <div onClick={(e) => e.stopPropagation()} className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEdit(service, e)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDelete(service.id, e)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
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

const ImagePlaceholder = ({ size = 24 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-muted-foreground"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export default ServiceList;
