
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
  message += "-------------------------------------------------------\n\n";
  
  services.forEach((service, index) => {
    const formattedPrice = service.price > 0 ? formatPrice(service.price).replace('R$', '').trim() : '0,00';

    // Coloca a descrição do serviço primeiro
    message += `*${index + 1}-* ${service.name}\n`;
    
    // Verificar se há um comentário e formatá-lo corretamente
    if (service.comment && service.comment.trim() !== '') {
      // Remove underscores e parênteses do comentário
      const cleanComment = service.comment
        .replace(/^_/, '') // Remove underscore no início
        .replace(/_$/, '') // Remove underscore no final
        .replace(/\(_/, '') // Remove parentese e underscore no início
        .replace(/_\)$/, '') // Remove underscore e parentese no final
        .replace(/\(|\)/g, ''); // Remove todos os parênteses restantes
      
      // Dividir o comentário por linhas para formatar cada uma corretamente
      const lines = cleanComment.split('\n').filter(line => line.trim() !== '');
      
      lines.forEach(line => {
        // Usar espaçamento para alinhar com o texto após os números
        message += `  • ${line.trim()}\n`;  // Bullet point para cada linha do comentário
      });
    }
    
    // Adiciona o valor no final de cada serviço (após comentários), apenas se o preço for maior que zero
    if (service.price > 0) {
      message += `  • Valor..............................R$= ${formattedPrice}\n`;
    }
    
    // Adicione uma linha em branco após cada serviço
    message += "\n";
  });

  // Adicionar totais apenas se pelo menos um dos valores for maior que zero
  if (total > 0 || received > 0 || remaining > 0) {
    message += "-------------------------------------------------------\n";
    message += `*Total...............R$* = ${formatPrice(total).replace('R$', '').trim()}\n`;
    message += `*Adiantado.......R$* = ${formatPrice(received).replace('R$', '').trim()}\n`;
    message += `*Total Geral......R$* = ${formatPrice(remaining).replace('R$', '').trim()}`;
  }

  return message;
};
