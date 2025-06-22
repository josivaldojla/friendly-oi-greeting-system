
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
  const [allBrands, setAllBrands] = useState<string[]>([]);
  
  // Extract ALL unique brands directly from motorcycle models
  useEffect(() => {
    console.log('=== BrandFilterButtons: Extracting brands ===');
    console.log('Motorcycle models received:', motorcycleModels.length);
    
    if (!motorcycleModels || motorcycleModels.length === 0) {
      console.log('No motorcycle models found');
      setAllBrands([]);
      return;
    }
    
    // Create a Set to store unique brands
    const uniqueBrandsSet = new Set<string>();
    
    // Process each model to extract valid brands
    motorcycleModels.forEach((model, index) => {
      console.log(`Processing model ${index + 1}:`, {
        id: model.id,
        name: model.name,
        brand: model.brand,
        brandType: typeof model.brand,
        brandValid: Boolean(model.brand && typeof model.brand === 'string' && model.brand.trim())
      });
      
      // Validate and add brand
      if (model.brand && 
          typeof model.brand === 'string' && 
          model.brand.trim() !== '' &&
          model.brand.trim().toLowerCase() !== 'null' &&
          model.brand.trim().toLowerCase() !== 'undefined') {
        
        const cleanBrand = model.brand.trim();
        uniqueBrandsSet.add(cleanBrand);
        console.log(`✓ Brand added: "${cleanBrand}"`);
      } else {
        console.log(`✗ Brand skipped (invalid): "${model.brand}"`);
      }
    });
    
    // Convert Set to Array and sort
    const brandsArray = Array.from(uniqueBrandsSet);
    const sortedBrands = brandsArray.sort((a, b) => 
      a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
    );
    
    console.log('Final unique brands extracted:', sortedBrands);
    console.log('Total unique brands count:', sortedBrands.length);
    console.log('=== End BrandFilterButtons: Extracting brands ===');
    
    setAllBrands(sortedBrands);
  }, [motorcycleModels]);
  
  const getModelCountForBrand = (brand: string) => {
    const count = motorcycleModels.filter(model => 
      model.brand && 
      typeof model.brand === 'string' &&
      model.brand.trim().toLowerCase() === brand.trim().toLowerCase()
    ).length;
    return count;
  };
  
  if (!allBrands || allBrands.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 border rounded-md">
        Nenhuma marca encontrada. Adicione modelos com marcas para filtrar.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtrar por marca ({allBrands.length} marcas)</h3>
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
        <ScrollArea className="w-full max-h-40">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 pr-4">
            {allBrands.map((brand, index) => {
              const modelCount = getModelCountForBrand(brand);
              console.log(`Rendering brand ${index + 1}: ${brand} (${modelCount} models)`);
              
              return (
                <div key={`${brand}-${index}`} className="flex items-center gap-1 min-w-0">
                  <Button
                    size="sm"
                    variant={selectedBrand === brand ? "default" : "outline"}
                    onClick={() => onSelectBrand(brand)}
                    className="flex-1 justify-center text-center min-w-0 truncate text-xs px-2 py-1"
                    title={`${brand} (${modelCount} modelos)`}
                  >
                    <span className="truncate">{brand}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteBrand(brand)}
                    className="p-1 h-7 w-7 flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
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
