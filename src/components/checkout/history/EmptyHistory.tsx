
import { Clock } from "lucide-react";

export const EmptyHistory = () => {
  return (
    <div className="flex flex-col items-center justify-center h-32 text-center">
      <Clock className="h-10 w-10 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">Nenhum histórico encontrado</p>
      <p className="text-xs text-muted-foreground mt-1">
        Os serviços salvos aparecerão aqui para uso futuro
      </p>
    </div>
  );
};
