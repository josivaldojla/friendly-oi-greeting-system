
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface BrandFilterButtonsProps {
  brands: string[];
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
  onDeleteBrand: (brand: string) => void;
  motorcycleModels: any[];
}

export const BrandFilterButtons = ({ 
  brands, 
  selectedBrand, 
  onSelectBrand,
  onDeleteBrand,
  motorcycleModels
}: BrandFilterButtonsProps) => {
  const [sortedBrands, setSortedBrands] = useState<string[]>([]);
  
  // Sort brands alphabetically and ensure all brands are included
  useEffect(() => {
    console.log('All available brands:', brands);
    console.log('All motorcycle models:', motorcycleModels);
    
    // Extract all unique brands from motorcycle models
    const allBrands = Array.from(
      new Set(
        motorcycleModels
          .map(model => model.brand)
          .filter(brand => brand && brand.trim() !== '')
          .map(brand => brand.trim())
      )
    );
    
    console.log('Extracted unique brands:', allBrands);
    
    const sorted = [...allBrands].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    setSortedBrands(sorted);
    
    console.log('Sorted brands to display:', sorted);
  }, [brands, motorcycleModels]);
  
  const getModelCountForBrand = (brand: string) => {
    return motorcycleModels.filter(model => 
      model.brand && model.brand.toLowerCase().trim() === brand.toLowerCase().trim()
    ).length;
  };
  
  if (sortedBrands.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 border rounded-md">
        Nenhuma marca encontrada. Adicione modelos com marcas para filtrar.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtrar por marca ({sortedBrands.length} marcas)</h3>
        {selectedBrand && (
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-muted flex items-center gap-1"
            onClick={() => onSelectBrand(null)}
          >
            Limpar filtro
            <span className="text-xs">×</span>
          </Badge>
        )}
      </div>
      
      <div className="w-full">
        <ScrollArea className="w-full max-h-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pr-4">
            {sortedBrands.map(brand => (
              <div key={brand} className="flex items-center gap-1 min-w-0">
                <Button
                  size="sm"
                  variant={selectedBrand === brand ? "default" : "outline"}
                  onClick={() => onSelectBrand(brand)}
                  className="flex-1 justify-center text-center min-w-0 truncate"
                  title={`${brand} (${getModelCountForBrand(brand)} modelos)`}
                >
                  <span className="truncate">{brand}</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteBrand(brand)}
                  className="p-1 h-8 w-8 flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  title={`Excluir marca ${brand} (${getModelCountForBrand(brand)} modelos)`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
