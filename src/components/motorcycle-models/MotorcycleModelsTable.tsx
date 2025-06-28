
import { MotorcycleModel } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface MotorcycleModelsTableProps {
  models: MotorcycleModel[];
  onEdit: (model: MotorcycleModel) => void;
  onDelete: (model: MotorcycleModel) => void;
}

export const MotorcycleModelsTable = ({ 
  models, 
  onEdit, 
  onDelete 
}: MotorcycleModelsTableProps) => {
  return (
    <div className="w-full border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Modelo</TableHead>
              <TableHead className="min-w-[100px]">Marca</TableHead>
              <TableHead className="w-[80px] text-center">Ações</TableHead>
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
