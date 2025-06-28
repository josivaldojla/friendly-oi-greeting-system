
import { useState } from "react";
import { Service, ViewMode } from "@/lib/types";
import ServiceList from "@/components/services/ServiceList";
import { getServices } from "@/lib/storage";
import { toast } from "sonner";

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
  const handleAddService = async (service: Omit<Service, "id">) => {
    if (onAddService) {
      await onAddService(service);
      if (onUpdateServices) {
        onUpdateServices();
      }
    }
  };

  return (
    <div className="space-y-6">
      <ServiceList
        services={services}
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
