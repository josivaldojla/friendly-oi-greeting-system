
import { Button } from "@/components/ui/button";

interface EmptyModelsPlaceholderProps {
  onAddClick: () => void;
}

export const EmptyModelsPlaceholder = ({ onAddClick }: EmptyModelsPlaceholderProps) => {
  return (
    <div className="bg-muted/50 rounded-md p-8 flex flex-col items-center justify-center text-center">
      <h3 className="text-lg font-medium mb-2">Nenhum modelo cadastrado</h3>
      <p className="text-muted-foreground mb-4">Adicione seu primeiro modelo de moto.</p>
      <Button onClick={onAddClick}>Adicionar Modelo</Button>
    </div>
  );
};
