
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomerSelection } from "@/lib/types";
import { CustomerSelect } from "@/components/services/components/CustomerSelect";
import { MotorcycleModelSelect } from "@/components/services/components/MotorcycleModelSelect";
import { Mechanic, ServiceRecord } from "@/lib/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { getCustomerById, getMechanics, getMotorcycleModelById } from "@/lib/storage";

interface ServiceRecordFormMainProps {
  serviceRecord?: ServiceRecord;
  onSave: (formData: ServiceRecordFormData) => Promise<void>;
  loading: boolean;
}

export interface ServiceRecordFormData {
  title: string;
  customerSelection: CustomerSelection;
  selectedModel: string;
  mechanicId: string;
  notes: string;
}

export const ServiceRecordFormMain: React.FC<ServiceRecordFormMainProps> = ({
  serviceRecord,
  onSave,
  loading
}) => {
  const isEditing = !!serviceRecord;
  
  // Form state
  const [title, setTitle] = useState(serviceRecord?.title || "");
  const [customerSelection, setCustomerSelection] = useState<CustomerSelection>({ 
    id: serviceRecord?.customer_id || undefined, 
    name: "", 
    isNew: false 
  });
  const [selectedModel, setSelectedModel] = useState(serviceRecord?.motorcycle_model_id || "");
  const [mechanicId, setMechanicId] = useState(serviceRecord?.mechanic_id || "");
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [notes, setNotes] = useState(serviceRecord?.notes || "");
  
  // For model and customer details
  const [motorcycleModelName, setMotorcycleModelName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [mechanicName, setMechanicName] = useState<string>("");
  
  // Load mechanics and details if editing
  useEffect(() => {
    if (isEditing && serviceRecord) {
      // Load motorcycle model name
      if (serviceRecord.motorcycle_model_id) {
        loadModelDetails(serviceRecord.motorcycle_model_id);
      }
      
      // Load customer name
      if (serviceRecord.customer_id) {
        loadCustomerDetails(serviceRecord.customer_id);
      }
    }
    
    // Load mechanics
    const loadMechanicsData = async () => {
      try {
        const mechanicsData = await getMechanics();
        setMechanics(mechanicsData);
        
        // Se houver um mecânico selecionado, encontre o nome dele
        if (serviceRecord?.mechanic_id) {
          const mechanic = mechanicsData.find(m => m.id === serviceRecord.mechanic_id);
          if (mechanic) {
            setMechanicName(mechanic.name);
          }
        }
      } catch (error) {
        console.error('Error loading mechanics:', error);
      }
    };
    
    loadMechanicsData();
  }, [isEditing, serviceRecord]);
  
  // Load model details
  const loadModelDetails = async (modelId: string) => {
    try {
      const modelData = await getMotorcycleModelById(modelId);
      if (modelData) {
        setMotorcycleModelName(modelData.name);
      }
    } catch (error) {
      console.error('Error loading motorcycle model details:', error);
    }
  };
  
  // Load customer details
  const loadCustomerDetails = async (customerId: string) => {
    try {
      const customerData = await getCustomerById(customerId);
      if (customerData) {
        setCustomerName(customerData.name);
      }
    } catch (error) {
      console.error('Error loading customer details:', error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Título do serviço é obrigatório');
      return;
    }
    
    await onSave({
      title,
      customerSelection,
      selectedModel,
      mechanicId,
      notes
    });
  };
  
  // Handler for mechanic selection changes
  const handleMechanicChange = (value: string) => {
    setMechanicId(value);
    
    // Atualizar o nome do mecânico
    if (value === "none") {
      setMechanicName("");
    } else {
      const mechanic = mechanics.find(m => m.id === value);
      if (mechanic) {
        setMechanicName(mechanic.name);
      }
    }
  };
  
  // Function to handle model selection with name update
  const handleModelSelection = (modelId: string) => {
    setSelectedModel(modelId);
    // Atualizar nome do modelo quando mudar
    if (modelId) {
      loadModelDetails(modelId);
    } else {
      setMotorcycleModelName("");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Serviço</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Troca de óleo e filtros"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomerSelect 
          customerSelection={customerSelection}
          setCustomerSelection={setCustomerSelection}
        />
        
        <MotorcycleModelSelect 
          selectedModel={selectedModel}
          setSelectedModel={handleModelSelection}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mechanic">Mecânico Responsável</Label>
        <Select 
          value={mechanicId || undefined}
          onValueChange={handleMechanicChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um mecânico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum</SelectItem>
            {mechanics.map((mechanic) => (
              <SelectItem key={mechanic.id} value={mechanic.id}>
                {mechanic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Observações Gerais</Label>
        <Textarea
          id="notes"
          value={notes || ""}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações adicionais sobre o serviço"
          rows={4}
        />
      </div>
      
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : isEditing ? 'Atualizar Registro' : 'Criar Registro'}
        </Button>
      </div>
    </form>
  );
};
