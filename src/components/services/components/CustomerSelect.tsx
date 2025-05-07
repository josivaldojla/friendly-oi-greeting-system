
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
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  // Reset filtered customers when opening the list, but don't show any by default
  useEffect(() => {
    if (isCustomerListOpen && customerInput) {
      const filtered = mockCustomers.filter(customer => 
        customer.name.toLowerCase().includes(customerInput.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [isCustomerListOpen, customerInput]);

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
      const filtered = mockCustomers.filter(customer => 
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setIsCustomerListOpen(true);
    } else {
      setFilteredCustomers([]);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    // Don't show the list automatically on first focus
    // User needs to type something first
    setIsCustomerListOpen(false);
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
            />
          </div>
        </PopoverTrigger>
        {filteredCustomers.length > 0 && (
          <PopoverContent 
            className="w-full p-0" 
            align="start"
            side="bottom"
            sideOffset={5}
            style={{ 
              backgroundColor: "white", 
              zIndex: 200,
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
