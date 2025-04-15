
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";

interface ServiceListItemProps {
  service: Service;
  selectable?: boolean;
  onEdit: (service: Service, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick?: (service: Service) => void;
  formatPrice: (price: number) => string;
}

export const ServiceListItem = ({
  service,
  selectable,
  onEdit,
  onDelete,
  onClick,
  formatPrice
}: ServiceListItemProps) => {
  return (
    <TableRow 
      className={selectable ? "cursor-pointer hover:bg-muted/50" : ""}
      onClick={selectable ? () => onClick?.(service) : undefined}
    >
      <TableCell>
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
      <TableCell className="font-medium">{service.name}</TableCell>
      <TableCell>{formatPrice(service.price)}</TableCell>
      <TableCell className="hidden md:table-cell max-w-xs truncate">
        {service.description || "-"}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
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
        </div>
      </TableCell>
    </TableRow>
  );
};
