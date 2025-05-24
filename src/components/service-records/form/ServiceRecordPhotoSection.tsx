
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { PhotoUploader } from "../PhotoUploader";
import { PhotoGallery } from "../PhotoGallery";
import { ServicePhoto, PhotoViewMode } from "@/lib/types";
import { 
  addServicePhoto, 
  deleteServicePhoto, 
  getServicePhotos, 
  deleteStoragePhoto,
  getCustomerById,
  getMotorcycleModelById
} from "@/lib/storage";
import { toast } from "sonner";
import { format } from "date-fns";

interface ServiceRecordPhotoSectionProps {
  serviceRecordId: string;
  title: string;
  customerId?: string;
  motorcycleModelId?: string;
  mechanicName: string;
  notes?: string;
}

export const ServiceRecordPhotoSection: React.FC<ServiceRecordPhotoSectionProps> = ({
  serviceRecordId,
  title,
  customerId,
  motorcycleModelId,
  mechanicName,
  notes
}) => {
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [viewMode, setViewMode] = useState<PhotoViewMode>('grid');

  // Load photos on component mount
  useEffect(() => {
    loadPhotos(serviceRecordId);
  }, [serviceRecordId]);

  const loadPhotos = async (serviceId: string) => {
    setLoadingPhotos(true);
    try {
      const photosData = await getServicePhotos(serviceId);
      setPhotos(photosData);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error('Erro ao carregar fotos');
    } finally {
      setLoadingPhotos(false);
    }
  };
  
  const handlePhotoUploaded = async (url: string) => {
    try {
      const newPhoto: Omit<ServicePhoto, 'id' | 'created_at'> = {
        service_record_id: serviceRecordId,
        photo_url: url,
        caption: null,
        notes: null,
        sequence_number: photos.length + 1
      };
      
      const addedPhoto = await addServicePhoto(newPhoto);
      if (addedPhoto) {
        setPhotos([...photos, addedPhoto]);
      } else {
        toast.error('Erro ao adicionar foto ao registro');
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      toast.error('Erro ao adicionar foto ao registro');
    }
  };
  
  const handleDeletePhoto = async (photo: ServicePhoto) => {
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
      try {
        // Delete from database
        const deleted = await deleteServicePhoto(photo.id);
        
        if (deleted) {
          // Delete from storage
          await deleteStoragePhoto(photo.photo_url);
          
          // Update UI
          setPhotos(photos.filter(p => p.id !== photo.id));
          toast.success('Foto excluída com sucesso');
        } else {
          toast.error('Erro ao excluir foto');
        }
      } catch (error) {
        console.error('Error deleting photo:', error);
        toast.error('Erro ao excluir foto');
      }
    }
  };
  
  const handleUpdatePhoto = (updatedPhoto: ServicePhoto) => {
    setPhotos(photos.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };
  
  const handleShareOnWhatsApp = async () => {
    try {
      let customerName = "Cliente não especificado";
      let motorcycleModelName = "Modelo não especificado";
      
      // Buscar nome do cliente
      if (customerId) {
        const customer = await getCustomerById(customerId);
        if (customer) {
          customerName = customer.name;
        }
      }
      
      // Buscar nome do modelo da moto
      if (motorcycleModelId) {
        const model = await getMotorcycleModelById(motorcycleModelId);
        if (model) {
          motorcycleModelName = model.name;
        }
      }

      // Criar data formatada
      const currentDate = format(new Date(), "dd/MM");
      
      // Criar mensagem personalizada para fotos
      let message = `*HELENO MOTOS*\n`;
      message += `*Mecânico:* ${mechanicName || "Não definido"}\n`;
      message += `*Data:* ${currentDate}\n`;
      message += "-------------------------------------------------------\n\n";
      
      message += `*${title || "Registro de Serviço"}*\n\n`;
      message += `*Cliente:* ${customerName}\n`;
      message += `*Modelo da moto:* ${motorcycleModelName}\n\n`;
      
      if (notes) {
        message += `*Observações:*\n${notes}\n\n`;
      }
      
      // Adicionar informações das fotos
      if (photos.length > 0) {
        photos.forEach((photo, index) => {
          message += `*${index + 1}-* Foto ${index + 1}`;
          if (photo.caption) {
            message += `: ${photo.caption}`;
          }
          message += "\n";
          
          if (photo.notes) {
            // Dividir o comentário por linhas para formatar cada uma corretamente
            const lines = photo.notes.split('\n').filter(line => line.trim() !== '');
            lines.forEach(line => {
              message += `  • ${line}\n`;
            });
          }
          
          message += "\n";
        });
      }
      
      // Create WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
      
      // Open in a new tab
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error sharing on WhatsApp:', error);
      toast.error('Erro ao compartilhar no WhatsApp');
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h3 className="text-lg font-medium">Fotos do Serviço</h3>
        
        <PhotoUploader 
          serviceId={serviceRecordId} 
          onPhotoUploaded={handlePhotoUploaded}
        />
        
        {loadingPhotos ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Carregando fotos...</p>
          </div>
        ) : (
          <PhotoGallery
            photos={photos}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onDeletePhoto={handleDeletePhoto}
            onUpdatePhoto={handleUpdatePhoto}
          />
        )}
        
        {photos.length > 0 && (
          <div className="pt-4">
            <Button 
              variant="outline" 
              onClick={handleShareOnWhatsApp}
              className="w-full"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar Registro no WhatsApp
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
