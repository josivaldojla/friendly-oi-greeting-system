
import React, { useState } from "react";
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, MessageCirclePlus } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useIsMobile } from "@/hooks/use-mobile";
import { CommentDialog } from "./components/CommentDialog";

interface ServiceListItemProps {
  service: Service;
  selectable?: boolean;
  onEdit: (service: Service, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClick?: (service: Service) => void;
  formatPrice: (price: number) => string;
  onAddToSelection?: (service: Service, comment?: string) => void;
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
  const [isCommenting, setIsCommenting] = useState(false);

  const handleRowClick = () => {
    if (selectable && showAddButton && onAddToSelection && !isCommenting) {
      onAddToSelection(service);
    } else if (selectable && onClick) {
      onClick(service);
    }
  };

  const handleCommentSave = (formattedComment: string) => {
    if (onAddToSelection) {
      onAddToSelection(service, formattedComment);
    }
    
    // Limpar estado e fechar diálogo
    setIsCommenting(false);
  };

  return (
    <>
      <CommentDialog
        open={isCommenting}
        onOpenChange={setIsCommenting}
        onSave={handleCommentSave}
        service={service}
      />

      <TableRow 
        className={`${selectable ? "cursor-pointer hover:bg-muted/50" : ""}`}
        onClick={handleRowClick}
        data-testid="service-list-row"
      >
        <TableCell className="pl-2 py-3 align-top w-[70px]">
          {service.imageUrl ? (
            <img 
              src={service.imageUrl} 
              alt={service.name} 
              className="w-12 h-12 object-cover rounded" 
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              <ImagePlaceholder size={16} />
            </div>
          )}
        </TableCell>
        <TableCell className="py-3 px-2">
          <div className="flex flex-col w-full">
            {/* Nome do serviço com quebra de linha adequada */}
            <div className="font-medium text-left w-full mb-1 break-normal whitespace-normal">
              {service.name}
            </div>
            
            {/* Descrição se disponível */}
            {service.description && (
              <div className="text-xs text-gray-500 text-left mb-2">
                {service.description}
              </div>
            )}
            
            {/* Preço e ações com preço alinhado à direita */}
            <div className="w-full">
              <div className="flex justify-end items-center gap-2 w-full">
                <span className="font-medium text-right whitespace-nowrap">
                  {formatPrice(service.price)}
                </span>
                
                <div className="flex flex-nowrap" onClick={(e) => e.stopPropagation()}>
                  {showAddButton && onAddToSelection && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCommenting(true);
                      }}
                      className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 text-xs px-3 py-1 h-8 min-h-0 min-w-0"
                    >
                      <MessageCirclePlus className="h-4 w-4 mr-1" />
                      {isMobile ? "" : "Comentar"}
                    </Button>
                  )}
                  {!showAddButton && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => onEdit(service, e)}
                        className="h-8 w-8 min-h-0 min-w-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => onDelete(service.id, e)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 min-h-0 min-w-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full border-b border-gray-100 mt-2"></div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
