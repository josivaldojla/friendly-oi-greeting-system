
import { Service } from "../types";
import { supabase } from "@/integrations/supabase/client";

export async function getServices(): Promise<Service[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return [];
  }

  // Buscar apenas serviços criados pelo usuário atual
  // Não incluir serviços soft-deleted por este usuário
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('created_by', user.id)
    .or('deleted_at.is.null,deleted_by.neq.' + user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  
  console.log('Services fetched from Supabase:', data);
  
  // Mapping to the correct format
  return data.map(item => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    description: item.description || "",
    imageUrl: item.image_url || undefined,
    deleted_at: item.deleted_at || undefined,
    deleted_by: item.deleted_by || undefined
  }));
}

export async function addService(service: Omit<Service, "id">): Promise<Service[]> {
  console.log('Adding service to Supabase:', service);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const serviceData = {
    name: service.name,
    price: service.price,
    description: service.description,
    image_url: service.imageUrl,
    created_by: user?.id
  };
  
  console.log('Formatted service data for Supabase:', serviceData);
  
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select();

  if (error) {
    console.error('Error adding service:', error);
    return [];
  }
  
  console.log('Service added successfully:', data);
  return getServices();
}

export async function updateService(service: Service): Promise<Service[]> {
  console.log('Updating service in Supabase:', service);
  
  const { error } = await supabase
    .from('services')
    .update({
      name: service.name,
      price: service.price,
      description: service.description,
      image_url: service.imageUrl
    })
    .eq('id', service.id);

  if (error) {
    console.error('Error updating service:', error);
    return [];
  }

  console.log('Service updated successfully');
  return getServices();
}

export async function deleteService(id: string): Promise<Service[]> {
  console.log('Deleting service from Supabase, ID:', id);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return [];
  }

  // Soft delete: marcar como deletado por este usuário
  const { error } = await supabase
    .from('services')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: user.id
    })
    .eq('id', id);

  if (error) {
    console.error('Error soft deleting service:', error);
    return [];
  }

  console.log('Service soft deleted successfully');
  return getServices();
}
