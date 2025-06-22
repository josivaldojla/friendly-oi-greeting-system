
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Upload, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const BackupActions = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching data for export:', error);
        toast.error('Erro ao exportar dados');
        return;
      }

      const exportData = {
        exportDate: new Date().toISOString(),
        totalRecords: data.length,
        data: data
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `motorcycle-models-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Backup exportado com sucesso! ${data.length} registros salvos.`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erro ao exportar dados');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
        // Get current user ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('Usuário não autenticado');
          return;
        }

        const text = await file.text();
        const importData = JSON.parse(text);

        if (!importData.data || !Array.isArray(importData.data)) {
          toast.error('Formato de arquivo inválido');
          return;
        }

        console.log('Importing data:', importData.data);

        // Primeiro, vamos buscar os modelos já existentes do usuário atual para evitar duplicatas
        const { data: existingModels, error: fetchError } = await supabase
          .from('motorcycle_models')
          .select('name, brand');

        if (fetchError) {
          console.error('Error fetching existing models:', fetchError);
        }

        const existingModelKeys = new Set(
          (existingModels || []).map(model => `${model.name}|${model.brand || ''}`)
        );

        // Filtrar apenas modelos que não existem ainda para o usuário atual
        const newModels = importData.data.filter((item: any) => {
          const key = `${item.name}|${item.brand || ''}`;
          return !existingModelKeys.has(key);
        });

        if (newModels.length === 0) {
          toast.success('Todos os modelos do backup já existem no seu sistema.');
          return;
        }

        // Preparar dados para importação (definir created_by como o usuário atual)
        const dataToImport = newModels.map((item: any) => ({
          name: item.name,
          brand: item.brand || null,
          created_by: user.id
        }));

        console.log('Data to import after filtering:', dataToImport);

        const { data, error } = await supabase
          .from('motorcycle_models')
          .insert(dataToImport)
          .select();

        if (error) {
          console.error('Import error:', error);
          toast.error('Erro ao importar dados: ' + error.message);
          return;
        }

        console.log('Successfully imported data:', data);

        const totalOriginal = importData.data.length;
        const imported = data?.length || 0;
        const skipped = totalOriginal - imported;

        if (skipped > 0) {
          toast.success(
            `Importação concluída! ${imported} novos modelos adicionados, ${skipped} já existiam.`
          );
        } else {
          toast.success(`Dados importados com sucesso! ${imported} modelos adicionados.`);
        }
        
        // Recarregar a página para mostrar os dados importados
        window.location.reload();
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Erro ao processar arquivo de importação');
      } finally {
        setIsImporting(false);
      }
    };

    input.click();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 flex-shrink-0" />
          <span className="truncate">Backup dos Dados</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={handleExportData}
            disabled={isExporting}
            variant="outline"
            className="flex items-center justify-center gap-2 h-10 text-sm"
            size="sm"
          >
            <Download className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {isExporting ? 'Exportando...' : 'Exportar Dados'}
            </span>
          </Button>
          
          <Button
            onClick={handleImportData}
            disabled={isImporting}
            variant="outline"
            className="flex items-center justify-center gap-2 h-10 text-sm"
            size="sm"
          >
            <Upload className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {isImporting ? 'Importando...' : 'Importar Dados'}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
