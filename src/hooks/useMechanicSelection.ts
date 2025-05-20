
import { useState, useEffect } from "react";

const STORAGE_KEY_MECHANIC = "selectedMechanicId";
const STORAGE_KEY_HISTORY_ID = "currentHistoryId"; // Adicionado para limpar o histórico

export const useMechanicSelection = () => {
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>("");

  // Carregar dados do localStorage quando o hook for montado
  useEffect(() => {
    const savedMechanicId = localStorage.getItem(STORAGE_KEY_MECHANIC);
    if (savedMechanicId) {
      setSelectedMechanicId(savedMechanicId);
    }
  }, []);

  // Função modificada para limpar o histórico atual quando mudar o mecânico
  const handleSetMechanicId = (mechanicId: string) => {
    // Limpar o histórico atual para garantir que um novo será criado
    if (mechanicId !== selectedMechanicId) {
      localStorage.removeItem(STORAGE_KEY_HISTORY_ID);
    }
    
    setSelectedMechanicId(mechanicId);
  };

  // Salvar mechanic ID no localStorage
  useEffect(() => {
    if (selectedMechanicId) {
      localStorage.setItem(STORAGE_KEY_MECHANIC, selectedMechanicId);
    } else {
      localStorage.removeItem(STORAGE_KEY_MECHANIC);
    }
  }, [selectedMechanicId]);

  return {
    selectedMechanicId,
    setSelectedMechanicId: handleSetMechanicId
  };
};
