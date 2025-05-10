
import React, { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers,
    staleTime: 60000, // 1 minuto
  });
  
  // Log para depuração
  useEffect(() => {
    console.log("CustomerSelect - Customers loaded:", customers);
  }, [customers]);

  // Update input when customerSelection changes
  useEffect(() => {
    if (customerSelection && customerSelection.name) {
      setCustomerInput(customerSelection.name);
    }
  }, [customerSelection]);

  // Reset filtered customers when opening the list
  useEffect(() => {
    if (isCustomerListOpen) {
      if (customerInput) {
        const filtered = customers.filter(customer => 
          customer.name.toLowerCase().includes(customerInput.toLowerCase())
        );
        setFilteredCustomers(filtered);
      } else {
        // Mostrar todos os clientes quando não há entrada
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
    
    // Importante: definir o input primeiro antes de fechar o popover
    setCustomerInput(customer.name);
    
    // Fechar o popover após a seleção
    setTimeout(() => {
      setIsCustomerListOpen(false);
      
      // Manter o foco no input
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, [setCustomerSelection]);

  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerInput(value);
    
    // Update selection if value is different
    if (value !== customerSelection?.name) {
      setCustomerSelection({ 
        name: value, 
        isNew: true 
      });
    }
    
    // Show filtered results as user types
    if (value) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
      if (filtered.length > 0) {
        setIsCustomerListOpen(true);
      } else {
        setIsCustomerListOpen(false);
      }
    } else {
      // Mostrar todos os clientes quando não há entrada
      setFilteredCustomers(customers);
      setIsCustomerListOpen(!!customers.length);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    // Mostrar todos os clientes ao focar se não houver filtro
    if (!customerInput && customers.length > 0) {
      setFilteredCustomers(customers);
      setIsCustomerListOpen(true);
    } else if (customerInput) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(customerInput.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setIsCustomerListOpen(filtered.length > 0);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="customer">Cliente</Label>
      <Popover 
        open={isCustomerListOpen} 
        onOpenChange={setIsCustomerListOpen}
      >
        <PopoverTrigger asChild>
          <div className="w-full relative">
            <Input
              id="customer"
              value={customerInput}
              onChange={handleCustomerInputChange}
              onFocus={handleInputFocus}
              placeholder="Digite para pesquisar ou adicionar cliente"
              className="w-full"
              autoComplete="off"
              ref={inputRef}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0" 
          align="start"
          side="bottom"
          sideOffset={5}
          avoidCollisions={false}
          style={{ 
            backgroundColor: "white", 
            zIndex: 999,
            width: "var(--radix-popover-trigger-width)",
            maxHeight: "300px",
            overflowY: "auto"
          }}
        >
          <div className="max-h-56 overflow-auto rounded-md bg-white p-1">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <Button
                  key={customer.id}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCustomerSelect(customer);
                  }}
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
        </PopoverContent>
      </Popover>
    </div>
  );
};
