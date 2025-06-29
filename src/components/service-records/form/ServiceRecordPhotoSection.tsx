
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Share2, Image, Trash2 } from 'lucide-react';
import { ServicePhoto } from '@/lib/types';
import { PhotoUploader } from '../PhotoUploader';
import { PhotoGallery } from '../PhotoGallery';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ServiceRecordPhotoSectionProps {
  serviceRecordId: string;
  photos: ServicePhoto[];
  onPhotosChange: (photos: ServicePhoto[]) => void;
  mechanicName?: string;
  customerName?: string;
  motorcycleModel?: string;
  notes?: string;
}

export const ServiceRecordPhotoSection: React.FC<ServiceRecordPhotoSectionProps> = ({
  serviceRecordId,
  photos,
  onPhotosChange,
  mechanicName,
  customerName,
  motorcycleModel,
  notes
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handlePhotoUploaded = (newPhoto: ServicePhoto) => {
    onPhotosChange([...photos, newPhoto]);
  };

  const handlePhotoDeleted = (photo: ServicePhoto) => {
    onPhotosChange(photos.filter(p => p.id !== photo.id));
  };

  const handlePhotoUpdated = (updatedPhoto: ServicePhoto) => {
    onPhotosChange(photos.map(photo => 
      photo.id === updatedPhoto.id ? updatedPhoto : photo
    ));
  };

  const handleShareWhatsApp = () => {
    try {
      // Criar data formatada
      const currentDate = format(new Date(), "dd/MM");
      
      // Criar mensagem sem incluir links das fotos
      let message = `*HELENO MOTOS*\n`;
      message += `*Mecânico:* ${mechanicName || "Não definido"}\n`;
      message += `*Data:* ${currentDate}\n`;
      message += `*Cliente:* ${customerName || "Não definido"}\n`;
      message += `*Modelo:* ${motorcycleModel || "Não definido"}\n\n`;
      
      message += "-------------------------------------------------------\n";
      message += "*RELATÓRIO DE SERVIÇO*\n";
      message += "-------------------------------------------------------\n\n";
      
      if (notes) {
        message += `*Observações:*\n${notes}\n\n`;
      }
      
      // Se houver fotos, adicionar apenas a informação sobre elas
      if (photos.length > 0) {
        message += `📷 *FOTOS DO SERVIÇO (${photos.length}):*\n`;
        
        photos.forEach((photo, index) => {
          message += `${index + 1}. `;
          if (photo.caption) {
            message += `${photo.caption}`;
          } else {
            message += `Foto do serviço`;
          }
          
          if (photo.notes) {
            message += ` - ${photo.notes}`;
          }
          message += '\n';
        });
        
        message += '\n';
      }
      
      // Adicionar informações de contato
      message += "-------------------------------------------------------\n";
      message += "*HELENO MOTOS - OFICINA ESPECIALIZADA*\n";
      message += "📍 Endereço: [Inserir endereço]\n";
      message += "📞 Telefone: [Inserir telefone]\n";
      
      // Adicionar assinatura personalizada se houver mecânico
      if (mechanicName) {
        message += `👨‍🔧 Atendimento: ${mechanicName}\n`;
      }
      
      // Link para avaliação (opcional)
      message += "\n⭐ *Avalie nosso serviço!*\n";
      message += "Sua opinião é muito importante para nós.\n";
      
      // Adicionar call-to-action
      message += "\n🔧 *Precisando de mais algum serviço?*\n";
      message += "Entre em contato conosco!\n";
      
      // Hashtags para visibilidade
      message += "\n#HelenoMotos #OficinaEspecializada #ManutencaoMotos";
      
      // Adicionar informação sobre fotos se houver
      if (photos.length > 0) {
        message += "\n\n📎 *Anexos:*\n";
        photos.forEach((photo, index) => {
          message += `📷 Foto ${index + 1}`;
          if (photo.caption) {
            message += ` - ${photo.caption}`;
          }
          message += '\n';
        });
        
        message += "-------------------------------------------------------\n";
        message += "*As fotos serão enviadas em seguida...*";
      }
      
      // Enviar apenas a mensagem de texto
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('Mensagem enviada para o WhatsApp! Anexe as fotos manualmente.');
    } catch (error) {
      console.error('Error sharing on WhatsApp:', error);
      toast.error('Erro ao compartilhar no WhatsApp');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          <CardTitle className="text-lg">Fotos do Serviço</CardTitle>
          {photos.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
            </Badge>
          )}
        </div>
        {photos.length > 0 && (
          <Button
            onClick={handleShareWhatsApp}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Enviar WhatsApp
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <PhotoUploader
          serviceRecordId={serviceRecordId}
          onPhotoUploaded={handlePhotoUploaded}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
        />

        {photos.length > 0 ? (
          <PhotoGallery
            photos={photos}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onDeletePhoto={handlePhotoDeleted}
            onUpdatePhoto={handlePhotoUpdated}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma foto adicionada ainda</p>
            <p className="text-sm">Clique em "Adicionar Foto" para começar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
