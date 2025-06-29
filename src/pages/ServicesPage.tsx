
import { useState, useEffect } from "react";
import { Service, ViewMode } from "@/lib/types";
import { getServices, addService, updateService, deleteService } from "@/lib/storage";
import ServiceList from "@/components/services/ServiceList";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (service: Omit<Service, "id">) => {
    try {
      const updatedServices = await addService(service);
      setServices(updatedServices);
      toast.success('Serviço adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      toast.error('Erro ao adicionar serviço');
    }
  };

  const handleUpdateService = async (service: Service) => {
    try {
      const updatedServices = await updateService(service);
      setServices(updatedServices);
      toast.success('Serviço atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast.error('Erro ao atualizar serviço');
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const updatedServices = await deleteService(id);
      setServices(updatedServices);
      toast.success('Serviço removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover serviço:', error);
      toast.error('Erro ao remover serviço');
    }
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
