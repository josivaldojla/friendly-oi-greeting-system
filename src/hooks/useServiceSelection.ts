
import { useState, useEffect } from "react";
import { Service } from "@/lib/types";

const STORAGE_KEY = "selectedServices";

export const useServiceSelection = () => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  // Carregar dados do localStorage quando o hook for montado
  useEffect(() => {
    try {
      const savedServices = localStorage.getItem(STORAGE_KEY);
      if (savedServices) {
        setSelectedServices(JSON.parse(savedServices));
      }
    } catch (error) {
      console.error('Erro ao carregar serviços salvos:', error);
    }
  }, []);

  // Salvar serviços selecionados no localStorage sempre que forem alterados
  useEffect(() => {
    if (selectedServices.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedServices));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedServices]);

  const addService = (service: Service, comment?: string) => {
    setSelectedServices(prev => [
      ...prev,
      comment ? { ...service, comment } : { ...service }
    ]);
  };

  const removeService = (id: string) => {
    setSelectedServices(selectedServices.filter(service => service.id !== id));
  };

  const updateServicePrice = (serviceId: string, newPrice: number) => {
    setSelectedServices(prevServices => 
      prevServices.map(service => 
        service.id === serviceId 
          ? { ...service, price: newPrice }
          : service
      )
    );
  };

  const clearServices = () => {
    setSelectedServices([]);
  };

  return {
    selectedServices,
    setSelectedServices,
    addService,
    removeService,
    updateServicePrice,
    clearServices
  };
};
