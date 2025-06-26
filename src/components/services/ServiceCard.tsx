
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

  const handlePriceEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingPrice(true);
    setTempPrice(service.price);
  };

  const handleSavePrice = () => {
    const serviceWithNewPrice = { ...service, price: tempPrice };
    onAddToSelection(serviceWithNewPrice);
    setIsEditingPrice(false);
  };

  const handleCancelEdit = () => {
    setTempPrice(service.price);
    setIsEditingPrice(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSavePrice();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleAddWithCurrentPrice = () => {
    onAddToSelection(service);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Preço:</span>
          </div>
          
          {isEditingPrice ? (
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <Input
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(Number(e.target.value))}
                onKeyDown={handleKeyPress}
                className="text-center text-lg font-semibold"
                step="0.01"
                min="0"
                autoFocus
                placeholder="Digite o valor"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handleSavePrice}
                >
                  ✓ Confirmar e Adicionar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={handleCancelEdit}
                >
                  ✕ Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div 
                className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-3 cursor-pointer transition-colors text-center"
                onClick={handlePriceEdit}
              >
                <div className="text-xs text-blue-600 mb-1">Toque para editar preço</div>
                <div className="text-xl font-bold text-blue-800">
                  {formatPrice(service.price)}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleAddWithCurrentPrice}
          disabled={isEditingPrice}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
        {showEditButton && onEdit && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(service)}
            disabled={isEditingPrice}
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
