import { useState } from "react";
import { Service, ViewMode } from "@/lib/types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "./ServiceCard";
import ServiceListItem from "./ServiceListItem";
import { ViewModeToggle } from "./components/ViewModeToggle";
import { EmptyServices } from "./components/EmptyServices";
import ServiceForm from "./ServiceForm";

interface ServiceListProps {
  services: Service[];
  onAddService: (service: Service) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  selectable?: boolean;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  onAddToSelection?: (service: Service, comment?: string) => void;
  showAddButton?: boolean;
  hideHeading?: boolean;
}

const ServiceList = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  selectable = false,
  viewMode = 'list',
  onViewModeChange,
  onAddToSelection,
  showAddButton = true,
  hideHeading = false
}: ServiceListProps) => {
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleAddService = async (newService: Service) => {
    await onAddService(newService);
    setIsAddingService(false);
  };

  const handleUpdateService = async (updatedService: Service) => {
    await onUpdateService(updatedService);
    setEditingService(null);
  };

  const handleDeleteService = async (id: string) => {
    await onDeleteService(id);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
  };
  
  return (
    <div className="space-y-4">
      {!hideHeading && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-2xl font-bold">Serviços</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {onViewModeChange && (
              <ViewModeToggle 
                viewMode={viewMode} 
                onViewModeChange={onViewModeChange} 
              />
            )}
            {showAddButton && (
              <Button onClick={() => setIsAddingService(true)} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Novo Serviço
              </Button>
            )}
          </div>
        </div>
      )}

      {isAddingService && (
        <ServiceForm
          onSubmit={handleAddService}
          onCancel={() => setIsAddingService(false)}
        />
      )}

      {editingService && (
        <ServiceForm
          service={editingService}
          onSubmit={handleUpdateService}
          onCancel={() => setEditingService(null)}
        />
      )}

      {services.length === 0 ? (
        <EmptyServices onAddClick={() => setIsAddingService(true)} />
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {services.map((service) => (
            viewMode === 'grid' ? (
              <ServiceCard
                key={service.id}
                service={service}
                onAddToSelection={onAddToSelection || (() => {})}
                onEdit={selectable ? undefined : handleEditService}
                showEditButton={!selectable}
              />
            ) : (
              <ServiceListItem
                key={service.id}
                service={service}
                onEdit={selectable ? undefined : handleEditService}
                onDelete={selectable ? undefined : handleDeleteService}
                onAddToSelection={onAddToSelection}
                selectable={selectable}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
