
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
  message += `*MECÂNICO:* ${mechanicName}\n`;
  message += `*DATA:* ${currentDate}\n`;
  message += "--------------------------------------------------\n\n";
  
  services.forEach((service, index) => {
    const formattedPrice = formatPrice(service.price).replace('R$', '').trim();
    message += `*${index + 1}-* ${service.name} =R$ ${formattedPrice}\n`;
    if (service.description) {
      message += `${service.description}\n`;
    }
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
