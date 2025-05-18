
import { useState, useEffect } from "react";
import { Service, Mechanic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Save } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addCompletedService, saveServiceHistory } from "@/lib/storage";
import ServiceListItem from "./ServiceListItem";
import ServiceTotals from "./ServiceTotals";
import { formatWhatsAppMessage } from "./WhatsAppMessage";

interface SelectedServicesListProps {
  selectedServices: Service[];
  mechanics: Mechanic[];
  onRemoveService: (id: string) => void;
  onCompleteCheckout: () => void;
}

const SelectedServicesList = ({ 
  selectedServices, 
  mechanics,
  onRemoveService,
  onCompleteCheckout
}: SelectedServicesListProps) => {
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [selectedMechanicId, setSelectedMechanicId] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [historyTitle, setHistoryTitle] = useState<string>("");
  const [showSaveHistory, setShowSaveHistory] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    setCurrentDate(`${day}/${month}`);

    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
    setTotalAmount(total);
    setRemainingAmount(total - receivedAmount);
  }, [selectedServices, receivedAmount]);

  useEffect(() => {
    // Mostrar opção de salvar histórico apenas se houver serviços selecionados
    setShowSaveHistory(selectedServices.length > 0);
  }, [selectedServices]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setReceivedAmount(value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHistoryTitle(e.target.value);
  };

  const handleSendWhatsApp = () => {
    if (!selectedMechanicId) {
      toast.error("Por favor, selecione um mecânico responsável");
      return;
    }

    const mechanic = mechanics.find(m => m.id === selectedMechanicId);

    if (!mechanic) {
      toast.error("Mecânico não encontrado");
      return;
    }

    const message = formatWhatsAppMessage(
      currentDate,
      mechanic.name, 
      selectedServices, 
      totalAmount, 
      receivedAmount, 
      remainingAmount,
      formatPrice
    );
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");

    const completedService = {
      id: crypto.randomUUID(),
      mechanicId: selectedMechanicId,
      serviceIds: selectedServices.map(s => s.id),
      totalAmount: totalAmount,
      receivedAmount: receivedAmount,
      completionDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    addCompletedService(completedService);
    onCompleteCheckout();
    toast.success("Serviço registrado com sucesso");
  };

  const handleSaveHistory = async () => {
    if (!selectedMechanicId) {
      toast.error("Por favor, selecione um mecânico responsável");
      return;
    }

    if (!historyTitle.trim()) {
      toast.error("Por favor, dê um título para salvar no histórico");
      return;
    }

    try {
      await saveServiceHistory({
        title: historyTitle.trim(),
        mechanic_id: selectedMechanicId,
        service_data: selectedServices,
        total_amount: totalAmount,
        received_amount: receivedAmount
      });
      
      toast.success("Histórico salvo com sucesso");
      
      // Limpar o título após salvar
      setHistoryTitle("");
    } catch (error) {
      console.error("Erro ao salvar histórico:", error);
      toast.error("Não foi possível salvar o histórico");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Selecionados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedServices.length > 0 ? (
          <ul className="divide-y">
            {selectedServices.map((service, index) => (
              <ServiceListItem
                key={`${service.id}-${index}`}
                service={service}
                formatPrice={formatPrice}
                onRemove={onRemoveService}
              />
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Nenhum serviço selecionado.
          </p>
        )}

        {selectedServices.length > 0 && (
          <>
            <div>
              <Label htmlFor="mechanic">Mecânico Responsável</Label>
              <Select value={selectedMechanicId} onValueChange={setSelectedMechanicId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um mecânico" />
                </SelectTrigger>
                <SelectContent>
                  {mechanics.map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ServiceTotals
              totalAmount={totalAmount}
              receivedAmount={receivedAmount}
              remainingAmount={remainingAmount}
              formatPrice={formatPrice}
              onReceivedAmountChange={handleReceivedAmountChange}
            />

            {showSaveHistory && (
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="history-title">Título do Histórico</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="history-title" 
                    value={historyTitle} 
                    onChange={handleTitleChange}
                    placeholder="Ex: Cliente João - Honda CG 160" 
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleSaveHistory}
                    disabled={!historyTitle.trim() || !selectedMechanicId}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      {selectedServices.length > 0 && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSendWhatsApp}
            disabled={!selectedServices.length || !selectedMechanicId}
          >
            <Send className="mr-2 h-4 w-4" />
            Enviar por WhatsApp
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SelectedServicesList;
