
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
  // Mensagem inicial tem apenas a linha de separação
  let message = "--------------------------------------------------\n\n";
  
  // Lista de serviços com o formato exato da segunda imagem
  services.forEach((service, index) => {
    // Número do serviço em negrito seguido do nome
    message += `*${index + 1}-* ${service.name}\n`;
    
    // Se houver comentários/detalhes, formatamos conforme a segunda imagem
    if (service.comment) {
      // Processamos o comentário para extrair informações específicas
      const commentLines = service.comment.split('\n').filter(line => line.trim() !== '');
      
      commentLines.forEach(line => {
        // Extrair o tipo de informação (Modelo, Cliente, etc.)
        if (line.includes('• Modelo:')) {
          const modelValue = line.replace('• Modelo:', '').trim();
          message += `• Modelo: ${modelValue}\n`;
        } 
        else if (line.includes('• Cliente:')) {
          const clientValue = line.replace('• Cliente:', '').trim();
          message += `• Cliente: ${clientValue}\n`;
        }
        // Para a identificação ou outros detalhes
        else {
          // Remove marcadores para manter apenas o texto
          const cleanLine = line.replace(/^• /, '').trim();
          message += `• ${cleanLine}\n`;
        }
      });
    }
    
    // Valor com a formatação exata da segunda imagem (espaço correto)
    const priceValue = formatPrice(service.price).replace('R$', '').trim();
    message += `• Valor .........................R$= ${priceValue}\n\n`;
  });
  
  // Linha de separação antes dos totais
  message += "--------------------------------------------------\n";
  
  // Totais com o formato exato da segunda imagem
  message += `Total...............R$ = ${formatPrice(total).replace('R$', '').trim()}\n`;
  message += `Adiantado.......R$ = ${formatPrice(received).replace('R$', '').trim()}\n`;
  message += `Total Geral......R$ = ${formatPrice(remaining).replace('R$', '').trim()}`;

  // Adiciona a identificação da oficina após os valores
  message += "\n\nHELENO MOTOS\n";
  message += `Mecânico: ${mechanicName}\n`;
  message += `Data: ${currentDate}`;

  return message;
};
