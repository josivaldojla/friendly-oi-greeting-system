
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  ServiceRecord, 
  ServicePhoto, 
  Customer, 
  MotorcycleModel, 
  Mechanic,
  PhotoViewMode,
  CustomerSelection
} from "@/lib/types";
import { 
  addServiceRecord, 
  updateServiceRecord, 
  addServicePhoto, 
  getServicePhotos,
  deleteServicePhoto,
  updateServicePhoto,
  deleteStoragePhoto,
  getMotorcycleModelById,
  getCustomerById,
  getMechanics
} from "@/lib/storage";
import { CustomerSelect } from "../services/components/CustomerSelect";
import { MotorcycleModelSelect } from "../services/components/MotorcycleModelSelect";
import { PhotoUploader } from "./PhotoUploader";
import { PhotoGallery } from "./PhotoGallery";
import { Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ServiceRecordFormProps {
  serviceRecord?: ServiceRecord;
}

export const ServiceRecordForm: React.FC<ServiceRecordFormProps> = ({ serviceRecord }) => {
  const navigate = useNavigate();
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
  const [loading, setLoading] = useState(false);
  
  // Photos state
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);
  const [viewMode, setViewMode] = useState<PhotoViewMode>('grid');
  
  // New state for model and customer details
  const [motorcycleModelName, setMotorcycleModelName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [mechanicName, setMechanicName] = useState<string>("");
  
  // Load photos if editing existing record
  useEffect(() => {
    if (isEditing && serviceRecord) {
      loadPhotos(serviceRecord.id);
      
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
    const loadMechanics = async () => {
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
    
    loadMechanics();
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
  
  const loadPhotos = async (serviceId: string) => {
    setLoadingPhotos(true);
    try {
      const photosData = await getServicePhotos(serviceId);
      setPhotos(photosData);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast.error('Erro ao carregar fotos');
    } finally {
      setLoadingPhotos(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Título do serviço é obrigatório');
      return;
    }
    
    setLoading(true);
    try {
      let record: ServiceRecord | null;
      
      if (isEditing && serviceRecord) {
        // Update existing record
        record = await updateServiceRecord({
          id: serviceRecord.id,
          title,
          customer_id: customerSelection.id || null,
          motorcycle_model_id: selectedModel || null,
          mechanic_id: mechanicId === "none" ? null : mechanicId || null,
          notes
        });
        
        if (record) {
          toast.success('Registro de serviço atualizado com sucesso');
          
          // Update local state for model and customer
          if (record.motorcycle_model_id && record.motorcycle_model_id !== serviceRecord.motorcycle_model_id) {
            loadModelDetails(record.motorcycle_model_id);
          }
          
          if (record.customer_id && record.customer_id !== serviceRecord.customer_id) {
            loadCustomerDetails(record.customer_id);
          }
          
          // Atualizar o nome do mecânico se necessário
          if (record.mechanic_id !== serviceRecord.mechanic_id) {
            const mechanic = mechanics.find(m => m.id === record.mechanic_id);
            if (mechanic) {
              setMechanicName(mechanic.name);
            } else {
              setMechanicName("");
            }
          }
        }
      } else {
        // Create new record
        record = await addServiceRecord({
          title,
          customer_id: customerSelection.id || null,
          motorcycle_model_id: selectedModel || null,
          mechanic_id: mechanicId === "none" ? null : mechanicId || null,
          notes,
          status: 'active'
        });
        
        if (record) {
          toast.success('Registro de serviço criado com sucesso');
          // Navigate to edit mode for the new record
          navigate(`/service-records/${record.id}`);
        }
      }
      
      if (!record) {
        toast.error('Erro ao salvar registro de serviço');
      }
    } catch (error) {
      console.error('Error saving service record:', error);
      toast.error('Erro ao salvar registro de serviço');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePhotoUploaded = async (url: string) => {
    if (!serviceRecord) {
      toast.error('Você precisa salvar o registro antes de adicionar fotos');
      return;
    }
    
    try {
      const newPhoto: Omit<ServicePhoto, 'id' | 'created_at'> = {
        service_record_id: serviceRecord.id,
        photo_url: url,
        caption: null,
        notes: null,
        sequence_number: photos.length + 1
      };
      
      const addedPhoto = await addServicePhoto(newPhoto);
      if (addedPhoto) {
        setPhotos([...photos, addedPhoto]);
      } else {
        toast.error('Erro ao adicionar foto ao registro');
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      toast.error('Erro ao adicionar foto ao registro');
    }
  };
  
  const handleDeletePhoto = async (photo: ServicePhoto) => {
    if (confirm('Tem certeza que deseja excluir esta foto?')) {
      try {
        // Delete from database
        const deleted = await deleteServicePhoto(photo.id);
        
        if (deleted) {
          // Delete from storage
          await deleteStoragePhoto(photo.photo_url);
          
          // Update UI
          setPhotos(photos.filter(p => p.id !== photo.id));
          toast.success('Foto excluída com sucesso');
        } else {
          toast.error('Erro ao excluir foto');
        }
      } catch (error) {
        console.error('Error deleting photo:', error);
        toast.error('Erro ao excluir foto');
      }
    }
  };
  
  const handleUpdatePhoto = (updatedPhoto: ServicePhoto) => {
    setPhotos(photos.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };
  
  // Função para obter o nome do mecânico atual
  const getCurrentMechanicName = (): string => {
    if (!mechanicId || mechanicId === "none") return "Não definido";
    
    const mechanic = mechanics.find(m => m.id === mechanicId);
    return mechanic ? mechanic.name : "Desconhecido";
  };
  
  // Updated handleShareOnWhatsApp function to use actual names instead of IDs
  const handleShareOnWhatsApp = () => {
    if (!serviceRecord) return;
    
    // Create message with all details
    let message = `*${title || "Registro de Serviço"}*\n\n`;
    
    if (customerName) {
      message += `*Cliente:* ${customerName}\n`;
    } else if (customerSelection.name) {
      message += `*Cliente:* ${customerSelection.name}\n`;
    }
    
    // Use the actual model name instead of ID
    if (motorcycleModelName) {
      message += `*Modelo da moto:* ${motorcycleModelName}\n`;
    }
    
    // Adicionar nome do mecânico
    message += `*Mecânico:* ${getCurrentMechanicName()}\n`;
    
    if (notes) {
      message += `\n*Observações:*\n${notes}\n\n`;
    }
    
    message += `*Fotos anexadas:* ${photos.length}\n`;
    
    // Add photo details - improved format
    photos.forEach((photo, index) => {
      message += `\n*Foto ${index + 1}:*\n`;
      if (photo.caption) {
        message += `${photo.caption}\n`;
      }
      if (photo.notes) {
        message += `${photo.notes}\n`;
      }
    });
    
    // Create WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    
    // Open in a new tab
    window.open(whatsappUrl, '_blank');
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
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
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
                setSelectedModel={(modelId) => {
                  setSelectedModel(modelId);
                  // Atualizar nome do modelo quando mudar
                  if (modelId) {
                    loadModelDetails(modelId);
                  } else {
                    setMotorcycleModelName("");
                  }
                }}
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
          </CardContent>
        </Card>
      </form>

      {isEditing && serviceRecord && (
        <>
          <Separator />
          
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-lg font-medium">Fotos do Serviço</h3>
              
              <PhotoUploader 
                serviceId={serviceRecord.id} 
                onPhotoUploaded={handlePhotoUploaded}
              />
              
              {loadingPhotos ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Carregando fotos...</p>
                </div>
              ) : (
                <PhotoGallery
                  photos={photos}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onDeletePhoto={handleDeletePhoto}
                  onUpdatePhoto={handleUpdatePhoto}
                />
              )}
              
              {photos.length > 0 && (
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleShareOnWhatsApp}
                    className="w-full"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar Registro no WhatsApp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
