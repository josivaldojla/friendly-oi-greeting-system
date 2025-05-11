
import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Customer, CustomerSelection } from "@/lib/types";
import { getCustomers } from "@/lib/storage";
import { useQuery } from "@tanstack/react-query";

interface CustomerSelectProps {
  customerSelection: CustomerSelection;
  setCustomerSelection: (customer: CustomerSelection) => void;
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({
  customerSelection,
  setCustomerSelection
}) => {
  const [customerInput, setCustomerInput] = useState<string>("");
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Carregar clientes do banco de dados usando React Query
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    staleTime: 10000, // 10 segundos
  });
  
  // Log para depuração
  useEffect(() => {
    console.log("CustomerSelect - Clientes carregados:", customers);
  }, [customers]);

  // Atualizar o input quando customerSelection muda
  useEffect(() => {
    if (customerSelection && customerSelection.name) {
      setCustomerInput(customerSelection.name);
    }
  }, [customerSelection]);

  // Atualizar clientes filtrados quando o input muda
  useEffect(() => {
    if (customerInput) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(customerInput.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [customerInput, customers]);

  // Detectar cliques fora do componente para fechar a lista
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsCustomerListOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCustomerSelect = (customer: Customer) => {
    console.log("Selecionando cliente:", customer);
    
    // Definir seleção com ID e nome
    setCustomerSelection({ 
      id: customer.id, 
      name: customer.name,
      isNew: false
    });
    
    // Definir o input e fechar a lista imediatamente
    setCustomerInput(customer.name);
    setIsCustomerListOpen(false);
  };

  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerInput(value);
    
    // Atualizar seleção se o valor for diferente
    if (value !== customerSelection?.name) {
      setCustomerSelection({ 
        name: value, 
        isNew: true 
      });
    }
    
    // Mostrar a lista se estiver digitando
    setIsCustomerListOpen(true);
  };

  // Lidar com foco e clique no input
  const handleInputFocus = () => {
    setIsCustomerListOpen(true);
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label htmlFor="customer">Cliente</Label>
      <div className="w-full relative">
        <Input
          id="customer"
          value={customerInput}
          onChange={handleCustomerInputChange}
          onFocus={handleInputFocus}
          onClick={handleInputFocus}
          placeholder="Digite para pesquisar ou adicionar cliente"
          className="w-full"
          autoComplete="off"
        />
        
        {isCustomerListOpen && (
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
                  Carregando clientes...
                </div>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <Button
                    key={customer.id}
                    variant="ghost"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => handleCustomerSelect(customer)}
                    type="button"
                  >
                    {customer.name}
                  </Button>
                ))
              ) : (
                <div className="px-2 py-1 text-sm text-gray-500">
                  Nenhum cliente encontrado
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
