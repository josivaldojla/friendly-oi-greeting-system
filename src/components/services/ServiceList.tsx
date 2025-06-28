import React, { useState } from 'react';
import { Service } from '@/lib/types';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Button } from '@/components/ui/button';
import ServiceForm from '@/components/services/ServiceForm';
import { ServiceListItem } from '@/components/services/ServiceListItem';

interface ServiceListProps {
  services: Service[];
  onAddToSelection?: (service: Service, comment?: string) => void;
  viewMode: 'list' | 'grid';
  // Props opcionais para quando usado na página de serviços
  onAddService?: (service: Omit<Service, "id">) => Promise<void>;
  onUpdateService?: (service: Service) => Promise<void>;
  onDeleteService?: (id: string) => Promise<void>;
  onViewModeChange?: (mode: 'list' | 'grid') => void;
  // Props para controlar comportamento no checkout
  showAddButton?: boolean;
  hideHeading?: boolean;
  selectable?: boolean;
}

const ServiceList = ({ 
  services, 
  onAddToSelection = () => {}, 
  viewMode,
  onAddService,
  onUpdateService,
  onDeleteService,
  onViewModeChange,
  showAddButton = false,
  hideHeading = false,
  selectable = false
}: ServiceListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleAddService = async (newService: Service) => {
    if (onAddService) {
      await onAddService(newService);
    }
    setShowForm(false);
  };

  const handleUpdateService = async (updatedService: Service) => {
    if (onUpdateService) {
      await onUpdateService(updatedService);
    }
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleDelete = (id: string) => {
    if (onDeleteService) {
      onDeleteService(id);
    }
  };

  if (showForm) {
    return (
      <ServiceForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleAddService}
      />
    );
  }

  if (editingService) {
    return (
      <ServiceForm
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
        service={editingService}
        onSubmit={handleUpdateService}
      />
    );
  }

  return (
    <div className="space-y-4">
      {!hideHeading && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Serviços Disponíveis</h3>
          {onAddService && (
            <Button onClick={() => setShowForm(true)}>
              Adicionar Serviço
            </Button>
          )}
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              selectable={selectable}
              onAddToSelection={onAddToSelection}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatPrice={formatPrice}
              showAddButton={showAddButton}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {services.map((service) => (
            <ServiceListItem
              key={service.id}
              service={service}
              selectable={selectable}
              onAddToSelection={onAddToSelection}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatPrice={formatPrice}
              showAddButton={showAddButton}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
