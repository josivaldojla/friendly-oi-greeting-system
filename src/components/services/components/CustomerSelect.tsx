
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

  // Atualiza o input quando customerSelection mudar
  useEffect(() => {
    if (customerSelection && customerSelection.name) {
      setCustomerInput(customerSelection.name);
    }
  }, [customerSelection]);

  const handleCustomerSelect = useCallback((customer: Customer, e: React.MouseEvent) => {
    // Evite a propagação do evento para não fechar o diálogo
    e.preventDefault();
    e.stopPropagation();
    
    // Defina a seleção do cliente
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
          <div className="w-full relative">
            <Input
              id="customer"
              value={customerInput}
              onChange={handleCustomerInputChange}
              onClick={() => setIsCustomerListOpen(true)}
              placeholder="Digite ou selecione um cliente"
              className="w-full cursor-pointer"
              autoComplete="off"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full p-0" 
          align="start"
          side="bottom"
          sideOffset={5}
          style={{ 
            backgroundColor: "white", 
            zIndex: 100,
            width: "var(--radix-popover-trigger-width)",
            maxHeight: "300px",
            overflowY: "auto"
          }}
          onInteractOutside={(e) => {
            // Prevent outside clicks from closing the dialog
            e.preventDefault(); 
            setIsCustomerListOpen(false);
          }}
        >
          <div className="max-h-56 overflow-auto rounded-md bg-popover p-1">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(customer => (
                <Button
                  key={customer.id}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={(e) => handleCustomerSelect(customer, e)}
                  type="button"
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
