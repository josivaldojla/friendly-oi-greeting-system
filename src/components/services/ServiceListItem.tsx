
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Service, MotorcycleModel, Customer, CustomerSelection } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, MessageCirclePlus } from "lucide-react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

// Modelos de moto e clientes simulados (no futuro viriam de um banco de dados)
const mockMotorcycleModels: MotorcycleModel[] = [
  { id: "1", name: "Fazer 250" },
  { id: "2", name: "CG 160" },
  { id: "3", name: "XRE 300" },
  { id: "4", name: "CB 300" },
  { id: "5", name: "Biz 125" }
];

const mockCustomers: Customer[] = [
  { id: "1", name: "Valdo" },
  { id: "2", name: "João" },
  { id: "3", name: "Maria" },
  { id: "4", name: "Pedro" },
  { id: "5", name: "Ana" }
];

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
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [customerSelection, setCustomerSelection] = useState<CustomerSelection>({ name: "" });
  const [customerInput, setCustomerInput] = useState<string>("");
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);

  // Atualiza a lista filtrada de clientes quando o input muda
  useEffect(() => {
    if (customerInput) {
      const filtered = mockCustomers.filter(customer => 
        customer.name.toLowerCase().includes(customerInput.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(mockCustomers);
    }
  }, [customerInput]);

  const handleRowClick = () => {
    if (selectable && showAddButton && onAddToSelection && !isCommenting) {
      onAddToSelection(service);
    } else if (selectable && onClick) {
      onClick(service);
    }
  };

  const handleCommentSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Previne comportamento padrão
    e.stopPropagation(); // Evita propagação do evento
    
    if (onAddToSelection) {
      let formattedComment = "";
      
      if (selectedModel) {
        const model = mockMotorcycleModels.find(m => m.id === selectedModel);
        if (model) {
          formattedComment += `Modelo: ${model.name}\n`;
        }
      }
      
      if (customerSelection.name) {
        formattedComment += `Cliente: ${customerSelection.name}\n`;
      }
      
      if (comment.trim()) {
        formattedComment += comment.trim();
      }
      
      onAddToSelection(service, formattedComment ? `_${formattedComment}_` : undefined);
    }
    
    // Limpar campos após salvar
    setIsCommenting(false);
    setComment("");
    setSelectedModel("");
    setCustomerSelection({ name: "" });
    setCustomerInput("");
  };

  const handleCustomerSelect = (customer: Customer) => {
    setCustomerSelection({ 
      id: customer.id, 
      name: customer.name,
      isNew: false
    });
    setCustomerInput(customer.name);
    setIsCustomerListOpen(false);
  };

  const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerInput(value);
    
    // Se houver valor, consideramos como um novo cliente potencial
    if (value) {
      setCustomerSelection({ 
        name: value, 
        isNew: true 
      });
    } else {
      setCustomerSelection({ name: "" });
    }
  };

  const closeCommentDialog = () => {
    setIsCommenting(false);
    setComment("");
    setSelectedModel("");
    setCustomerSelection({ name: "" });
    setCustomerInput("");
  };

  return (
    <>
      <Dialog open={isCommenting} onOpenChange={(open) => {
        if (!open) closeCommentDialog();
        else setIsCommenting(open);
      }}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Adicionar Comentário</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="motorcycle-model">Modelo</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="motorcycle-model">
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  {mockMotorcycleModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer">Cliente</Label>
              <Popover 
                open={isCustomerListOpen} 
                onOpenChange={setIsCustomerListOpen}
              >
                <PopoverTrigger asChild>
                  <Input
                    id="customer"
                    value={customerInput}
                    onChange={handleCustomerInputChange}
                    onClick={() => setIsCustomerListOpen(true)}
                    placeholder="Digite ou selecione um cliente"
                    className="w-full"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="max-h-56 overflow-auto rounded-md bg-popover p-1">
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map(customer => (
                        <Button
                          key={customer.id}
                          variant="ghost"
                          className="w-full justify-start text-left font-normal"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCustomerSelect(customer);
                          }}
                        >
                          {customer.name}
                        </Button>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">
                        Nenhum cliente encontrado. Digite para adicionar.
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Comentário (Opcional)</Label>
              <Textarea
                id="comment"
                className="w-full"
                rows={3}
                value={comment}
                placeholder="Digite um comentário adicional para o serviço"
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeCommentDialog}>
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
