
import React from "react";
import { Service, Mechanic } from "@/lib/types";
import SelectedServicesList from "@/components/checkout/SelectedServicesList";

interface CheckoutSidebarProps {
  selectedServices: Service[];
  mechanics: Mechanic[];
  onRemoveService: (id: string) => void;
  onCompleteCheckout: () => void;
  selectedMechanicId: string;
  onMechanicChange: (id: string) => void;
  receivedAmount: number;
  onReceivedAmountChange: (amount: number) => void;
  autoSave: boolean;
}

export const CheckoutSidebar = ({
  selectedServices,
  mechanics,
  onRemoveService,
  onCompleteCheckout,
  selectedMechanicId,
  onMechanicChange,
  receivedAmount,
  onReceivedAmountChange,
  autoSave
}: CheckoutSidebarProps) => {
  return (
    <SelectedServicesList 
      selectedServices={selectedServices}
      mechanics={mechanics}
      onRemoveService={onRemoveService}
      onCompleteCheckout={onCompleteCheckout}
      selectedMechanicId={selectedMechanicId}
      onMechanicChange={onMechanicChange}
      receivedAmount={receivedAmount}
      onReceivedAmountChange={onReceivedAmountChange}
      autoSave={autoSave}
    />
  );
};
