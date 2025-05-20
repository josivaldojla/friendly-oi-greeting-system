
interface ServiceTotalsSummaryProps {
  totalAmount: number;
  receivedAmount: number;
  remainingAmount: number;
  formatPrice: (price: number) => string;
}

export const ServiceTotalsSummary = ({ 
  totalAmount, 
  receivedAmount, 
  remainingAmount,
  formatPrice 
}: ServiceTotalsSummaryProps) => {
  return (
    <div className="mt-4 pt-2 border-t">
      <div className="flex justify-between">
        <span>Total:</span>
        <span className="font-bold">{formatPrice(totalAmount)}</span>
      </div>
      <div className="flex justify-between">
        <span>Adiantado:</span>
        <span>{formatPrice(receivedAmount)}</span>
      </div>
      <div className="flex justify-between">
        <span>Restante:</span>
        <span className="font-bold">{formatPrice(remainingAmount)}</span>
      </div>
    </div>
  );
};
