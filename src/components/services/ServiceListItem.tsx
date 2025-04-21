
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceListItemProps {
  service: Service;
  selectable?: boolean;
  onEdit: (service: Service, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick?: (service: Service) => void;
  formatPrice: (price: number) => string;
  onAddToSelection?: (service: Service) => void;
  showAddButton?: boolean;
}

export const ServiceListItem = ({
  service,
  selectable,
  onEdit,
  onDelete,
  onClick,
  formatPrice,
  onAddToSelection,
  showAddButton = false
}: ServiceListItemProps) => {
  const isMobile = useIsMobile();
  
  const handleRowClick = () => {
    if (selectable && showAddButton && onAddToSelection) {
      onAddToSelection(service);
    } else if (selectable && onClick) {
      onClick(service);
    }
  };

  return (
    <TableRow 
      className={selectable ? "cursor-pointer hover:bg-muted/50" : ""}
      onClick={handleRowClick}
    >
      <TableCell className="w-[10%] pl-4">
        {service.imageUrl ? (
          <img 
            src={service.imageUrl} 
            alt={service.name} 
            className="w-12 h-12 object-cover rounded" 
          />
        ) : (
          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
            <ImagePlaceholder />
          </div>
        )}
      </TableCell>
      <TableCell className="w-[25%] font-medium truncate">
        {service.name}
      </TableCell>
      <TableCell className="w-[15%] text-right">
        {formatPrice(service.price)}
      </TableCell>
      <TableCell className="w-[35%] hidden md:table-cell truncate">
        {service.description || "-"}
      </TableCell>
      <TableCell className="w-[15%] text-right pr-4">
        <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
          {showAddButton && onAddToSelection && !isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToSelection(service);
              }}
              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Comentario
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
      </TableCell>
    </TableRow>
  );
};
