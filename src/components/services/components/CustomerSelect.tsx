
import React, { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Customer, CustomerSelection } from "@/lib/types";
import { mockCustomers } from "@/lib/mock-data";

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
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);

  // Filtra clientes quando o input muda
  useEffect(() => {
    if (customerInput) {
      const filtered = mockCustomers.filter(customer => 
        customer.name.toLowerCase().includes(customerInput.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(mockCustomers);
    }
  }, [customerInput]);

  // Atualiza o input quando customerSelection mudar, mas evita loops
  useEffect(() => {
    if (customerSelection && customerSelection.name && customerInput !== customerSelection.name) {
      setCustomerInput(customerSelection.name);
    }
  }, [customerSelection, customerInput]);

  const handleCustomerSelect = useCallback((customer: Customer) => {
    // Defina a seleção uma única vez
    setCustomerSelection({ 
      id: customer.id, 
      name: customer.name,
      isNew: false
    });
    
    setCustomerInput(customer.name);
    setIsCustomerListOpen(false);
  }, [setCustomerSelection]);

  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerInput(value);
    
    // Só atualize a seleção se o valor for diferente
    if (value !== customerSelection.name) {
      setCustomerSelection({ 
        name: value, 
        isNew: true 
      });
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
          <Input
            id="customer"
            value={customerInput}
            onChange={handleCustomerInputChange}
            onClick={() => setIsCustomerListOpen(true)}
            placeholder="Digite ou selecione um cliente"
            className="w-full"
          />
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0" 
          align="start"
          style={{ backgroundColor: "white", zIndex: 50 }}
        >
          <div className="max-h-56 overflow-auto rounded-md bg-popover p-1">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <Button
                  key={customer.id}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => handleCustomerSelect(customer)}
                >
                  {customer.name}
                </Button>
              ))
            ) : (
              <div className="p-2 text-sm text-muted-foreground">
                Nenhum cliente encontrado. Digite para adicionar.
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
