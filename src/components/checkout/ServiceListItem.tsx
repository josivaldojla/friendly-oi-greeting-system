
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
      <div className="flex flex-col w-full">
        {/* Service name taking full width */}
        <div className="w-full text-left mb-1">
          <span className="font-medium break-words whitespace-normal block">{service.name}</span>
        </div>
        
        {/* Description if available */}
        {service.description && (
          <div className="text-sm text-gray-500 text-left mb-1">
            {service.description}
          </div>
        )}
        
        {/* Price and actions aligned to right */}
        <div className="w-full">
          <div className="flex justify-end items-center">
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
          <div className="w-full border-b border-gray-100 mt-1"></div>
        </div>
      </div>
    </li>
  );
};

export default ServiceListItem;
