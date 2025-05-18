
import { useState, useEffect } from "react";
import { ServiceHistory, getServiceHistory, deleteServiceHistory } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Send, Clock, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { formatWhatsAppMessage } from "./WhatsAppMessage";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServiceHistoryListProps {
  onSelect?: (history: ServiceHistory) => void;
}

const ServiceHistoryList = ({ onSelect }: ServiceHistoryListProps) => {
  const [history, setHistory] = useState<ServiceHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getServiceHistory();
      setHistory(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      toast.error("Não foi possível carregar o histórico");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteServiceHistory(id);
      toast.success("Histórico removido com sucesso");
      loadHistory();
    } catch (error) {
      console.error("Erro ao excluir histórico:", error);
      toast.error("Não foi possível excluir o histórico");
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleSendWhatsApp = (item: ServiceHistory) => {
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

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-sm text-muted-foreground">Carregando histórico...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum histórico encontrado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Os serviços salvos aparecerão aqui para uso futuro
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Serviços</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id} className="border border-border">
              <CardHeader className="py-3 cursor-pointer" onClick={() => toggleExpand(item.id)}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
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
                    <ul className="divide-y">
                      {item.service_data.map((service, index) => (
                        <li key={`${service.id}-${index}`} className="py-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{service.name}</span>
                            <span>{formatPrice(service.price)}</span>
                          </div>
                          {service.comment && (
                            <p className="text-sm text-muted-foreground mt-1 pl-4 border-l-2 border-muted">
                              {service.comment}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 pt-2 border-t">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">{formatPrice(item.total_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adiantado:</span>
                        <span>{formatPrice(item.received_amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Restante:</span>
                        <span className="font-bold">{formatPrice(item.total_amount - item.received_amount)}</span>
                      </div>
                    </div>
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
                            onClick={() => handleDelete(item.id)}>
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
                        onClick={() => handleSendWhatsApp(item)}>
                        <Send className="h-4 w-4 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceHistoryList;
