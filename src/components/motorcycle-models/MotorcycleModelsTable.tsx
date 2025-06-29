
import { MotorcycleModel } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MotorcycleModelsTableProps {
  models: MotorcycleModel[];
  onEdit: (model: MotorcycleModel) => void;
  onDelete: (model: MotorcycleModel) => void;
}

// Função para obter informações de óleo baseado na marca e modelo
const getOilInfo = (brand: string, name: string) => {
  const brandLower = brand?.toLowerCase() || '';
  const nameLower = name?.toLowerCase() || '';
  
  // Honda
  if (brandLower.includes('honda')) {
    if (nameLower.includes('cg') || nameLower.includes('fan') || nameLower.includes('start')) {
      return { quantity: '1.0L', type: '20W50', color: 'bg-blue-500' };
    }
    if (nameLower.includes('bros') || nameLower.includes('xr')) {
      return { quantity: '1.2L', type: '10W40', color: 'bg-green-500' };
    }
    if (nameLower.includes('cb') || nameLower.includes('hornet')) {
      return { quantity: '2.2L', type: '10W40', color: 'bg-purple-500' };
    }
  }
  
  // Yamaha
  if (brandLower.includes('yamaha')) {
    if (nameLower.includes('factor') || nameLower.includes('crypton')) {
      return { quantity: '1.0L', type: '20W50', color: 'bg-blue-500' };
    }
    if (nameLower.includes('lander') || nameLower.includes('crosser')) {
      return { quantity: '1.4L', type: '10W40', color: 'bg-orange-500' };
    }
    if (nameLower.includes('r1') || nameLower.includes('r6')) {
      return { quantity: '4.0L', type: '10W40', color: 'bg-red-500' };
    }
  }
  
  // Suzuki
  if (brandLower.includes('suzuki')) {
    if (nameLower.includes('yes') || nameLower.includes('burgman')) {
      return { quantity: '0.8L', type: '10W30', color: 'bg-cyan-500' };
    }
    if (nameLower.includes('dr') || nameLower.includes('rmz')) {
      return { quantity: '1.3L', type: '10W40', color: 'bg-yellow-500' };
    }
  }
  
  // Kawasaki
  if (brandLower.includes('kawasaki')) {
    if (nameLower.includes('ninja')) {
      return { quantity: '3.4L', type: '10W40', color: 'bg-green-600' };
    }
    if (nameLower.includes('z')) {
      return { quantity: '3.2L', type: '10W40', color: 'bg-lime-500' };
    }
  }
  
  // Default para modelos não mapeados
  return { quantity: '1.0L', type: '20W50', color: 'bg-gray-500' };
};

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
              <TableHead className="min-w-[120px] text-center">Óleo</TableHead>
              <TableHead className="w-[80px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => {
              const oilInfo = getOilInfo(model.brand || '', model.name);
              
              return (
                <TableRow key={model.id}>
                  <TableCell className="font-medium break-words">
                    {model.name}
                  </TableCell>
                  <TableCell className="break-words">
                    {model.brand || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Droplets className={`h-4 w-4 text-white`} />
                      <div className="flex flex-col gap-1">
                        <Badge variant="secondary" className={`${oilInfo.color} text-white text-xs`}>
                          {oilInfo.quantity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {oilInfo.type}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1 justify-center">
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
