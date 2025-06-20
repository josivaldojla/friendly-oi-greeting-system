
import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Service, ServiceHistory } from "@/lib/types";
import { Plus, Minus, Search } from "lucide-react";
import { toast } from "sonner";
import { getServices } from "@/lib/storage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historyItem: ServiceHistory | null;
  onSave: (id: string, title: string, serviceData: Service[], receivedAmount: number) => Promise<void>;
}

export const EditHistoryDialog = ({ 
  open, 
  onOpenChange, 
  historyItem, 
  onSave 
}: EditHistoryDialogProps) => {
  const [title, setTitle] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Carregar a lista de serviços cadastrados quando o diálogo abrir
  useEffect(() => {
    const loadAvailableServices = async () => {
      if (open) {
        setLoadingServices(true);
        try {
          const servicesData = await getServices();
          setAvailableServices(servicesData);
        } catch (error) {
          console.error("Erro ao carregar serviços:", error);
          toast.error("Não foi possível carregar a lista de serviços");
        } finally {
          setLoadingServices(false);
        }
      }
    };
    
    loadAvailableServices();
  }, [open]);

  // Atualizar os dados quando o item de histórico mudar
  useEffect(() => {
    if (historyItem) {
      setTitle(historyItem.title);
      setServices([...historyItem.service_data]);
      setReceivedAmount(historyItem.received_amount);
      
      // Recalcular o valor total
      const total = historyItem.service_data.reduce(
        (sum, service) => sum + service.price, 
        0
      );
      setTotalAmount(total);
    }
  }, [historyItem]);

  // Recalcular o total quando os serviços mudarem
  useEffect(() => {
    const total = services.reduce((sum, service) => sum + service.price, 0);
    setTotalAmount(total);
  }, [services]);

  const handleSave = async () => {
    if (historyItem && title.trim() && services.length > 0) {
      setIsSaving(true);
      try {
        await onSave(historyItem.id, title.trim(), services, receivedAmount);
        onOpenChange(false);
        toast.success("Histórico atualizado com sucesso");
      } catch (error) {
        console.error("Erro ao salvar histórico:", error);
        toast.error("Erro ao salvar histórico");
      } finally {
        setIsSaving(false);
      }
    } else if (!title.trim()) {
      toast.error("O título não pode estar vazio");
    } else if (services.length === 0) {
      toast.error("Adicione pelo menos um serviço");
    }
  };

  const handleUpdateServicePrice = (index: number, price: number) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      price: price
    };
    setServices(updatedServices);
  };

  const handleUpdateServiceName = (index: number, name: string) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      name: name
    };
    setServices(updatedServices);
  };

  const handleUpdateServiceComment = (index: number, comment: string) => {
    const updatedServices = [...services];
    updatedServices[index] = {
      ...updatedServices[index],
      comment: comment
    };
    setServices(updatedServices);
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSelectRegisteredService = (index: number, serviceId: string) => {
    if (serviceId === "no-service") return;
    
    const selectedService = availableServices.find(s => s.id === serviceId);
    if (selectedService) {
      const updatedServices = [...services];
      // Manter o comentário existente se houver
      const existingComment = updatedServices[index].comment;
      
      updatedServices[index] = {
        ...selectedService,
        comment: existingComment
      };
      
      setServices(updatedServices);
      toast.success(`Serviço atualizado para ${selectedService.name}`);
    }
  };

  // Formatar preço para exibição
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Histórico</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do histórico"
              autoFocus
            />
          </div>

          <div className="space-y-4">
            <Label>Serviços</Label>
            {services.map((service, index) => (
              <div key={`${service.id}-${index}`} className="p-3 border rounded-md space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex-grow space-y-2">
                    <Label htmlFor={`service-name-${index}`}>Nome do Serviço</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id={`service-name-${index}`}
                        value={service.name}
                        onChange={(e) => handleUpdateServiceName(index, e.target.value)}
                        className="flex-grow"
                      />
                      
                      <Select 
                        onValueChange={(value) => handleSelectRegisteredService(index, value)}
                        disabled={loadingServices}
                      >
                        <SelectTrigger className="w-auto">
                          <Search className="h-4 w-4" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-service">Escolher serviço...</SelectItem>
                          {availableServices.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name} - {formatPrice(s.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleRemoveService(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <Label htmlFor={`service-price-${index}`}>Preço (R$)</Label>
                  <Input
                    id={`service-price-${index}`}
                    type="number"
                    value={service.price}
                    onChange={(e) => handleUpdateServicePrice(index, Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`service-comment-${index}`}>Comentário</Label>
                  <Textarea
                    id={`service-comment-${index}`}
                    value={service.comment || ''}
                    onChange={(e) => handleUpdateServiceComment(index, e.target.value)}
                    className="mt-1 min-h-[60px]"
                    placeholder="Comentário sobre o serviço (opcional)"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total:</span>
              <span className="font-semibold">{formatPrice(totalAmount)}</span>
            </div>
            
            <Label htmlFor="received-amount">Valor Recebido (R$)</Label>
            <Input
              id="received-amount"
              type="number"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(Number(e.target.value))}
            />
            
            <div className="flex justify-between text-sm mt-2">
              <span>Valor Restante:</span>
              <span className="font-semibold">{formatPrice(totalAmount - receivedAmount)}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim() || services.length === 0 || isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
