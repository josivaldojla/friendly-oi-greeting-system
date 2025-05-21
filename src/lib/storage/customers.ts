
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

// Função para buscar todos os clientes
export async function getCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
    
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      phone: item.phone || undefined,
      email: item.email || undefined,
      address: item.address || undefined
    }));
  } catch (error) {
    console.error('Erro ao acessar tabela de clientes:', error);
    return [];
  }
}

// Função para adicionar um novo cliente
export async function addCustomer(customer: Omit<Customer, "id">): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([customer])
      .select()
      .maybeSingle();
      
    if (error) {
      console.error('Erro ao adicionar cliente:', error);
      return null;
    }
    
    return data as Customer;
  } catch (error) {
    console.error('Erro ao adicionar cliente:', error);
    return null;
  }
}

// Função para atualizar um cliente existente
export async function updateCustomer(customer: Customer): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address
      })
      .eq('id', customer.id)
      .select()
      .maybeSingle();
      
    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      return null;
    }
    
    return data as Customer;
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return null;
  }
}

// Função para excluir um cliente
export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Erro ao excluir cliente:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return false;
  }
}
