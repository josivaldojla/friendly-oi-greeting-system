
import { useState } from "react";
import { Service, ViewMode } from "@/lib/types";
import ServiceList from "@/components/services/ServiceList";
import { ModelSearchInput } from "@/components/motorcycle-models/ModelSearchInput";

interface ServiceListWrapperProps {
  services: Service[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAddToSelection: (service: Service, comment?: string) => void;
  onAddService?: (service: Omit<Service, "id">) => Promise<void>;
  onUpdateServices?: () => void;
}

export const ServiceListWrapper = ({
  services,
  viewMode,
  setViewMode,
  onAddToSelection,
  onAddService,
  onUpdateServices
}: ServiceListWrapperProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddService = async (service: Omit<Service, "id">) => {
    if (onAddService) {
      await onAddService(service);
      if (onUpdateServices) {
        onUpdateServices();
      }
    }
  };

  // Filtrar serviços baseado no termo de busca
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <ModelSearchInput
          onSearchChange={setSearchTerm}
          placeholder="Buscar serviços por nome ou descrição..."
        />
      </div>
      
      <ServiceList
        services={filteredServices}
        viewMode={viewMode}
        onAddToSelection={onAddToSelection}
        onAddService={handleAddService}
        selectable={true}
        showAddButton={true}
        hideHeading={false}
      />
    </div>
  );
};
