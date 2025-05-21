
import React from "react";
import { ServicePhoto, PhotoViewMode } from "@/lib/types";
import { ServicePhotoItem } from "./ServicePhotoItem";
import { Button } from "@/components/ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";

interface PhotoGalleryProps {
  photos: ServicePhoto[];
  viewMode: PhotoViewMode;
  onViewModeChange: (mode: PhotoViewMode) => void;
  onDeletePhoto: (photo: ServicePhoto) => void;
  onUpdatePhoto: (photo: ServicePhoto) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  viewMode,
  onViewModeChange,
  onDeletePhoto,
  onUpdatePhoto
}) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          Nenhuma foto adicionada ainda. 
          Utilize o formulário acima para adicionar fotos a este serviço.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Fotos do Serviço ({photos.length})
        </h3>
        <div className="flex space-x-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className="h-8 w-8"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => onViewModeChange('list')}
            className="h-8 w-8"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
          : 'space-y-4'
      }>
        {photos.map((photo) => (
          <ServicePhotoItem
            key={photo.id}
            photo={photo}
            onDelete={onDeletePhoto}
            onUpdate={onUpdatePhoto}
          />
        ))}
      </div>
    </div>
  );
};
