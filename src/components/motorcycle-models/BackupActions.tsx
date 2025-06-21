
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
        const text = await file.text();
        const importData = JSON.parse(text);

        if (!importData.data || !Array.isArray(importData.data)) {
          toast.error('Formato de arquivo inválido');
          return;
        }

        // Prepare data for import (remove id and created_at to let Supabase generate new ones)
        const dataToImport = importData.data.map((item: any) => ({
          name: item.name,
          brand: item.brand || null
        }));

        const { data, error } = await supabase
          .from('motorcycle_models')
          .insert(dataToImport)
          .select();

        if (error) {
          console.error('Import error:', error);
          toast.error('Erro ao importar dados: ' + error.message);
          return;
        }

        toast.success(`Dados importados com sucesso! ${data.length} registros adicionados.`);
        
        // Reload the page to show the imported data
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Backup dos Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleExportData}
            disabled={isExporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exportando...' : 'Exportar Dados'}
          </Button>
          
          <Button
            onClick={handleImportData}
            disabled={isImporting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isImporting ? 'Importando...' : 'Importar Dados'}
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Use essas funções para fazer backup e restaurar seus dados de modelos de motocicleta.
          O arquivo de exportação será salvo em formato JSON.
        </p>
      </CardContent>
    </Card>
  );
};
