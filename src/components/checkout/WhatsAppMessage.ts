
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
    
    // Coloca a descrição do serviço primeiro
    message += `*${index + 1}-* ${service.name}\n`;
    
    // Coloca o valor abaixo com bullet point
    message += `teste •  Valor....................R$= ${formattedPrice}\n`;
    
    // Verificar se há um comentário e formatá-lo corretamente
    if (service.comment) {
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
        message += `  • ${line}\n`;  // Dois espaços antes do bullet para alinhar corretamente
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
