
import React, { useState } from 'react';
import { Service } from '@/lib/types';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Button } from '@/components/ui/button';
import ServiceForm from '@/components/services/ServiceForm';
import { ServiceListItem } from '@/components/services/ServiceListItem';

interface ServiceListProps {
  services: Service[];
  onAddToSelection: (service: Service, comment?: string) => void;
  viewMode: 'list' | 'grid';
}

const ServiceList = ({ services, onAddToSelection, viewMode }: ServiceListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleAddService = async (newService: Service) => {
    // Logic to add service would go here
    setShowForm(false);
  };

  const handleUpdateService = async (updatedService: Service) => {
    // Logic to update service would go here
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleDelete = (id: string) => {
    // Logic to delete service would go here
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Serviços Disponíveis</h3>
        <Button onClick={() => setShowForm(true)}>
          Adicionar Serviço
        </Button>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onAddToSelection={onAddToSelection}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {services.map((service) => (
            <ServiceListItem
              key={service.id}
              service={service}
              onAddToSelection={onAddToSelection}
              onEdit={handleEdit}
              onDelete={handleDelete}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceList;
