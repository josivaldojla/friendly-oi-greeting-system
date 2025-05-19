
import { useState, useEffect } from "react";
import { Service, Mechanic, ViewMode, ServiceHistory } from "@/lib/types";
import { 
  getServices, 
  getMechanics, 
  addService, 
  updateService, 
  deleteService, 
  saveServiceHistory, 
  getLatestServiceHistoryByMechanicId,
  updateServiceHistory 
} from "@/lib/storage";
import ServiceList from "@/components/services/ServiceList";
import SelectedServicesList from "@/components/checkout/SelectedServicesList";
import ServiceHistoryList from "@/components/checkout/ServiceHistoryList";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { format } from "date-fns";

const STORAGE_KEY = "selectedServices";
const STORAGE_KEY_MECHANIC = "selectedMechanicId";
const STORAGE_KEY_RECEIVED_AMOUNT = "receivedAmount";
const STORAGE_KEY_HISTORY_ID = "currentHistoryId";

const CheckoutPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>("");
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("services");
  const [lastSaveTimestamp, setLastSaveTimestamp] = useState<number>(0);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  // Carregar dados do localStorage quando o componente for montado
  useEffect(() => {
    const loadSavedServices = () => {
      try {
        const savedServices = localStorage.getItem(STORAGE_KEY);
        if (savedServices) {
          setSelectedServices(JSON.parse(savedServices));
        }

        const savedMechanicId = localStorage.getItem(STORAGE_KEY_MECHANIC);
        if (savedMechanicId) {
          setSelectedMechanicId(savedMechanicId);
        }

        const savedReceivedAmount = localStorage.getItem(STORAGE_KEY_RECEIVED_AMOUNT);
        if (savedReceivedAmount) {
          setReceivedAmount(parseFloat(savedReceivedAmount));
        }
        
        const savedHistoryId = localStorage.getItem(STORAGE_KEY_HISTORY_ID);
        if (savedHistoryId) {
          setCurrentHistoryId(savedHistoryId);
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

  // Salvar mechanic ID no localStorage
  useEffect(() => {
    if (selectedMechanicId) {
      localStorage.setItem(STORAGE_KEY_MECHANIC, selectedMechanicId);
      
      // Verificar se já existe um histórico para este mecânico
      const checkExistingHistory = async () => {
        const latestHistory = await getLatestServiceHistoryByMechanicId(selectedMechanicId);
        if (latestHistory) {
          // Se encontrou um histórico recente (menos de 1 hora), use-o
          const historyTime = new Date(latestHistory.created_at).getTime();
          const currentTime = new Date().getTime();
          const oneHour = 60 * 60 * 1000;
          
          // Se estiver dentro de 1 hora, use esse ID
          // E se não tivermos um ID definido ainda
          if (currentTime - historyTime < oneHour && !currentHistoryId) {
            console.log("Usando histórico existente recente com ID:", latestHistory.id);
            setCurrentHistoryId(latestHistory.id);
            localStorage.setItem(STORAGE_KEY_HISTORY_ID, latestHistory.id);
          } else if (currentHistoryId) {
            console.log("Mantendo histórico atual com ID:", currentHistoryId);
          } else {
            // Caso contrário, nenhum histórico adequado encontrado, será criado um novo
            console.log("Nenhum histórico recente encontrado, um novo será criado");
          }
        }
      };
      
      // Somente verifique um histórico existente se não tivermos um atual
      // E se estamos iniciando uma nova sessão de serviços
      if (!currentHistoryId && selectedServices.length > 0) {
        checkExistingHistory();
      }
    } else {
      localStorage.removeItem(STORAGE_KEY_MECHANIC);
    }
  }, [selectedMechanicId, currentHistoryId, selectedServices.length]);

  // Salvar valor recebido no localStorage
  useEffect(() => {
    if (receivedAmount > 0) {
      localStorage.setItem(STORAGE_KEY_RECEIVED_AMOUNT, receivedAmount.toString());
    } else {
      localStorage.removeItem(STORAGE_KEY_RECEIVED_AMOUNT);
    }
  }, [receivedAmount]);
  
  // Salvar currentHistoryId no localStorage
  useEffect(() => {
    if (currentHistoryId) {
      localStorage.setItem(STORAGE_KEY_HISTORY_ID, currentHistoryId);
    } else {
      localStorage.removeItem(STORAGE_KEY_HISTORY_ID);
    }
  }, [currentHistoryId]);

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

  // Auto save service history when conditions are met
  useEffect(() => {
    const autoSaveHistory = async () => {
      // Only save if we have services and a mechanic selected
      if (selectedServices.length > 0 && selectedMechanicId) {
        const now = Date.now();
        // Only save if at least 2 seconds have passed since last save
        if (now - lastSaveTimestamp > 2000) {
          const formattedDate = format(new Date(), "dd/MM/yyyy HH:mm");
          const registrationNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number
          
          const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);
          
          try {
            if (currentHistoryId) {
              // Atualizar histórico existente
              console.log("Atualizando histórico com ID:", currentHistoryId);
              await updateServiceHistory(currentHistoryId, {
                service_data: selectedServices,
                total_amount: totalAmount,
                received_amount: receivedAmount
              });
              console.log("Histórico atualizado com ID:", currentHistoryId);
            } else {
              // Criar novo histórico
              console.log("Criando novo histórico...");
              const autoTitle = `Registro #${registrationNumber} - ${formattedDate}`;
              const result = await saveServiceHistory({
                title: autoTitle,
                mechanic_id: selectedMechanicId,
                service_data: selectedServices,
                total_amount: totalAmount,
                received_amount: receivedAmount
              });
              
              // Salvar o ID do novo histórico criado
              if (result.length > 0) {
                const newHistoryId = result[0].id;
                console.log("Novo histórico criado com ID:", newHistoryId);
                setCurrentHistoryId(newHistoryId);
                localStorage.setItem(STORAGE_KEY_HISTORY_ID, newHistoryId);
              }
            }
            
            setLastSaveTimestamp(now);
          } catch (error) {
            console.error('Error auto-saving service history:', error);
          }
        }
      }
    };

    // Debounce the auto save for 2 seconds after changes
    const debounceTimer = setTimeout(() => {
      autoSaveHistory();
    }, 2000);

    return () => clearTimeout(debounceTimer);
  }, [selectedServices, selectedMechanicId, receivedAmount, lastSaveTimestamp, currentHistoryId]);

  // Função para adicionar um serviço
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
    // Limpar tudo ao finalizar o checkout
    setSelectedServices([]);
    setReceivedAmount(0);
    setSelectedMechanicId("");
    setCurrentHistoryId(null);
    
    // Limpar localStorage ao finalizar
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_MECHANIC);
    localStorage.removeItem(STORAGE_KEY_RECEIVED_AMOUNT);
    localStorage.removeItem(STORAGE_KEY_HISTORY_ID);
    
    toast.success("Checkout finalizado com sucesso!");
  };

  const handleSelectHistory = (history: ServiceHistory) => {
    // Limpar o histórico atual quando selecionar um histórico existente
    setCurrentHistoryId(history.id);
    // Adicionar serviços do histórico à seleção atual
    setSelectedServices(history.service_data);
    setSelectedMechanicId(history.mechanic_id);
    setReceivedAmount(history.received_amount);
    toast.success(`Histórico "${history.title}" carregado com ${history.service_data.length} serviços`);
    // Mudar para a aba de serviços
    setActiveTab("services");
  };

  const handleReceivedAmountChange = (amount: number) => {
    setReceivedAmount(amount);
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
                  selectedMechanicId={selectedMechanicId}
                  onMechanicChange={setSelectedMechanicId}
                  receivedAmount={receivedAmount}
                  onReceivedAmountChange={handleReceivedAmountChange}
                  autoSave={true}
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
