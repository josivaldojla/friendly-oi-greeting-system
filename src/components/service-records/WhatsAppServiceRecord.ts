
import { ServicePhoto } from "@/lib/types";

export const formatServiceRecordWhatsAppMessage = (
  currentDate: string,
  mechanicName: string,
  title: string,
  customerName: string,
  motorcycleModelName: string,
  notes?: string,
  photos?: ServicePhoto[]
) => {
  let message = `*HELENO MOTOS*\n`;
  message += `*Mecânico:* ${mechanicName || "Não definido"}\n`;
  message += `*Data:* ${currentDate}\n`;
  message += "-------------------------------------------------------\n\n";
  
  message += `${title || "Registro de Serviço"}\n\n`;
  message += `*Cliente:* ${customerName}\n`;
  message += `*Modelo da moto:* ${motorcycleModelName}\n\n`;
  
  if (notes) {
    message += `*Observações:*\n${notes}\n\n`;
  }
  
  // Se houver fotos, incluir informações sobre elas no texto principal
  if (photos && photos.length > 0) {
    message += `*📸 FOTOS DO SERVIÇO (${photos.length}):*\n\n`;
    
    photos.forEach((photo, index) => {
      message += `*Foto ${index + 1}:*\n`;
      
      if (photo.caption) {
        message += `📝 ${photo.caption}\n`;
      }
      
      if (photo.notes) {
        const cleanComment = photo.notes
          .replace(/^_/, '')
          .replace(/_$/, '')
          .replace(/\(_/, '')
          .replace(/_\)$/, '')
          .replace(/\(|\)/g, '');
        
        const lines = cleanComment.split('\n').filter(line => line.trim() !== '');
        if (lines.length > 0) {
          message += `📋 Observações:\n`;
          lines.forEach(line => {
            message += `  • ${line.trim()}\n`;
          });
        }
      }
      
      // Incluir o link da foto diretamente no texto
      message += `🔗 ${photo.photo_url}\n\n`;
    });
  } else {
    message += `📷 *Nenhuma foto anexada neste registro.*\n\n`;
  }
  
  message += "-------------------------------------------------------\n";
  message += `💡 *Nota:* Clique nos links das fotos para visualizá-las.`;

  return message;
};
