
import { useState, useEffect } from "react";

const STORAGE_KEY_MECHANIC = "selectedMechanicId";

export const useMechanicSelection = () => {
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>("");

  // Carregar dados do localStorage quando o hook for montado
  useEffect(() => {
    const savedMechanicId = localStorage.getItem(STORAGE_KEY_MECHANIC);
    if (savedMechanicId) {
      setSelectedMechanicId(savedMechanicId);
    }
  }, []);

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
    setSelectedMechanicId
  };
};
