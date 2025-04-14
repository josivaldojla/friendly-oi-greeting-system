
import { useState, useEffect } from "react";
import { Service, Mechanic, ViewMode } from "@/lib/types";
import { getServices, getMechanics } from "@/lib/storage";
import ServiceList from "@/components/services/ServiceList";
import ServiceDetail from "@/components/checkout/ServiceDetail";
import SelectedServicesList from "@/components/checkout/SelectedServicesList";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";

const CheckoutPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  useEffect(() => {
    setServices(getServices());
    setMechanics(getMechanics());
  }, []);

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  const handleAddToSelection = (service: Service) => {
    if (selectedServices.some(s => s.id === service.id)) {
      toast.info("Este serviço já foi adicionado");
      return;
    }
    
    setSelectedServices([...selectedServices, service]);
    toast.success(`${service.name} adicionado à seleção`);
  };

  const handleRemoveService = (id: string) => {
    setSelectedServices(selectedServices.filter(service => service.id !== id));
  };

  const handleCompleteCheckout = () => {
    setSelectedServices([]);
    setSelectedService(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Caixa</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ServiceList
                services={services}
                onAddService={() => {}}
                onUpdateService={() => {}}
                onDeleteService={() => {}}
                selectable={true}
                onSelectService={handleSelectService}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              
              <div className="block lg:hidden">
                <ServiceDetail 
                  service={selectedService} 
                  onAddToSelection={handleAddToSelection}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="hidden lg:block">
              <ServiceDetail 
                service={selectedService} 
                onAddToSelection={handleAddToSelection}
              />
            </div>
            
            <SelectedServicesList 
              selectedServices={selectedServices}
              mechanics={mechanics}
              onRemoveService={handleRemoveService}
              onCompleteCheckout={handleCompleteCheckout}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
