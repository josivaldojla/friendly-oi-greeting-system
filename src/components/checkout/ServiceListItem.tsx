
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
    <li className="py-2 border-b border-gray-100">
      <div className="flex flex-col">
        <div className="w-full text-left">
          <span className="font-medium break-words whitespace-normal block">{service.name}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          {service.description && (
            <div className="text-sm text-gray-500 mr-2 text-left">
              {service.description}
            </div>
          )}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <span>{formatPrice(service.price)}</span>
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
      </div>
    </li>
  );
};

export default ServiceListItem;
