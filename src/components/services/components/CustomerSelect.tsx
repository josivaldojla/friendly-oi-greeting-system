
import React, { useState, useEffect, useCallback } from "react";
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
  const inputRef = React.useRef<HTMLInputElement>(null);
  
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

  // Atualizar clientes filtrados quando o input muda ou quando a lista é aberta
  useEffect(() => {
    if (isCustomerListOpen) {
      if (customerInput) {
        const filtered = customers.filter(customer => 
          customer.name.toLowerCase().includes(customerInput.toLowerCase())
        );
        setFilteredCustomers(filtered);
      } else {
        setFilteredCustomers(customers);
      }
    }
  }, [isCustomerListOpen, customerInput, customers]);

  const handleCustomerSelect = useCallback((customer: Customer) => {
    console.log("Selecionando cliente:", customer);
    
    // Definir seleção com ID e nome
    setCustomerSelection({ 
      id: customer.id, 
      name: customer.name,
      isNew: false
    });
    
    // Definir o input primeiro antes de fechar a lista
    setCustomerInput(customer.name);
    
    // Fechar a lista IMEDIATAMENTE após a seleção
    setIsCustomerListOpen(false);
    
    // Manter o foco no input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [setCustomerSelection]);

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
    
    // Mostrar resultados filtrados conforme o usuário digita
    if (value) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
      
      // Só abrir a lista se houver resultados
      setIsCustomerListOpen(filtered.length > 0);
    } else {
      // Mostrar todos os clientes quando não há entrada
      setFilteredCustomers(customers);
      setIsCustomerListOpen(!!customers.length);
    }
  };

  // Lidar com foco e clique no input
  const handleInputFocus = () => {
    console.log("Input recebeu foco, clientes disponíveis:", customers.length);
    
    // Não abrir a lista se o campo já tem um valor selecionado
    if (customerSelection && customerSelection.id) {
      console.log("Cliente já selecionado, não abrindo lista");
      return;
    }
    
    // Abrir a lista se houver clientes disponíveis
    if (customers.length > 0) {
      setIsCustomerListOpen(true);
      
      if (customerInput) {
        const filtered = customers.filter(customer => 
          customer.name.toLowerCase().includes(customerInput.toLowerCase())
        );
        setFilteredCustomers(filtered.length > 0 ? filtered : customers);
      } else {
        setFilteredCustomers(customers);
      }
    }
  };

  // Função para lidar com clique fora da lista
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setIsCustomerListOpen(false);
    }
  }, []);

  // Adicionar e remover o event listener para cliques fora
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="space-y-2">
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
          ref={inputRef}
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
