
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ServiceList from '@/components/services/ServiceList';
import { ViewModeToggle } from '@/components/services/components/ViewModeToggle';
import { Service, ViewMode } from '@/lib/types';
import { getServices, addService, updateService, deleteService } from '@/lib/storage';
import { toast } from "sonner";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const servicesData = await getServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Error loading services:', error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (serviceData: Omit<Service, "id">) => {
    try {
      const newService = await addService(serviceData);
      if (newService) {
        setServices([...services, newService]);
        toast.success('Serviço adicionado com sucesso');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      toast.error('Erro ao adicionar serviço');
    }
  };

  const handleUpdateService = async (updatedService: Service) => {
    try {
      const result = await updateService(updatedService);
      if (result) {
        setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
        toast.success('Serviço atualizado com sucesso');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Erro ao atualizar serviço');
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const success = await deleteService(id);
      if (success) {
        setServices(services.filter(s => s.id !== id));
        toast.success('Serviço excluído com sucesso');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Erro ao excluir serviço');
    }
  };

  // Função vazia para onAddToSelection já que não é usada na página de serviços
  const handleAddToSelection = (service: Service, comment?: string) => {
    // Esta função não é usada na página de serviços, apenas no checkout
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Carregando serviços...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Serviços</h1>
          <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        </div>
        
        <ServiceList
          services={services}
          onAddToSelection={handleAddToSelection}
          onAddService={handleAddService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          showAddButton={true}
          hideHeading={false}
          selectable={false}
        />
      </div>
    </Layout>
  );
};

export default ServicesPage;
