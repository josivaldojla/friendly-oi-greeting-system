
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BrandFilterButtonsProps {
  brands: string[];
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
}

export const BrandFilterButtons = ({ 
  brands, 
  selectedBrand, 
  onSelectBrand 
}: BrandFilterButtonsProps) => {
  if (brands.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filtrar por marca</h3>
        {selectedBrand && (
          <Badge 
            variant="outline" 
            className="cursor-pointer hover:bg-muted"
            onClick={() => onSelectBrand(null)}
          >
            Limpar filtro
          </Badge>
        )}
      </div>
      
      <ScrollArea className="whitespace-nowrap pb-2">
        <div className="flex space-x-2">
          {brands.map(brand => (
            <Button
              key={brand}
              size="sm"
              variant={selectedBrand === brand ? "default" : "outline"}
              onClick={() => onSelectBrand(brand)}
              className="min-w-max"
            >
              {brand}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
