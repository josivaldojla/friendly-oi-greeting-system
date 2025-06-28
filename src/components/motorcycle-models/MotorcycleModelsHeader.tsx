
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeDuplicateModels } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BackupActions } from "@/components/motorcycle-models/BackupActions";
import { AlertTriangle, Trash2 } from "lucide-react";

interface MotorcycleModelsHeaderProps {
  duplicateCount: number;
  motorcycleModels: any[];
  onAddClick: () => void;
}

export const MotorcycleModelsHeader = ({ 
  duplicateCount, 
  motorcycleModels, 
  onAddClick 
}: MotorcycleModelsHeaderProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const removeDuplicatesMutation = useMutation({
    mutationFn: removeDuplicateModels,
    onSuccess: (updatedModels) => {
      queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });
      const originalCount = motorcycleModels.length;
      const newCount = updatedModels.length;
      const removedCount = originalCount - newCount;
      
      if (removedCount > 0) {
        toast({
          title: "Duplicatas Removidas!",
          description: `${removedCount} modelos duplicados foram removidos com sucesso. Total restante: ${newCount} modelos.`,
        });
      } else {
        toast({
          title: "Nenhuma Duplicata",
          description: "Não foram encontrados modelos duplicados para remover.",
        });
      }
    },
    onError: (error) => {
      console.error('Erro ao remover duplicatas:', error);
      toast({
        title: "Erro",
        description: `Erro ao remover duplicatas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  });

  const handleRemoveDuplicates = () => {
    if (duplicateCount === 0) {
      toast({
        title: "Nenhuma Duplicata",
        description: "Não foram encontrados modelos duplicados.",
      });
      return;
    }
    
    console.log(`Iniciando remoção de aproximadamente ${duplicateCount} duplicatas...`);
    removeDuplicatesMutation.mutate();
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Modelos de Motos</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            {duplicateCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                <AlertTriangle className="h-4 w-4" />
                {duplicateCount} duplicata{duplicateCount > 1 ? 's' : ''} encontrada{duplicateCount > 1 ? 's' : ''}
              </div>
            )}
            <Button 
              onClick={handleRemoveDuplicates}
              disabled={removeDuplicatesMutation.isPending || duplicateCount === 0}
              variant={duplicateCount > 0 ? "destructive" : "outline"}
              className="flex items-center gap-2"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
              {removeDuplicatesMutation.isPending 
                ? 'Removendo...' 
                : duplicateCount > 0 
                  ? `Remover ${duplicateCount} Duplicata${duplicateCount > 1 ? 's' : ''}` 
                  : 'Sem Duplicatas'
              }
            </Button>
            <Button 
              onClick={onAddClick}
              className="w-full sm:w-auto"
              size="sm"
            >
              Adicionar Modelo
            </Button>
          </div>
        </div>
        
        {/* Backup Actions */}
        <div className="w-full">
          <BackupActions />
        </div>
      </div>
    </div>
  );
};
