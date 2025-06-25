
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { MotorcycleModel } from "@/lib/types";

interface BrandFilterButtonsProps {
  brands: string[];
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
  onDeleteBrand: (brand: string) => void;
  motorcycleModels: MotorcycleModel[];
}

export const BrandFilterButtons = ({ 
  selectedBrand, 
  onSelectBrand, 
  onDeleteBrand,
  motorcycleModels 
}: BrandFilterButtonsProps) => {
  // Extract unique brands from motorcycleModels
  const brands = Array.from(new Set(
    motorcycleModels
      .map(model => model.brand)
      .filter(brand => brand && brand.trim() !== '')
  )).sort();

  if (brands.length === 0) {
    return null;
  }

  const getModelCountForBrand = (brand: string) => {
    return motorcycleModels.filter(model => 
      model.brand?.toLowerCase() === brand.toLowerCase()
    ).length;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Filtrar por Marca</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectBrand(null)}
          className={`text-xs ${!selectedBrand ? 'bg-primary text-primary-foreground' : ''}`}
        >
          Todas ({motorcycleModels.length})
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {brands.map((brand) => (
          <div key={brand} className="flex items-center gap-1">
            <Button
              variant={selectedBrand === brand ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectBrand(selectedBrand === brand ? null : brand)}
              className="text-xs"
            >
              {brand} ({getModelCountForBrand(brand)})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteBrand(brand)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title={`Excluir marca ${brand}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
