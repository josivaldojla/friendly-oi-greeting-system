
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ServiceListItemProps {
  service: Service;
  formatPrice: (price: number) => string;
  onRemove: (id: string) => void;
}

const ServiceListItem = ({ service, formatPrice, onRemove }: ServiceListItemProps) => {
  return (
    <li className="py-3 w-full">
      <div className="flex flex-col w-full">
        {/* Nome do serviço com quebra de linha adequada */}
        <div className="w-full text-left mb-2">
          <span className="font-medium break-normal whitespace-normal block">{service.name}</span>
        </div>
        
        {/* Descrição se disponível */}
        {service.description && (
          <div className="text-sm text-gray-500 text-left mb-2">
            {service.description}
          </div>
        )}
        
        {/* Comentário se disponível */}
        {service.comment && (
          <div className="text-sm text-blue-600 text-left mb-2 italic">
            {service.comment.replace(/_/g, '')}
          </div>
        )}
        
        {/* Preço e ações alinhados à direita */}
        <div className="w-full">
          <div className="flex justify-end items-center gap-2">
            <span className="font-medium text-right">{formatPrice(service.price)}</span>
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
