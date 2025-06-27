
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
}

export const ServiceListWrapper = ({
  services,
  viewMode,
  setViewMode,
  onAddToSelection
}: ServiceListWrapperProps) => {
  return (
    <div className="space-y-6">
      <ServiceList
        services={services}
        viewMode={viewMode}
        onAddToSelection={onAddToSelection}
      />
    </div>
  );
};
