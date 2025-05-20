
import { useState } from "react";
import { ServiceHistory } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Send, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatWhatsAppMessage } from "../WhatsAppMessage";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ServiceItemDetails } from "./ServiceItemDetails";
import { ServiceTotalsSummary } from "./ServiceTotalsSummary";

interface HistoryItemProps {
  item: ServiceHistory;
  expandedItem: string | null;
  formatPrice: (price: number) => string;
  onDelete: (id: string) => void;
  onSelect?: (history: ServiceHistory) => void;
  toggleExpand: (id: string) => void;
}

export const HistoryItem = ({ 
  item, 
  expandedItem, 
  formatPrice, 
  onDelete, 
  onSelect, 
  toggleExpand 
}: HistoryItemProps) => {
  const handleSendWhatsApp = () => {
    if (!item.mechanic) {
      toast.error("Mecânico não encontrado");
      return;
    }

    // Formata a data para o formato dd/mm
    const currentDate = format(new Date(item.created_at), "dd/MM", { locale: ptBR });

    const message = formatWhatsAppMessage(
      currentDate,
      item.mechanic.name, 
      item.service_data, 
      item.total_amount, 
      item.received_amount, 
      item.total_amount - item.received_amount,
      formatPrice
    );
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Card key={item.id} className="border border-border">
      <CardHeader className="py-3 cursor-pointer" onClick={() => toggleExpand(item.id)}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-semibold">{item.title}</h3>
            <p className="text-xs text-muted-foreground">
              {item.mechanic?.name} • {format(new Date(item.created_at), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">{formatPrice(item.total_amount)}</p>
            <p className="text-xs text-muted-foreground">
              {item.service_data.length} {item.service_data.length === 1 ? 'serviço' : 'serviços'}
            </p>
          </div>
        </div>
      </CardHeader>
      
      {expandedItem === item.id && (
        <>
          <div className="px-6 py-2 border-t border-border">
            <ServiceItemDetails services={item.service_data} formatPrice={formatPrice} />
            <ServiceTotalsSummary 
              totalAmount={item.total_amount}
              receivedAmount={item.received_amount}
              remainingAmount={item.total_amount - item.received_amount}
              formatPrice={formatPrice}
            />
          </div>
          
          <CardFooter className="flex justify-between p-3 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir histórico</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir este histórico? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-red-500 hover:bg-red-600" 
                    onClick={() => onDelete(item.id)}>
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <div className="flex space-x-2">
              {onSelect && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelect(item)}>
                  Reutilizar
                </Button>
              )}
              <Button
                variant="default" 
                size="sm"
                onClick={handleSendWhatsApp}>
                <Send className="h-4 w-4 mr-1" />
                WhatsApp
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
