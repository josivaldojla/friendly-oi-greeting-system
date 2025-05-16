
import { Service } from "@/lib/types";

type ServiceWithOptionalComment = Service & { comment?: string };

export const formatWhatsAppMessage = (
  currentDate: string,
  mechanicName: string, 
  services: ServiceWithOptionalComment[], 
  total: number, 
  received: number, 
  remaining: number,
  formatPrice: (price: number) => string
) => {
  let message = `*HELENO MOTOS*\n`;
  message += `*Mecânico:* ${mechanicName}\n`;
  message += `*Data:* ${currentDate}\n`;
  message += "--------------------------------------------------\n\n";
  
  services.forEach((service, index) => {
    const formattedPrice = formatPrice(service.price).replace('R$', '').trim();
    message += `${index + 1}- ${service.name} =R$ ${formattedPrice}\n`;
    
    // Verificar se há um comentário e formatá-lo corretamente
    if (service.comment) {
      // Remove underscores e parênteses do comentário
      const cleanComment = service.comment
        .replace(/^_/, '') // Remove underscore no início
        .replace(/_$/, '') // Remove underscore no final
        .replace(/\(_/, '') // Remove parentese e underscore no início
        .replace(/_\)$/, ''); // Remove underscore e parentese no final
      
      // Dividir o comentário por linhas para formatar cada uma corretamente
      const lines = cleanComment.split('\n').filter(line => line.trim() !== '');
      
      lines.forEach(line => {
        // Se a linha contém "Modelo:", "Cliente:" ou outra informação específica
        if (line.includes('Modelo:')) {
          message += `• ${line}\n`;
        } else if (line.includes('Cliente:')) {
          message += `• ${line}\n`;
        } else {
          // Qualquer outro texto de comentário
          message += `• ${line}\n`;
        }
      });
    }
    
    // Adicione uma linha em branco após cada serviço
    message += "\n";
  });

  message += "--------------------------------------------------\n";
  message += `*Total...............R$* = ${formatPrice(total).replace('R$', '').trim()}\n`;
  message += `*Adiantado.......R$* = ${formatPrice(received).replace('R$', '').trim()}\n`;
  message += `*Total Geral......R$* = ${formatPrice(remaining).replace('R$', '').trim()}`;

  return message;
};
