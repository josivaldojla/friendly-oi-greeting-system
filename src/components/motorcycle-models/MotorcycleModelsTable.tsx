
import { MotorcycleModel } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Droplets } from "lucide-react";
import { getSuspensionOilData, findSuspensionOilByPartialMatch } from "@/lib/suspension-oil-data";

interface MotorcycleModelsTableProps {
  models: MotorcycleModel[];
  onEdit: (model: MotorcycleModel) => void;
  onDelete: (model: MotorcycleModel) => void;
  onViewOilData: (model: MotorcycleModel) => void;
  onEditOilData?: (model: MotorcycleModel) => void;
}

export const MotorcycleModelsTable = ({ 
  models, 
  onEdit, 
  onDelete,
  onViewOilData,
  onEditOilData
}: MotorcycleModelsTableProps) => {
  const getOilDataStatus = (model: MotorcycleModel) => {
    const exactMatch = getSuspensionOilData(model.brand || "", model.name);
    if (exactMatch) return 'exact';
    
    const partialMatches = findSuspensionOilByPartialMatch(model.brand || "", model.name);
    if (partialMatches.length > 0) return 'partial';
    
    return 'none';
  };

  const getDropletColor = (status: string) => {
    switch (status) {
      case 'exact':
        return 'text-green-600 hover:text-green-700 hover:bg-green-50';
      case 'partial':
        return 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50';
      case 'none':
        return 'text-red-600 hover:text-red-700 hover:bg-red-50';
      default:
        return 'text-blue-600 hover:text-blue-700 hover:bg-blue-50';
    }
  };

  return (
    <div className="w-full border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Modelo</TableHead>
              <TableHead className="min-w-[100px]">Marca</TableHead>
              <TableHead className="w-[160px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => {
              const oilStatus = getOilDataStatus(model);
              const dropletColorClass = getDropletColor(oilStatus);
              
              return (
                <TableRow key={model.id}>
                  <TableCell className="font-medium break-words">
                    {model.name}
                  </TableCell>
                  <TableCell className="break-words">
                    {model.brand || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1 justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onViewOilData(model)}
                        title={`Ver dados de óleo de suspensão - ${
                          oilStatus === 'exact' ? 'Dados exatos' : 
                          oilStatus === 'partial' ? 'Dados similares' : 
                          'Sem dados'
                        }`}
                        className={`h-8 w-8 ${dropletColorClass}`}
                      >
                        <Droplets className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEdit(model)}
                        title="Editar modelo"
                        className="h-8 w-8"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(model)}
                        title="Excluir modelo"
                        className="h-8 w-8"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
