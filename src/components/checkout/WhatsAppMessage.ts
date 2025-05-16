
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
    // Formata o número do serviço com negrito
    message += `*${index + 1}-* ${service.name}\n`;
    
    // Se houver comentários ou detalhes adicionais, os formatamos como pontos
    if (service.comment) {
      // Remove formatações indesejadas do comentário
      const cleanComment = service.comment
        .replace(/^_/, '')
        .replace(/_$/, '')
        .replace(/\(_/, '')
        .replace(/_\)$/, '')
        .replace(/\(|\)/g, '');
      
      // Dividir o comentário por linhas
      const lines = cleanComment.split('\n').filter(line => line.trim() !== '');
      
      lines.forEach(line => {
        message += `• ${line}\n`;
      });
    }
    
    // Adiciona o valor com o formato exato da imagem (R$= 0,00)
    const priceValue = formatPrice(service.price).replace('R$', '').trim();
    message += `• Valor ........................R$= ${priceValue}\n\n`;
  });

  message += "--------------------------------------------------\n";
  message += `Total...............R$ = ${formatPrice(total).replace('R$', '').trim()}\n`;
  message += `Adiantado.......R$ = ${formatPrice(received).replace('R$', '').trim()}\n`;
  message += `Total Geral......R$ = ${formatPrice(remaining).replace('R$', '').trim()}`;

  return message;
};
