
import { useState, useEffect } from "react";
import { Service, Mechanic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addCompletedService } from "@/lib/storage";
import ServiceListItem from "./ServiceListItem";
import ServiceTotals from "./ServiceTotals";
import { formatWhatsAppMessage } from "./WhatsAppMessage";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SelectedServicesListProps {
  selectedServices: Service[];
  mechanics: Mechanic[];
  onRemoveService: (id: string) => void;
  onCompleteCheckout: () => void;
  selectedMechanicId: string;
  onMechanicChange: (mechanicId: string) => void;
  receivedAmount: number;
  onReceivedAmountChange: (amount: number) => void;
  autoSave?: boolean;
}

const SelectedServicesList = ({ 
  selectedServices, 
  mechanics,
  onRemoveService,
  onCompleteCheckout,
  selectedMechanicId,
  onMechanicChange,
  receivedAmount,
  onReceivedAmountChange,
  autoSave = false
}: SelectedServicesListProps) => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    setCurrentDate(`${day}/${month}`);

    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
    setTotalAmount(total);
    setRemainingAmount(total - receivedAmount);
  }, [selectedServices, receivedAmount]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onReceivedAmountChange(value);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Selecionados</CardTitle>
        {autoSave && selectedServices.length > 0 && selectedMechanicId && (
          <p className="text-xs text-muted-foreground">
            Os serviços estão sendo salvos automaticamente
          </p>
        )}
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
              <Select value={selectedMechanicId} onValueChange={onMechanicChange}>
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
