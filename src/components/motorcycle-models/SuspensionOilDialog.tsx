
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplets, Info, Edit } from "lucide-react";
import { MotorcycleModel } from "@/lib/types";
import { getSuspensionOilData, findSuspensionOilByPartialMatch, SuspensionOilData } from "@/lib/suspension-oil-data";

interface SuspensionOilDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  model: MotorcycleModel | null;
  onEditOilData?: (model: MotorcycleModel) => void;
}

export const SuspensionOilDialog = ({ 
  isOpen, 
  onOpenChange, 
  model,
  onEditOilData 
}: SuspensionOilDialogProps) => {
  if (!model) return null;

  // Buscar dados exatos primeiro
  const exactMatch = getSuspensionOilData(model.brand || "", model.name);
  
  // Se não encontrar correspondência exata, buscar correspondências parciais
  const partialMatches = exactMatch ? [] : findSuspensionOilByPartialMatch(model.brand || "", model.name);

  const renderOilData = (oilData: SuspensionOilData) => (
    <div key={`${oilData.brand}-${oilData.model}`} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">{oilData.model}</span>
        </div>
        {onEditOilData && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditOilData(model)}
            className="h-8 px-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
        )}
      </div>
      <div className="text-lg font-bold text-blue-700">
        {oilData.oilQuantityML} ML
      </div>
      <div className="text-sm text-blue-600 mt-1">
        Óleo de suspensão por bengala
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-blue-600" />
            Óleo de Suspensão
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium text-gray-900">{model.name}</div>
            <div className="text-sm text-gray-600">{model.brand}</div>
          </div>

          {exactMatch ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Correspondência Exata
                </Badge>
              </div>
              {renderOilData(exactMatch)}
            </div>
          ) : partialMatches.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-yellow-600">
                <Info className="h-4 w-4" />
                <span className="text-sm">
                  Modelos similares encontrados:
                </span>
              </div>
              <div className="space-y-3">
                {partialMatches.map(renderOilData)}
              </div>
              <div className="text-xs text-gray-500 bg-yellow-50 p-2 rounded border">
                ⚠️ Verifique se o modelo corresponde antes de usar os dados
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Droplets className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <div className="font-medium">Dados não encontrados</div>
              <div className="text-sm mt-1">
                Não encontramos informações de óleo de suspensão para este modelo específico.
              </div>
              <div className="text-xs mt-2 text-gray-400">
                Os dados são baseados nas tabelas da Total Moto Peças
              </div>
              {onEditOilData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditOilData(model)}
                  className="mt-3 text-purple-600 hover:text-purple-700 border-purple-200 hover:bg-purple-50"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Adicionar Dados
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
