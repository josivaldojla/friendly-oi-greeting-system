
import { useState, useEffect } from "react";
import { Service } from "@/lib/types";
import { saveServiceHistory, updateServiceHistory } from "@/lib/storage";
import { format } from "date-fns";

const STORAGE_KEY_HISTORY_ID = "currentHistoryId";
const STORAGE_KEY_RECEIVED_AMOUNT = "receivedAmount";

interface UseServiceHistoryProps {
  selectedServices: Service[];
  selectedMechanicId: string;
}

export const useServiceHistory = ({ selectedServices, selectedMechanicId }: UseServiceHistoryProps) => {
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [lastSaveTimestamp, setLastSaveTimestamp] = useState<number>(0);

  // Carregar dados do localStorage quando o hook for montado
  useEffect(() => {
    const savedHistoryId = localStorage.getItem(STORAGE_KEY_HISTORY_ID);
    if (savedHistoryId) {
      console.log("Carregando histórico salvo com ID:", savedHistoryId);
      setCurrentHistoryId(savedHistoryId);
    }

    const savedReceivedAmount = localStorage.getItem(STORAGE_KEY_RECEIVED_AMOUNT);
    if (savedReceivedAmount) {
      setReceivedAmount(parseFloat(savedReceivedAmount));
    }
  }, []);

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

  // Criar um novo histórico quando um mecânico é selecionado
  useEffect(() => {
    const createInitialHistory = async () => {
      // Apenas criar um novo histórico se temos um mecânico selecionado, serviços 
      // e ainda não temos um ID de histórico atual
      if (selectedMechanicId && selectedServices.length > 0 && !currentHistoryId) {
        console.log("Nenhum histórico atual. Criando um novo...");
        const formattedDate = format(new Date(), "dd/MM/yyyy HH:mm");
        const registrationNumber = Math.floor(10000 + Math.random() * 90000); // 5-digit number
        const autoTitle = `Registro #${registrationNumber} - ${formattedDate}`;
        const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);
        
        try {
          const result = await saveServiceHistory({
            title: autoTitle,
            mechanic_id: selectedMechanicId,
            service_data: selectedServices,
            total_amount: totalAmount,
            received_amount: receivedAmount
          });
          
          if (result.length > 0) {
            const newHistoryId = result[0].id;
            console.log("Novo histórico criado com ID:", newHistoryId);
            setCurrentHistoryId(newHistoryId);
          }
        } catch (error) {
          console.error("Erro ao criar histórico inicial:", error);
        }
      }
    };
    
    createInitialHistory();
  }, [selectedMechanicId, selectedServices.length, currentHistoryId, receivedAmount]);

  // Auto save service history when conditions are met
  useEffect(() => {
    const autoSaveHistory = async () => {
      // Only save if we have services and a mechanic selected and a currentHistoryId
      if (selectedServices.length > 0 && selectedMechanicId && currentHistoryId) {
        const now = Date.now();
        // Only save if at least 2 seconds have passed since last save
        if (now - lastSaveTimestamp > 2000) {
          const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);
          
          try {
            // Atualizar histórico existente
            console.log("Atualizando histórico com ID:", currentHistoryId);
            await updateServiceHistory(currentHistoryId, {
              service_data: selectedServices,
              total_amount: totalAmount,
              received_amount: receivedAmount
            });
            console.log("Histórico atualizado com ID:", currentHistoryId);
            
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

  const clearHistory = () => {
    setCurrentHistoryId(null);
    setReceivedAmount(0);
    localStorage.removeItem(STORAGE_KEY_HISTORY_ID);
    localStorage.removeItem(STORAGE_KEY_RECEIVED_AMOUNT);
  };

  return {
    currentHistoryId,
    receivedAmount,
    setReceivedAmount,
    setCurrentHistoryId,
    clearHistory
  };
};
