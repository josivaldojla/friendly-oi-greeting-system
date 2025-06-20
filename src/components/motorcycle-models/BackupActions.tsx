
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MotorcycleModel } from "@/lib/types";
import { addMotorcycleModel } from "@/lib/storage";
import { useQueryClient } from "@tanstack/react-query";

interface BackupActionsProps {
  motorcycleModels: MotorcycleModel[];
}

export const BackupActions = ({ motorcycleModels }: BackupActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleExportBackup = () => {
    try {
      const backupData = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        motorcycleModels: motorcycleModels.map(model => ({
          name: model.name,
          brand: model.brand
        }))
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `modelos-motos-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Sucesso",
        description: `Backup exportado com ${motorcycleModels.length} modelos`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar backup",
        variant: "destructive",
      });
    }
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const backupData = JSON.parse(text);
        
        if (!backupData.motorcycleModels || !Array.isArray(backupData.motorcycleModels)) {
          throw new Error("Formato de backup inválido");
        }

        let importedCount = 0;
        let skippedCount = 0;

        for (const model of backupData.motorcycleModels) {
          if (!model.name) continue;
          
          // Verifica se o modelo já existe
          const exists = motorcycleModels.some(
            existing => existing.name.toLowerCase() === model.name.toLowerCase() && 
                       existing.brand?.toLowerCase() === model.brand?.toLowerCase()
          );

          if (!exists) {
            try {
              await addMotorcycleModel({
                name: model.name,
                brand: model.brand || ""
              });
              importedCount++;
            } catch (error) {
              console.error('Erro ao importar modelo:', model.name, error);
            }
          } else {
            skippedCount++;
          }
        }

        queryClient.invalidateQueries({ queryKey: ['motorcycleModels'] });

        toast({
          title: "Importação Concluída",
          description: `${importedCount} modelos importados, ${skippedCount} já existiam`,
        });

      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao importar backup. Verifique o formato do arquivo.",
          variant: "destructive",
        });
      }
    };

    input.click();
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportBackup}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Exportar Backup
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleImportBackup}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Importar Backup
      </Button>
    </div>
  );
};
