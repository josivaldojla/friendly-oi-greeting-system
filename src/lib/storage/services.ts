
import { Service } from "../types";
import { supabase } from "@/integrations/supabase/client";

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
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
    imageUrl: item.image_url || undefined
  }));
}

export async function addService(service: Omit<Service, "id">): Promise<Service[]> {
  console.log('Adding service to Supabase:', service);
  
  const serviceData = {
    name: service.name,
    price: service.price,
    description: service.description,
    image_url: service.imageUrl
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
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    return [];
  }

  console.log('Service deleted successfully');
  return getServices();
}
