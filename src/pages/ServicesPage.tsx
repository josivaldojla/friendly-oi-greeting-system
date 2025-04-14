
import { useState, useEffect } from "react";
import { Service, ViewMode } from "@/lib/types";
import { getServices, addService, updateService, deleteService } from "@/lib/storage";
import ServiceList from "@/components/services/ServiceList";
import Layout from "@/components/layout/Layout";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    setServices(getServices());
  }, []);

  const handleAddService = (service: Service) => {
    setServices(addService(service));
  };

  const handleUpdateService = (service: Service) => {
    setServices(updateService(service));
  };

  const handleDeleteService = (id: string) => {
    setServices(deleteService(id));
  };

  return (
    <Layout>
      <ServiceList
        services={services}
        onAddService={handleAddService}
        onUpdateService={handleUpdateService}
        onDeleteService={handleDeleteService}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </Layout>
  );
};

export default ServicesPage;
