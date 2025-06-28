
import { ModelSearchInput } from "@/components/motorcycle-models/ModelSearchInput";
import { BrandFilterButtons } from "@/components/motorcycle-models/BrandFilterButtons";
import { MotorcycleModel } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface MotorcycleModelsSearchAndFilterProps {
  motorcycleModels: MotorcycleModel[];
  searchTerm: string;
  selectedBrand: string | null;
  filteredModels: MotorcycleModel[];
  onSearchChange: (searchTerm: string) => void;
  onBrandFilter: (brand: string | null) => void;
  onDeleteBrand: (brand: string) => void;
  onClearSearch: () => void;
}

export const MotorcycleModelsSearchAndFilter = ({
  motorcycleModels,
  searchTerm,
  selectedBrand,
  filteredModels,
  onSearchChange,
  onBrandFilter,
  onDeleteBrand,
  onClearSearch
}: MotorcycleModelsSearchAndFilterProps) => {
  return (
    <div className="space-y-4">
      {/* Search Section */}
      {motorcycleModels.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <ModelSearchInput 
            onSearchChange={onSearchChange}
            placeholder="Buscar por modelo ou marca..."
          />
          {searchTerm && (
            <div className="text-sm text-gray-600">
              {filteredModels.length} resultado{filteredModels.length !== 1 ? 's' : ''} encontrado{filteredModels.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
      
      {/* Brand Filter Section */}
      {motorcycleModels.length > 0 && (
        <BrandFilterButtons 
          brands={[]}
          selectedBrand={selectedBrand} 
          onSelectBrand={onBrandFilter}
          onDeleteBrand={onDeleteBrand}
          motorcycleModels={motorcycleModels}
        />
      )}

      {/* Clear search section for empty results */}
      {searchTerm && filteredModels.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            Nenhum modelo encontrado para "<strong>{searchTerm}</strong>"
          </p>
          <Button 
            onClick={onClearSearch}
            variant="outline"
          >
            Limpar busca
          </Button>
        </div>
      )}
    </div>
  );
};
