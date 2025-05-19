
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
  
  // Mapeando para o formato correto e convertendo service_data de volta para Service[]
  return data.map(item => ({
    id: item.id,
    title: item.title,
    mechanic_id: item.mechanic_id,
    service_data: Array.isArray(item.service_data) ? item.service_data as Service[] : [],
    total_amount: Number(item.total_amount),
    received_amount: Number(item.received_amount),
    created_at: item.created_at,
    mechanic: item.mechanics
  }));
}

export async function saveServiceHistory(history: Omit<ServiceHistory, 'id' | 'created_at'>): Promise<ServiceHistory[]> {
  // We need to ensure that service_data is JSONB compatible
  const serviceData = JSON.parse(JSON.stringify(history.service_data));
  
  const { error } = await supabase
    .from('service_history')
    .insert({
      title: history.title,
      mechanic_id: history.mechanic_id,
      service_data: serviceData,
      total_amount: history.total_amount,
      received_amount: history.received_amount
    });

  if (error) {
    console.error('Error saving service history:', error);
    return [];
  }

  return getServiceHistory();
}

export async function updateServiceHistory(
  id: string, 
  history: Pick<ServiceHistory, 'service_data' | 'total_amount' | 'received_amount'>
): Promise<ServiceHistory[]> {
  // We need to ensure that service_data is JSONB compatible
  const serviceData = JSON.parse(JSON.stringify(history.service_data));
  
  const { error } = await supabase
    .from('service_history')
    .update({
      service_data: serviceData,
      total_amount: history.total_amount,
      received_amount: history.received_amount
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating service history:', error);
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

// Função para buscar o histórico de serviço mais recente para um mecânico específico
export async function getLatestServiceHistoryByMechanicId(mechanicId: string): Promise<ServiceHistory | null> {
  const { data, error } = await supabase
    .from('service_history')
    .select(`
      *,
      mechanics:mechanic_id (*)
    `)
    .eq('mechanic_id', mechanicId)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) {
    if (error) console.error('Error fetching latest service history:', error);
    return null;
  }
  
  const item = data[0];
  return {
    id: item.id,
    title: item.title,
    mechanic_id: item.mechanic_id,
    service_data: Array.isArray(item.service_data) ? item.service_data as Service[] : [],
    total_amount: Number(item.total_amount),
    received_amount: Number(item.received_amount),
    created_at: item.created_at,
    mechanic: item.mechanics
  };
}
