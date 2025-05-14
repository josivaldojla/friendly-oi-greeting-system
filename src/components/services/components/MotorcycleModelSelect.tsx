
import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MotorcycleModel } from "@/lib/types";
import { getMotorcycleModels } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";

interface MotorcycleModelSelectProps {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
}

export const MotorcycleModelSelect = memo(({
  selectedModel,
  setSelectedModel
}: MotorcycleModelSelectProps) => {
  const [modelInput, setModelInput] = useState<string>("");
  const [isModelListOpen, setIsModelListOpen] = useState(false);
  const [filteredModels, setFilteredModels] = useState<MotorcycleModel[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Carregar modelos do banco de dados usando React Query
  const { data: motorcycleModels = [], isLoading } = useQuery({
    queryKey: ['motorcycleModels'],
    queryFn: getMotorcycleModels,
    staleTime: 10000, // 10 segundos
  });
  
  // Buscar nome do modelo selecionado quando o componente carrega
  useEffect(() => {
    if (selectedModel && motorcycleModels.length > 0) {
      const model = motorcycleModels.find(m => m.id === selectedModel);
      if (model) {
        setModelInput(model.name);
      }
    } else if (!selectedModel) {
      setModelInput("");
    }
  }, [selectedModel, motorcycleModels]);

  // Atualizar modelos filtrados quando o input muda
  useEffect(() => {
    if (modelInput) {
      const filtered = motorcycleModels.filter(model => 
        model.name.toLowerCase().includes(modelInput.toLowerCase()) ||
        (model.brand && model.brand.toLowerCase().includes(modelInput.toLowerCase()))
      );
      setFilteredModels(filtered);
    } else {
      setFilteredModels(motorcycleModels);
    }
  }, [modelInput, motorcycleModels]);

  // Detectar cliques fora do componente para fechar a lista
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsModelListOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Use useCallback para evitar renderizações desnecessárias
  const handleModelSelect = useCallback((model: MotorcycleModel) => {
    console.log("Selecionando modelo:", model);
    setSelectedModel(model.id);
    setModelInput(model.name);
    setIsModelListOpen(false);
  }, [setSelectedModel]);

  const handleModelInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setModelInput(value);
    
    // Mostrar a lista sempre que estiver digitando
    if (value.trim().length > 0) {
      setIsModelListOpen(true);
    }
  }, []);

  // Focar no input abre a lista
  const handleInputFocus = useCallback(() => {
    setIsModelListOpen(true);
  }, []);

  // Clicar no input também abre a lista
  const handleInputClick = useCallback(() => {
    setIsModelListOpen(true);
  }, []);

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label htmlFor="motorcycle-model">Modelo</Label>
      <div className="w-full relative">
        <Input
          id="motorcycle-model"
          value={modelInput}
          onChange={handleModelInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputClick}
          placeholder="Digite para pesquisar modelo"
          className="w-full bg-background"
          autoComplete="off"
        />
        
        {isModelListOpen && filteredModels.length > 0 && (
          <div 
            className="absolute z-[99999] w-full mt-1 rounded-md border border-gray-200 bg-white shadow-lg"
            style={{
              maxHeight: "300px",
              overflowY: "auto"
            }}
          >
            <div className="p-1">
              {isLoading ? (
                <div className="px-2 py-1 text-sm text-gray-500">
                  Carregando modelos...
                </div>
              ) : (
                filteredModels.map(model => (
                  <Button
                    key={model.id}
                    variant="ghost"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => handleModelSelect(model)}
                    type="button"
                  >
                    {model.brand ? `${model.name} (${model.brand})` : model.name}
                  </Button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MotorcycleModelSelect.displayName = "MotorcycleModelSelect";
