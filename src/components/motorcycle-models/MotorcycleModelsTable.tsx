
import { MotorcycleModel } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Droplets } from "lucide-react";

interface MotorcycleModelsTableProps {
  models: MotorcycleModel[];
  onEdit: (model: MotorcycleModel) => void;
  onDelete: (model: MotorcycleModel) => void;
  onViewOilData: (model: MotorcycleModel) => void;
}

export const MotorcycleModelsTable = ({ 
  models, 
  onEdit, 
  onDelete,
  onViewOilData
}: MotorcycleModelsTableProps) => {
  return (
    <div className="w-full border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Modelo</TableHead>
              <TableHead className="min-w-[100px]">Marca</TableHead>
              <TableHead className="w-[120px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
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
                      title="Ver dados de óleo de suspensão"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
