
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
    <li className="py-2 flex justify-between items-center">
      <span>{service.name}</span>
      <div className="flex items-center gap-4">
        <span className="font-medium">{formatPrice(service.price)}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(service.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
};

export default ServiceListItem;
