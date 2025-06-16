
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
  const [isScrollable, setIsScrollable] = useState(false);
  
  // Sort brands alphabetically
  useEffect(() => {
    setSortedBrands([...brands].sort());
    
    // Check if we need scrolling based on number of brands
    setIsScrollable(brands.length > 8);
  }, [brands]);
  
  const getModelCountForBrand = (brand: string) => {
    return motorcycleModels.filter(model => model.brand?.toLowerCase() === brand.toLowerCase()).length;
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
        <h3 className="text-sm font-medium">Filtrar por marca</h3>
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
      
      {isScrollable ? (
        <ScrollArea className="w-full" style={{ height: 'auto', maxHeight: '120px' }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pb-2">
            {sortedBrands.map(brand => (
              <div key={brand} className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={selectedBrand === brand ? "default" : "outline"}
                  onClick={() => onSelectBrand(brand)}
                  className="flex-1 justify-center text-center"
                >
                  {brand}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteBrand(brand)}
                  className="p-1 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  title={`Excluir marca ${brand} (${getModelCountForBrand(brand)} modelos)`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {sortedBrands.map(brand => (
            <div key={brand} className="flex items-center gap-1">
              <Button
                size="sm"
                variant={selectedBrand === brand ? "default" : "outline"}
                onClick={() => onSelectBrand(brand)}
                className="flex-1 justify-center text-center"
              >
                {brand}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteBrand(brand)}
                className="p-1 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                title={`Excluir marca ${brand} (${getModelCountForBrand(brand)} modelos)`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
