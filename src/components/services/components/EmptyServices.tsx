
import { Button } from "@/components/ui/button";

interface EmptyServicesProps {
  onAddClick: () => void;
}

export const EmptyServices = ({ onAddClick }: EmptyServicesProps) => {
  return (
    <div className="flex flex-col items-center justify-center border rounded-lg p-8 bg-white">
      <p className="text-muted-foreground mb-4">Nenhum serviço cadastrado.</p>
      <Button onClick={onAddClick}>Adicionar Primeiro Serviço</Button>
    </div>
  );
};
