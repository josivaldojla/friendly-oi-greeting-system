import { useState, useEffect } from "react";
import { Service, Mechanic } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Send } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { addCompletedService } from "@/lib/storage";

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
    setReceivedAmount(value);
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

    const message = formatWhatsAppMessage(mechanic.name, selectedServices, totalAmount, receivedAmount, remainingAmount);
    
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

  const formatWhatsAppMessage = (mechanicName: string, services: Service[], total: number, received: number, remaining: number) => {
    let message = `SERVIÇOS DO DIA ${currentDate}\n\n`;
    message += "--------------------------------------------------\n\n";
    
    services.forEach((service, index) => {
      message += `*${index + 1}-* ${service.name} = *R$ ${formatPrice(service.price).replace('R$ ', '')}*\n\n`;
    });

    message += "--------------------------------------------------\n";
    message += `Total...........*R$ ${formatPrice(total).replace('R$ ', '')}*\n`;
    message += `Adiantado...*R$ ${formatPrice(received).replace('R$ ', '')}*\n`;
    message += `Total Geral..*R$ ${formatPrice(remaining).replace('R$ ', '')}*`;

    return message;
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
              <li key={`${service.id}-${index}`} className="py-2 flex justify-between items-center">
                <span>{service.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{formatPrice(service.price)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveService(service.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Nenhum serviço selecionado.
          </p>
        )}

        {selectedServices.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
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

            <div className="flex justify-between items-center font-medium">
              <span>Total:</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>

            <div>
              <Label htmlFor="received">Valor Recebido</Label>
              <Input
                id="received"
                type="number"
                min="0"
                step="0.01"
                value={receivedAmount || ''}
                onChange={handleReceivedAmountChange}
              />
            </div>

            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total a Pagar:</span>
              <span className={remainingAmount < 0 ? "text-green-600" : remainingAmount > 0 ? "text-red-600" : ""}>
                {formatPrice(remainingAmount)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
      {selectedServices.length > 0 && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleSendWhatsApp}
            disabled={!selectedServices.length}
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
