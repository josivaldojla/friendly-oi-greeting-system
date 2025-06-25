
import { useState } from "react";
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Edit2, Check, X } from "lucide-react";

interface ServiceListItemProps {
  service: Service;
  formatPrice: (price: number) => string;
  onRemove: (id: string) => void;
  onPriceChange?: (id: string, newPrice: number) => void;
}

const ServiceListItem = ({ 
  service, 
  formatPrice, 
  onRemove,
  onPriceChange 
}: ServiceListItemProps) => {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(service.price);

  const handlePriceClick = () => {
    if (onPriceChange) {
      setIsEditingPrice(true);
      setTempPrice(service.price);
    }
  };

  const handleSavePrice = () => {
    if (onPriceChange && tempPrice !== service.price) {
      onPriceChange(service.id, tempPrice);
    }
    setIsEditingPrice(false);
  };

  const handleCancelEdit = () => {
    setTempPrice(service.price);
    setIsEditingPrice(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSavePrice();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <li className="flex justify-between items-center py-2">
      <div className="flex-1">
        <span className="font-medium">{service.name}</span>
        {service.comment && (
          <p className="text-xs text-muted-foreground mt-1">{service.comment}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isEditingPrice ? (
          <div className="flex items-center gap-1">
            <Input
              type="number"
              value={tempPrice}
              onChange={(e) => setTempPrice(Number(e.target.value))}
              onKeyDown={handleKeyPress}
              className="w-20 h-8 text-sm"
              step="0.01"
              min="0"
              autoFocus
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-green-600 hover:bg-green-50"
              onClick={handleSavePrice}
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-red-600 hover:bg-red-50"
              onClick={handleCancelEdit}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span 
              className={`font-medium ${onPriceChange ? 'cursor-pointer hover:bg-gray-100 px-2 py-1 rounded' : ''}`}
              onClick={handlePriceClick}
              title={onPriceChange ? "Clique para editar o preço" : undefined}
            >
              {formatPrice(service.price)}
            </span>
            {onPriceChange && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-gray-400 hover:text-gray-600"
                onClick={handlePriceClick}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={() => onRemove(service.id)}
        >
          <Minus className="h-3 w-3" />
        </Button>
      </div>
    </li>
  );
};

export default ServiceListItem;
