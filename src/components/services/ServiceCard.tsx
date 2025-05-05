
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  const handleCardClick = () => {
    if (selectable && showAddButton && onAddToSelection) {
      onAddToSelection(service);
    } else if (selectable && onClick) {
      onClick(service);
    }
  };

  return (
    <Card 
      className={selectable ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
      onClick={handleCardClick}
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
        <div className="flex flex-col">
          <h3 className="font-medium text-lg mb-2 break-words whitespace-normal text-left">
            {service.name}
          </h3>
          {service.description && (
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2 text-left">
              {service.description}
            </p>
          )}
          <div className="w-full border-b border-gray-100 flex justify-end items-center mt-2 pb-2">
            <span className="font-bold text-moto-blue mr-2">{formatPrice(service.price)}</span>
            <div onClick={(e) => e.stopPropagation()} className="flex">
              {showAddButton && onAddToSelection && !isMobile && (
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToSelection(service);
                  }}
                  className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
