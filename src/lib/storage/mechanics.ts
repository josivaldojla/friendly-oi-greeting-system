
import { Mechanic } from "../types";
import { supabase } from "@/integrations/supabase/client";

export async function getMechanics(): Promise<Mechanic[]> {
  // Os dados já vêm filtrados pelo RLS - usuários comuns só veem seus dados
  const { data, error } = await supabase
    .from('mechanics')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching mechanics:', error);
    return [];
  }
  
  // Mapping to the correct format
  return data.map(item => ({
    id: item.id,
    name: item.name,
    specialization: item.specialization || undefined,
    phone: item.phone || undefined
  }));
}

export async function addMechanic(mechanic: Omit<Mechanic, "id">): Promise<Mechanic[]> {
  // created_by será definido automaticamente pelo trigger
  const { error } = await supabase
    .from('mechanics')
    .insert([mechanic]);

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
