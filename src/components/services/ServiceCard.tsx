
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

interface ServiceCardProps {
  service: Service;
  selectable?: boolean;
  onEdit: (service: Service, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick?: (service: Service) => void;
  formatPrice: (price: number) => string;
  onAddToSelection?: (service: Service) => void;
  showAddButton?: boolean;
}

export const ServiceCard = ({
  service,
  selectable,
  onEdit,
  onDelete,
  onClick,
  formatPrice,
  onAddToSelection,
  showAddButton = false
}: ServiceCardProps) => {
  return (
    <Card 
      className={selectable ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
      onClick={selectable ? () => onClick?.(service) : undefined}
    >
      <div className="relative h-40">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.name} 
            className="w-full h-full object-cover rounded-t-lg" 
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center rounded-t-lg">
            <ImagePlaceholder size={48} />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg line-clamp-1">{service.name}</h3>
          <span className="font-bold text-moto-blue">{formatPrice(service.price)}</span>
        </div>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
          {service.description || "Sem descrição"}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end space-x-2">
        <div onClick={(e) => e.stopPropagation()} className="flex space-x-2">
          {showAddButton && onAddToSelection && (
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onAddToSelection(service);
              }}
              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 w-full"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          )}
          {!showAddButton && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => onEdit(service, e)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => onDelete(service.id, e)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
