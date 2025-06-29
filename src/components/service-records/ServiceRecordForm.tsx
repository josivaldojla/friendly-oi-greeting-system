
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ServiceRecord, ServicePhoto } from "@/lib/types";
import { addServiceRecord, updateServiceRecord, getMechanics, getServicePhotos, deleteServicePhoto } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
import { ServiceRecordFormMain, ServiceRecordFormData } from "./form/ServiceRecordFormMain";
import { ServiceRecordPhotoSection } from "./form/ServiceRecordPhotoSection";

interface ServiceRecordFormProps {
  serviceRecord?: ServiceRecord;
}

export const ServiceRecordForm: React.FC<ServiceRecordFormProps> = ({ serviceRecord }) => {
  const navigate = useNavigate();
  const isEditing = !!serviceRecord;
  const [loading, setLoading] = useState(false);
  const [mechanicName, setMechanicName] = useState<string>("");
  const [photos, setPhotos] = useState<ServicePhoto[]>([]);

  // Load photos when editing
  useEffect(() => {
    if (isEditing && serviceRecord) {
      loadPhotos();
    }
  }, [isEditing, serviceRecord]);

  const loadPhotos = async () => {
    if (!serviceRecord) return;
    
    try {
      const photosData = await getServicePhotos(serviceRecord.id);
      setPhotos(photosData);
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const handleSave = async (formData: ServiceRecordFormData) => {
    const { title, customerSelection, selectedModel, mechanicId, notes } = formData;
    
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
          
          // Update mechanic name if needed
          if (record.mechanic_id !== serviceRecord.mechanic_id) {
            updateMechanicName(record.mechanic_id);
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

  // Update mechanic name when mechanic ID changes
  const updateMechanicName = async (mechanicId: string | null) => {
    if (!mechanicId) {
      setMechanicName("");
      return;
    }
    
    try {
      const mechanics = await getMechanics();
      const mechanic = mechanics.find(m => m.id === mechanicId);
      if (mechanic) {
        setMechanicName(mechanic.name);
      }
    } catch (error) {
      console.error('Error updating mechanic name:', error);
    }
  };

  const handlePhotosChange = (newPhotos: ServicePhoto[]) => {
    setPhotos(newPhotos);
  };

  const handlePhotoDelete = async (photo: ServicePhoto) => {
    try {
      const success = await deleteServicePhoto(photo.id);
      if (success) {
        setPhotos(photos.filter(p => p.id !== photo.id));
        toast.success('Foto deletada com sucesso');
      } else {
        toast.error('Erro ao deletar foto');
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Erro ao deletar foto');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <ServiceRecordFormMain 
            serviceRecord={serviceRecord}
            onSave={handleSave}
            loading={loading}
          />
        </CardContent>
      </Card>

      {isEditing && serviceRecord && (
        <>
          <Separator />
          <ServiceRecordPhotoSection 
            serviceRecordId={serviceRecord.id}
            photos={photos}
            onPhotosChange={handlePhotosChange}
            mechanicName={mechanicName}
          />
        </>
      )}
    </div>
  );
};
