
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, MessageCirclePlus } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";

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
  const [comment, setComment] = useState<string>("");

  const handleRowClick = () => {
    if (selectable && showAddButton && onAddToSelection && !isCommenting) {
      onAddToSelection(service);
    } else if (selectable && onClick) {
      onClick(service);
    }
  };

  const handleCommentSave = () => {
    if (onAddToSelection) {
      const formattedComment = comment.trim() ? `_${comment.trim()}_` : undefined;
      onAddToSelection(service, formattedComment);
    }
    setIsCommenting(false);
    setComment("");
  };

  return (
    <>
      <Dialog open={isCommenting} onOpenChange={setIsCommenting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Comentário</DialogTitle>
          </DialogHeader>
          <Textarea
            className="w-full"
            rows={4}
            value={comment}
            placeholder="Digite um comentário opcional para o serviço"
            onChange={(e) => setComment(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommenting(false)}>
              Cancelar
            </Button>
            <Button variant="default" onClick={handleCommentSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TableRow 
        className={`${selectable ? "cursor-pointer hover:bg-muted/50" : ""}`}
        onClick={handleRowClick}
        data-testid="service-list-row"
      >
        <TableCell className="pl-2 py-4 align-middle w-[60px]">
          {service.imageUrl ? (
            <img 
              src={service.imageUrl} 
              alt={service.name} 
              className="w-10 h-10 object-cover rounded" 
            />
          ) : (
            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
              <ImagePlaceholder size={16} />
            </div>
          )}
        </TableCell>
        <TableCell className="py-4 px-2 align-middle">
          <div className="font-medium text-left break-words whitespace-normal">
            {service.name}
            {service.description && (
              <div className="text-xs text-gray-500 text-left mt-1">
                {service.description}
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="py-4 pr-2 text-right align-middle">
          <span className="font-medium whitespace-nowrap">
            {formatPrice(service.price)}
          </span>
        </TableCell>
        <TableCell className="py-4 align-middle text-center">
          <div className="flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
            {showAddButton && onAddToSelection ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCommenting(true);
                }}
                className="text-green-500 hover:text-green-700 hover:bg-green-50 h-8 w-8"
              >
                <MessageCirclePlus className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => onEdit(service, e)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => onDelete(service.id, e)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
