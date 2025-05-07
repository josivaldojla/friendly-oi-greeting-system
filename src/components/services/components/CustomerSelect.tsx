
import React, { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Customer, CustomerSelection } from "@/lib/types";
import { mockCustomers } from "@/lib/mock-data";
import { getCustomers } from "@/lib/storage";

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
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Carregar clientes do banco de dados
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const fetchedCustomers = await getCustomers();
        if (fetchedCustomers && fetchedCustomers.length > 0) {
          setCustomers(fetchedCustomers);
        } else {
          setCustomers(mockCustomers);
        }
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        setCustomers(mockCustomers);
      }
    };
    
    loadCustomers();
  }, []);

  // Reset filtered customers when opening the list, but don't show any by default
  useEffect(() => {
    if (isCustomerListOpen && customerInput) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(customerInput.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else if (!customerInput) {
      setFilteredCustomers([]);
    }
  }, [isCustomerListOpen, customerInput, customers]);

  // Update input when customerSelection changes
  useEffect(() => {
    if (customerSelection && customerSelection.name) {
      setCustomerInput(customerSelection.name);
    }
  }, [customerSelection]);

  const handleCustomerSelect = useCallback((customer: Customer, e: React.MouseEvent) => {
    // Prevent event propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Set the selected customer
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
    
    // Only update selection if value is different
    if (value !== customerSelection.name) {
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
      }
    } else {
      setFilteredCustomers([]);
      setIsCustomerListOpen(false);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (customerInput) {
      const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(customerInput.toLowerCase())
      );
      setFilteredCustomers(filtered);
      if (filtered.length > 0) {
        setIsCustomerListOpen(true);
      }
    }
  };

  const handleClickOutside = () => {
    setIsCustomerListOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="customer">Cliente</Label>
      <Popover 
        open={isCustomerListOpen} 
        onOpenChange={(open) => {
          if (!open) {
            handleClickOutside();
          }
          setIsCustomerListOpen(open);
        }}
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
            />
          </div>
        </PopoverTrigger>
        {filteredCustomers.length > 0 && (
          <PopoverContent 
            className="w-full p-0" 
            align="start"
            side="bottom"
            sideOffset={5}
            avoidCollisions={false}
            style={{ 
              backgroundColor: "white", 
              zIndex: 500,
              width: "var(--radix-popover-trigger-width)",
              maxHeight: "300px",
              overflowY: "auto"
            }}
            onInteractOutside={(e) => {
              e.preventDefault();
              setIsCustomerListOpen(false);
            }}
          >
            <div className="max-h-56 overflow-auto rounded-md bg-popover p-1">
              {filteredCustomers.map(customer => (
                <Button
                  key={customer.id}
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={(e) => handleCustomerSelect(customer, e)}
                  type="button"
                >
                  {customer.name}
                </Button>
              ))}
            </div>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
};
