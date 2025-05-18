import { useState, useEffect } from "react";
import { Service, Mechanic, ViewMode, ServiceHistory } from "@/lib/types";
import { getServices, getMechanics, addService, updateService, deleteService } from "@/lib/storage";
import ServiceList from "@/components/services/ServiceList";
import SelectedServicesList from "@/components/checkout/SelectedServicesList";
import ServiceHistoryList from "@/components/checkout/ServiceHistoryList";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const STORAGE_KEY = "selectedServices";
const STORAGE_KEY_MECHANIC = "selectedMechanicId";
const STORAGE_KEY_RECEIVED_AMOUNT = "receivedAmount";

const CheckoutPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("services");

  // Carregar dados do localStorage quando o componente for montado
  useEffect(() => {
    const loadSavedServices = () => {
      try {
        const savedServices = localStorage.getItem(STORAGE_KEY);
        if (savedServices) {
          setSelectedServices(JSON.parse(savedServices));
        }
      } catch (error) {
        console.error('Erro ao carregar serviços salvos:', error);
      }
    };

    loadSavedServices();
  }, []);

  // Salvar serviços selecionados no localStorage sempre que forem alterados
  useEffect(() => {
    if (selectedServices.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedServices));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedServices]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const servicesData = await getServices();
        const mechanicsData = await getMechanics();
        
        setServices(servicesData);
        setMechanics(mechanicsData);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Erro ao carregar os dados');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleAddService = async (service: Service) => {
    try {
      const updatedServices = await addService(service);
      setServices(updatedServices);
      toast.success(`Serviço ${service.name} adicionado com sucesso`);
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      toast.error('Erro ao adicionar serviço');
    }
  };

  const handleUpdateService = async (service: Service) => {
    try {
      const updatedServices = await updateService(service);
      setServices(updatedServices);
      toast.success(`Serviço ${service.name} atualizado com sucesso`);
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

  const handleAddToSelection = (service: Service, comment?: string) => {
    setSelectedServices(prev => [
      ...prev,
      comment 
        ? { ...service, comment } 
        : { ...service }
    ]);
    const msg = comment 
      ? `${service.name} adicionado à seleção com comentário`
      : `${service.name} adicionado à seleção`;
    toast.success(msg);
  };

  const handleRemoveService = (id: string) => {
    setSelectedServices(selectedServices.filter(service => service.id !== id));
  };

  const handleCompleteCheckout = () => {
    setSelectedServices([]);
  };

  const handleSelectHistory = (history: ServiceHistory) => {
    // Adicionar serviços do histórico à seleção atual
    setSelectedServices(history.service_data);
    toast.success(`Histórico "${history.title}" carregado com ${history.service_data.length} serviços`);
    // Mudar para a aba de serviços
    setActiveTab("services");
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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Serviços Executados</h2>
        
        <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <ServiceList
                    services={services}
                    onAddService={handleAddService}
                    onUpdateService={handleUpdateService}
                    onDeleteService={handleDeleteService}
                    selectable={true}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onAddToSelection={handleAddToSelection}
                    showAddButton={true}
                    hideHeading={true}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <SelectedServicesList 
                  selectedServices={selectedServices}
                  mechanics={mechanics}
                  onRemoveService={handleRemoveService}
                  onCompleteCheckout={handleCompleteCheckout}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <ServiceHistoryList onSelect={handleSelectHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
