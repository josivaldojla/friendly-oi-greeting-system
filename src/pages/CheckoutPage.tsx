
import { useState, useEffect } from "react";
import { Service, Mechanic, ViewMode, ServiceHistory } from "@/lib/types";
import { getServices, getMechanics } from "@/lib/storage";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { useServiceSelection } from "@/hooks/useServiceSelection";
import { useMechanicSelection } from "@/hooks/useMechanicSelection";
import { useServiceHistory } from "@/hooks/useServiceHistory";
import { ServiceTabs } from "@/components/checkout/ServiceTabs";
import { ServiceListWrapper } from "@/components/checkout/ServiceListWrapper";
import { CheckoutSidebar } from "@/components/checkout/CheckoutSidebar";

const CheckoutPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("services");
  
  // Custom hooks
  const { selectedServices, addService, removeService, clearServices, setSelectedServices } = useServiceSelection();
  const { selectedMechanicId, setSelectedMechanicId } = useMechanicSelection();
  const { receivedAmount, setReceivedAmount, clearHistory, setCurrentHistoryId } = useServiceHistory({
    selectedServices,
    selectedMechanicId
  });

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

  const handleAddToSelection = (service: Service, comment?: string) => {
    addService(service, comment);
    const msg = comment 
      ? `${service.name} adicionado à seleção com comentário`
      : `${service.name} adicionado à seleção`;
    toast.success(msg);
  };

  const handleCompleteCheckout = () => {
    // Limpar tudo ao finalizar o checkout
    clearServices();
    setSelectedMechanicId("");
    clearHistory();
    
    toast.success("Checkout finalizado com sucesso!");
  };

  const handleSelectHistory = (history: ServiceHistory) => {
    // IMPORTANTE: Limpar o histórico atual para garantir que um novo será criado depois
    clearHistory();
    
    // Adicionar serviços do histórico à seleção atual
    setSelectedServices(history.service_data);
    setSelectedMechanicId(history.mechanic_id);
    setReceivedAmount(history.received_amount);
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
        
        <ServiceTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onSelectHistory={handleSelectHistory}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ServiceListWrapper 
                services={services}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onAddToSelection={handleAddToSelection}
              />
            </div>
            
            <div className="space-y-6">
              <CheckoutSidebar 
                selectedServices={selectedServices}
                mechanics={mechanics}
                onRemoveService={removeService}
                onCompleteCheckout={handleCompleteCheckout}
                selectedMechanicId={selectedMechanicId}
                onMechanicChange={setSelectedMechanicId}
                receivedAmount={receivedAmount}
                onReceivedAmountChange={setReceivedAmount}
                autoSave={true}
              />
            </div>
          </div>
        </ServiceTabs>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
