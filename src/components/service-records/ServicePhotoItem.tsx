
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ServicePhoto } from "@/lib/types";
import { Trash2, Edit2, Save, X, Eye } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { updateServicePhoto } from "@/lib/storage";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ServicePhotoItemProps {
  photo: ServicePhoto;
  onDelete: (photo: ServicePhoto) => void;
  onUpdate: (photo: ServicePhoto) => void;
}

export const ServicePhotoItem: React.FC<ServicePhotoItemProps> = ({ 
  photo, 
  onDelete, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(photo.caption || "");
  const [notes, setNotes] = useState(photo.notes || "");
  const [isFullSizeView, setIsFullSizeView] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const updatedPhoto = await updateServicePhoto({
        id: photo.id,
        caption,
        notes
      });
      
      if (updatedPhoto) {
        onUpdate(updatedPhoto);
        setIsEditing(false);
        toast.success('Informações da foto atualizadas');
      } else {
        toast.error('Erro ao atualizar informações da foto');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Erro ao atualizar informações da foto');
    } finally {
      setSaving(false);
    }
  };
  
  const handleCancelEdit = () => {
    setCaption(photo.caption || "");
    setNotes(photo.notes || "");
    setIsEditing(false);
  };
  
  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative group">
          <AspectRatio ratio={16 / 9} className="bg-muted">
            <img
              src={photo.photo_url}
              alt={photo.caption || `Foto ${photo.sequence_number}`}
              className="object-cover w-full h-full cursor-pointer"
              onClick={() => setIsFullSizeView(true)}
            />
          </AspectRatio>
          
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              size="icon" 
              variant="secondary" 
              onClick={() => setIsFullSizeView(true)}
              className="h-8 w-8 bg-opacity-70 backdrop-blur-sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              onClick={() => setIsEditing(!isEditing)}
              className="h-8 w-8 bg-opacity-70 backdrop-blur-sm"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant="destructive" 
              onClick={() => onDelete(photo)}
              className="h-8 w-8 bg-opacity-70 backdrop-blur-sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-3 space-y-2">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor={`photo-caption-${photo.id}`}>Legenda</Label>
                <Input
                  id={`photo-caption-${photo.id}`}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Adicione uma legenda"
                />
              </div>
              
              <div>
                <Label htmlFor={`photo-notes-${photo.id}`}>Observações</Label>
                <Textarea
                  id={`photo-notes-${photo.id}`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione observações sobre esta foto"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {photo.caption && (
                <p className="text-sm font-medium">{photo.caption}</p>
              )}
              {photo.notes && (
                <p className="text-sm text-muted-foreground">{photo.notes}</p>
              )}
              {!photo.caption && !photo.notes && (
                <p className="text-sm italic text-muted-foreground">
                  Clique no ícone de edição para adicionar legenda e observações
                </p>
              )}
            </>
          )}
        </div>
      </div>
      
      <Dialog open={isFullSizeView} onOpenChange={setIsFullSizeView}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{photo.caption || `Foto ${photo.sequence_number}`}</DialogTitle>
            {photo.notes && (
              <DialogDescription>{photo.notes}</DialogDescription>
            )}
          </DialogHeader>
          <div className="overflow-auto">
            <img
              src={photo.photo_url}
              alt={photo.caption || `Foto ${photo.sequence_number}`}
              className="w-full h-auto"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
