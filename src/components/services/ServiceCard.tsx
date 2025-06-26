
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ServiceCardProps {
  service: Service;
  onAddToSelection: (service: Service, comment?: string) => void;
  onEdit?: (service: Service) => void;
  showEditButton?: boolean;
}

const ServiceCard = ({ service, onAddToSelection, onEdit, showEditButton = false }: ServiceCardProps) => {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(service.price);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handlePriceClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o evento de clique do card seja acionado
    setIsEditingPrice(true);
    setTempPrice(service.price);
  };

  const handleSavePrice = (e: React.MouseEvent) => {
    e.stopPropagation();
    const serviceWithNewPrice = { ...service, price: tempPrice };
    onAddToSelection(serviceWithNewPrice);
    setIsEditingPrice(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempPrice(service.price);
    setIsEditingPrice(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      const serviceWithNewPrice = { ...service, price: tempPrice };
      onAddToSelection(serviceWithNewPrice);
      setIsEditingPrice(false);
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      setTempPrice(service.price);
      setIsEditingPrice(false);
    }
  };

  const handleCardClick = () => {
    if (!isEditingPrice) {
      onAddToSelection(service);
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <CardHeader>
        <CardTitle className="text-lg">{service.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">Preço:</span>
          {isEditingPrice ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Input
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(Number(e.target.value))}
                onKeyDown={handleKeyPress}
                className="w-24 h-8 text-sm"
                step="0.01"
                min="0"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-green-600 hover:bg-green-50"
                onClick={handleSavePrice}
              >
                ✓
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-red-600 hover:bg-red-50"
                onClick={handleCancelEdit}
              >
                ✕
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span 
                className="text-lg font-bold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                onClick={handlePriceClick}
                title="Clique para editar o preço para esta venda"
              >
                {formatPrice(service.price)}
              </span>
              <Edit2 
                className="h-4 w-4 text-gray-400 cursor-pointer" 
                onClick={handlePriceClick}
              />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            if (!isEditingPrice) {
              onAddToSelection(service);
            }
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
        {showEditButton && onEdit && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(service);
            }}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
