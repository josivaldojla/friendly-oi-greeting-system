
import { Service } from "@/lib/types";

export const formatWhatsAppMessage = (
  currentDate: string,
  mechanicName: string, 
  services: Service[], 
  total: number, 
  received: number, 
  remaining: number,
  formatPrice: (price: number) => string
) => {
  let message = `SERVIÇOS DO DIA ${currentDate}\n\n`;
  message += "--------------------------------------------------\n\n";
  
  services.forEach((service, index) => {
    const formattedPrice = formatPrice(service.price).replace('R$ ', '');
    message += `${index + 1}- ${service.name} = *${formattedPrice}*\n\n`;
  });

  message += "--------------------------------------------------\n";
  message += `Total..........*${formatPrice(total).replace('R$ ', '')}*\n`;
  message += `Adiantado......*${formatPrice(received).replace('R$ ', '')}*\n`;
  message += `Total Geral....*${formatPrice(remaining).replace('R$ ', '')}*`;

  return message;
};
