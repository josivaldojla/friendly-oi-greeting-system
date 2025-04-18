
interface ServiceTotalsProps {
  totalAmount: number;
  receivedAmount: number;
  remainingAmount: number;
  formatPrice: (price: number) => string;
  onReceivedAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ServiceTotals = ({ 
  totalAmount, 
  receivedAmount, 
  remainingAmount, 
  formatPrice,
  onReceivedAmountChange 
}: ServiceTotalsProps) => {
  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex justify-between items-center font-medium">
        <span>Total:</span>
        <span>{formatPrice(totalAmount)}</span>
      </div>

      <div>
        <Label htmlFor="received">Valor Recebido</Label>
        <Input
          id="received"
          type="number"
          min="0"
          step="0.01"
          value={receivedAmount || ''}
          onChange={onReceivedAmountChange}
        />
      </div>

      <div className="flex justify-between items-center font-bold text-lg">
        <span>Total a Pagar:</span>
        <span className={remainingAmount < 0 ? "text-green-600" : remainingAmount > 0 ? "text-red-600" : ""}>
          {formatPrice(remainingAmount)}
        </span>
      </div>
    </div>
  );
};

export default ServiceTotals;
