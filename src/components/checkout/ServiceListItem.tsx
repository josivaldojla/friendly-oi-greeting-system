
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ServiceListItemProps {
  service: Service;
  index: number;
  formatPrice: (price: number) => string;
  onRemove: (id: string) => void;
}

const ServiceListItem = ({ service, formatPrice, onRemove }: ServiceListItemProps) => {
  return (
    <li className="py-2">
      <div className="flex justify-between items-center w-full">
        <div className="flex-1 text-left mr-4">
          <div className="font-medium break-words whitespace-normal block">{service.name}</div>
          
          {/* Description if available */}
          {service.description && (
            <div className="text-sm text-gray-500 text-left mt-1">
              {service.description}
            </div>
          )}
        </div>
        
        <div className="flex items-center shrink-0">
          <span className="font-medium mr-2">{formatPrice(service.price)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(service.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="w-full border-b border-gray-100 mt-2"></div>
    </li>
  );
};

export default ServiceListItem;
