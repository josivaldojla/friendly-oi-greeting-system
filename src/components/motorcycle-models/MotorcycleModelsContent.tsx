
import { MotorcycleModel } from "@/lib/types";
import { MotorcycleModelsTable } from "@/components/motorcycle-models/MotorcycleModelsTable";
import { EmptyModelsPlaceholder } from "@/components/motorcycle-models/EmptyModelsPlaceholder";

interface MotorcycleModelsContentProps {
  isLoading: boolean;
  filteredModels: MotorcycleModel[];
  searchTerm: string;
  onEdit: (model: MotorcycleModel) => void;
  onDelete: (model: MotorcycleModel) => void;
  onViewOilData: (model: MotorcycleModel) => void;
  onEditOilData?: (model: MotorcycleModel) => void;
  onAddClick: () => void;
}

export const MotorcycleModelsContent = ({
  isLoading,
  filteredModels,
  searchTerm,
  onEdit,
  onDelete,
  onViewOilData,
  onEditOilData,
  onAddClick
}: MotorcycleModelsContentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (filteredModels.length === 0 && !searchTerm) {
    return <EmptyModelsPlaceholder onAddClick={onAddClick} />;
  }

  if (filteredModels.length > 0) {
    return (
      <div className="w-full overflow-hidden">
        <MotorcycleModelsTable 
          models={filteredModels}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewOilData={onViewOilData}
          onEditOilData={onEditOilData}
        />
      </div>
    );
  }

  return null;
};
