
import { Mechanic, Service, CompletedService } from "./types";
import { supabase } from "@/integrations/supabase/client";

// Mechanics
export async function getMechanics(): Promise<Mechanic[]> {
  const { data, error } = await supabase
    .from('mechanics')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching mechanics:', error);
    return [];
  }
  return data || [];
}

export async function addMechanic(mechanic: Omit<Mechanic, "id">): Promise<Mechanic[]> {
  const { data, error } = await supabase
    .from('mechanics')
    .insert([mechanic])
    .select();

  if (error) {
    console.error('Error adding mechanic:', error);
    return [];
  }

  return getMechanics();
}

export async function updateMechanic(mechanic: Mechanic): Promise<Mechanic[]> {
  const { error } = await supabase
    .from('mechanics')
    .update(mechanic)
    .eq('id', mechanic.id);

  if (error) {
    console.error('Error updating mechanic:', error);
    return [];
  }

  return getMechanics();
}

export async function deleteMechanic(id: string): Promise<Mechanic[]> {
  const { error } = await supabase
    .from('mechanics')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting mechanic:', error);
    return [];
  }

  return getMechanics();
}

// Services
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  return data || [];
}

export async function addService(service: Omit<Service, "id">): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .insert([{
      name: service.name,
      price: service.price,
      description: service.description,
      image_url: service.imageUrl
    }])
    .select();

  if (error) {
    console.error('Error adding service:', error);
    return [];
  }

  return getServices();
}

export async function updateService(service: Service): Promise<Service[]> {
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

  return getServices();
}

export async function deleteService(id: string): Promise<Service[]> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    return [];
  }

  return getServices();
}

// Completed Services
export async function getCompletedServices(): Promise<CompletedService[]> {
  const { data, error } = await supabase
    .from('completed_services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching completed services:', error);
    return [];
  }
  return data || [];
}

export async function addCompletedService(completedService: Omit<CompletedService, "id">): Promise<CompletedService[]> {
  const { error } = await supabase
    .from('completed_services')
    .insert([completedService])
    .select();

  if (error) {
    console.error('Error adding completed service:', error);
    return [];
  }

  return getCompletedServices();
}

// Utility functions for reports
export async function getDailyEarnings(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('completed_services')
    .select('total_amount')
    .gte('completion_date', today.toISOString());

  if (error || !data) {
    console.error('Error fetching daily earnings:', error);
    return 0;
  }

  return data.reduce((sum, service) => sum + Number(service.total_amount), 0);
}

export async function getWeeklyEarnings(): Promise<number> {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const { data, error } = await supabase
    .from('completed_services')
    .select('total_amount')
    .gte('completion_date', startOfWeek.toISOString());

  if (error || !data) {
    console.error('Error fetching weekly earnings:', error);
    return 0;
  }

  return data.reduce((sum, service) => sum + Number(service.total_amount), 0);
}

export async function getMonthlyEarnings(): Promise<number> {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const { data, error } = await supabase
    .from('completed_services')
    .select('total_amount')
    .gte('completion_date', startOfMonth.toISOString());

  if (error || !data) {
    console.error('Error fetching monthly earnings:', error);
    return 0;
  }

  return data.reduce((sum, service) => sum + Number(service.total_amount), 0);
}

export async function getDailyAverage(): Promise<number> {
  const monthlyEarnings = await getMonthlyEarnings();
  const today = new Date();
  const currentDay = today.getDate();
  
  return monthlyEarnings / currentDay;
}
