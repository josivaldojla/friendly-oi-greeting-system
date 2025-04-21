
import { Service } from "@/lib/types";

// Agora Service pode (durante checkout) possuir comentário opcional
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
  let message = `*SERVIÇOS DO DIA ${currentDate}*\n\n`;
  message += "--------------------------------------------------\n\n";
  
  services.forEach((service, index) => {
    const formattedPrice = formatPrice(service.price).replace('R$', '').trim();
    message += `*${index + 1}-* ${service.name} =R$ ${formattedPrice}\n`;
    if (service.description) {
      message += `${service.description}\n`;
    }
    // Exibe comentário abaixo da descrição, entre parênteses
    if (service.comment) {
      message += `(${service.comment})\n`;
    }
    message += "\n";
  });

  message += "--------------------------------------------------\n";
  message += `*Total...............R$* = ${formatPrice(total).replace('R$', '').trim()}\n`;
  message += `*Adiantado.......R$* = ${formatPrice(received).replace('R$', '').trim()}\n`;
  message += `*Total Geral......R$* = ${formatPrice(remaining).replace('R$', '').trim()}`;

  return message;
};
