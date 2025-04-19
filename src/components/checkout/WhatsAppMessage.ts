
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
  let message = `*SERVIÇOS DO DIA ${currentDate}*\n\n`;
  message += "--------------------------------------------------\n\n";
  
  services.forEach((service, index) => {
    const formattedPrice = formatPrice(service.price).replace('R$', '').trim();
    message += `*${index + 1}-* ${service.name} =R$ ${formattedPrice}\n\n`;
  });

  message += "--------------------------------------------------\n";
<<<<<<< HEAD
  message += `Total...........*R$ = ${formatPrice(total).replace('R$', '').trim()}\n`;
  message += `Adiantado.......R$* = ${formatPrice(received).replace('R$', '').trim()}\n`;
  message += `Total Geral.....R$* = ${formatPrice(remaining).replace('R$', '').trim()}`;
=======
  message += `*Total...........R$* = ${formatPrice(total).replace('R$', '').trim()}\n`;
  message += `*Adiantado.......R$* = ${formatPrice(received).replace('R$', '').trim()}\n`;
  message += `*Total Geral.....R$* = ${formatPrice(remaining).replace('R$', '').trim()}`;
>>>>>>> 22cd5341431b592673cca3d905945c716306e635

  return message;
};
