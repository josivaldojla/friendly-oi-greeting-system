
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
  
  // Extract and sort all unique brands from motorcycle models
  useEffect(() => {
    console.log('=== BrandFilterButtons useEffect ===');
    console.log('All motorcycle models received:', motorcycleModels.length);
    console.log('Raw motorcycle models data:', JSON.stringify(motorcycleModels, null, 2));
    
    // Extract all unique brands more carefully with better validation
    const allBrandsSet = new Set<string>();
    
    motorcycleModels.forEach((model, index) => {
      console.log(`Processing model ${index}:`, {
        id: model.id,
        name: model.name,
        brand: model.brand,
        brand_type: typeof model.brand,
        brand_length: model.brand ? model.brand.length : 0
      });
      
      // More robust brand validation
      if (model.brand && 
          typeof model.brand === 'string' && 
          model.brand.trim() !== '' &&
          model.brand.trim() !== 'undefined' &&
          model.brand.trim() !== 'null') {
        const cleanBrand = model.brand.trim();
        allBrandsSet.add(cleanBrand);
        console.log('✓ Added brand:', cleanBrand);
      } else {
        console.log('✗ Skipped invalid brand:', model.brand);
      }
    });
    
    const uniqueBrandsArray = Array.from(allBrandsSet);
    console.log('All unique brands found:', uniqueBrandsArray);
    console.log('Total unique brands count:', uniqueBrandsArray.length);
    
    // Sort brands alphabetically (Portuguese locale)
    const sorted = uniqueBrandsArray.sort((a, b) => 
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );
    
    console.log('Final sorted brands:', sorted);
    console.log('=== End BrandFilterButtons useEffect ===');
    setSortedBrands(sorted);
  }, [motorcycleModels]);
  
  const getModelCountForBrand = (brand: string) => {
    const count = motorcycleModels.filter(model => 
      model.brand && 
      typeof model.brand === 'string' &&
      model.brand.trim().toLowerCase() === brand.trim().toLowerCase()
    ).length;
    console.log(`Models for brand ${brand}:`, count);
    return count;
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
            {sortedBrands.map(brand => {
              const modelCount = getModelCountForBrand(brand);
              return (
                <div key={brand} className="flex items-center gap-1 min-w-0">
                  <Button
                    size="sm"
                    variant={selectedBrand === brand ? "default" : "outline"}
                    onClick={() => onSelectBrand(brand)}
                    className="flex-1 justify-center text-center min-w-0 truncate"
                    title={`${brand} (${modelCount} modelos)`}
                  >
                    <span className="truncate">{brand}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteBrand(brand)}
                    className="p-1 h-8 w-8 flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    title={`Excluir marca ${brand} (${modelCount} modelos)`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
