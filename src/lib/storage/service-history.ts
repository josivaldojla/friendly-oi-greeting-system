
import { supabase } from "@/integrations/supabase/client";
import { Mechanic, Service } from "../types";

export interface ServiceHistory {
  id: string;
  title: string;
  mechanic_id: string;
  service_data: Service[];
  total_amount: number;
  received_amount: number;
  created_at: string;
  mechanic?: Mechanic; // Relação com o mecânico
}

export async function getServiceHistory(): Promise<ServiceHistory[]> {
  const { data, error } = await supabase
    .from('service_history')
    .select(`
      *,
      mechanics:mechanic_id (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching service history:', error);
    return [];
  }
  
  // Mapeando para o formato correto
  return data.map(item => ({
    id: item.id,
    title: item.title,
    mechanic_id: item.mechanic_id,
    service_data: item.service_data,
    total_amount: Number(item.total_amount),
    received_amount: Number(item.received_amount),
    created_at: item.created_at,
    mechanic: item.mechanics
  }));
}

export async function saveServiceHistory(history: Omit<ServiceHistory, 'id' | 'created_at'>): Promise<ServiceHistory[]> {
  const { error } = await supabase
    .from('service_history')
    .insert([history]);

  if (error) {
    console.error('Error saving service history:', error);
    return [];
  }

  return getServiceHistory();
}

export async function deleteServiceHistory(id: string): Promise<ServiceHistory[]> {
  const { error } = await supabase
    .from('service_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service history:', error);
    return [];
  }

  return getServiceHistory();
}
