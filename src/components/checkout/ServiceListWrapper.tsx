
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
  const handleAddService = async (service: Service) => {
    try {
      await getServices();
      toast.success("Serviço adicionado com sucesso");
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error("Erro ao adicionar serviço");
    }
  };

  const handleUpdateService = async (service: Service) => {
    try {
      await getServices();
      toast.success("Serviço atualizado com sucesso");
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error("Erro ao atualizar serviço");
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await getServices();
      toast.success("Serviço removido com sucesso");
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error("Erro ao remover serviço");
    }
  };

  return (
    <div className="space-y-6">
      <ServiceList
        services={services}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        selectable={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddToSelection={onAddToSelection}
        showAddButton={true}
        hideHeading={true}
      />
    </div>
  );
};
