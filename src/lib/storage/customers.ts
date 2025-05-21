
import { Customer } from "../types";
import { supabase } from "@/integrations/supabase/client";

// Função para buscar um cliente pelo ID
export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      phone: data.phone || undefined,
      email: data.email || undefined,
      address: data.address || undefined
    };
  } catch (error) {
    console.error('Erro ao acessar cliente específico:', error);
    return null;
  }
}
