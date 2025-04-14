
import { Service } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

interface ServiceDetailProps {
  service: Service | null;
  onAddToSelection: (service: Service) => void;
}

const ServiceDetail = ({ service, onAddToSelection }: ServiceDetailProps) => {
  if (!service) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Detalhes do Serviço</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <p className="text-muted-foreground">
            Selecione um serviço para ver os detalhes
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        {service.imageUrl ? (
          <div className="mb-4">
            <img 
              src={service.imageUrl} 
              alt={service.name} 
              className="w-full h-48 object-cover rounded-md" 
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center mb-4">
            <ImageIcon size={48} className="text-muted-foreground" />
          </div>
        )}
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-lg">Valor:</h3>
          <span className="font-semibold text-lg text-primary">
            {formatPrice(service.price)}
          </span>
        </div>
        <div>
          <h3 className="font-bold mb-2">Descrição:</h3>
          <p className="text-muted-foreground whitespace-pre-line">
            {service.description || "Nenhuma descrição disponível."}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onAddToSelection(service)}>
          Adicionar à Seleção
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceDetail;
