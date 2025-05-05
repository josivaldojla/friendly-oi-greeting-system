
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
    <li className="py-3">
      <div className="flex flex-col w-full">
        {/* Service name taking full width */}
        <div className="w-full text-left mb-2">
          <span className="font-medium break-words whitespace-normal block">{service.name}</span>
        </div>
        
        {/* Description if available */}
        {service.description && (
          <div className="text-sm text-gray-500 text-left mb-2">
            {service.description}
          </div>
        )}
        
        {/* Price and actions in a responsive layout */}
        <div className="w-full">
          <div className="flex flex-wrap justify-between items-center gap-2">
            <span className="font-medium">{formatPrice(service.price)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(service.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full border-b border-gray-100 mt-2"></div>
        </div>
      </div>
    </li>
  );
};

export default ServiceListItem;
