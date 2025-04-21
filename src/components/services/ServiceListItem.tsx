
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

  // Clique no corpo da linha adiciona direto sem comentário
  const handleRowClick = () => {
    if (selectable && showAddButton && onAddToSelection && !isCommenting) {
      onAddToSelection(service); // sem comentário
    } else if (selectable && onClick) {
      onClick(service);
    }
  };

  // Ao salvar comentário, adiciona o serviço à seleção com comentário
 const handleCommentSave = () => {
  if (onAddToSelection) {
    const formattedComment = comment.trim() ? `_${comment.trim()}_` : undefined; // Formata o texto para itálico no WhatsApp
    onAddToSelection(service, formattedComment);
  }
  setIsCommenting(false);
  setComment("");
};

  return (
    <>
      {/* Dialog para comentário */}
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
        className={selectable ? "cursor-pointer hover:bg-muted/50" : ""}
        onClick={handleRowClick}
        data-testid="service-list-row"
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
            {showAddButton && onAddToSelection && (
  <Button
    variant="outline"
    size="sm"
    onClick={(e) => {
      e.stopPropagation();
      setIsCommenting(true);
    }}
    className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
  >
    <MessageCirclePlus className="h-4 w-4 mr-1" />
    Comentário
  </Button>
)}
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
    </>
  );
};
