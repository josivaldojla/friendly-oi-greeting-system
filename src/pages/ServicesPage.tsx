
import { useState, useEffect } from "react";
import { Service, ViewMode } from "@/lib/types";
import { getServices, addService, updateService, deleteService } from "@/lib/storage";
import ServiceList from "@/components/services/ServiceList";
import Layout from "@/components/layout/Layout";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    const data = await getServices();
    setServices(data);
    setLoading(false);
  };

  const handleAddService = async (service: Service) => {
    await addService(service);
    loadServices();
  };

  const handleUpdateService = async (service: Service) => {
    await updateService(service);
    loadServices();
  };

  const handleDeleteService = async (id: string) => {
    await deleteService(id);
    loadServices();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Carregando...</div>
        </div>
      </Layout>
    );
  }

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
