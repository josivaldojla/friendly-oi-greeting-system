
import { Customer } from "../types";
import { supabase } from "@/integrations/supabase/client";

export async function getCustomers(): Promise<Customer[]> {
  try {
    // Verificar se a tabela existe usando information_schema ao invés de pg_tables
    const { data: existingTables, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'customers') as any;
      
    if (tableCheckError) {
      console.error('Erro ao verificar se a tabela existe:', tableCheckError);
      return [];
    }
    
    // Se a tabela não existir, criá-la usando SQL direto
    if (!existingTables || existingTables.length === 0) {
      // Criar tabela de clientes usando rpc
      const { error: createTableError } = await supabase.rpc('create_customers_table') as any;
      
      if (createTableError) {
        console.error('Erro ao criar tabela de clientes:', createTableError);
      }
      
      return [];
    }
    
    // Buscar todos os clientes
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name') as any;
      
    if (error) {
      console.error('Erro ao buscar clientes:', error);
      return [];
    }
    
    console.log('Clientes obtidos do banco:', data);
    
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

export async function addCustomer(customer: Omit<Customer, "id">): Promise<Customer[]> {
  if (!customer.name) {
    throw new Error("Nome do cliente é obrigatório");
  }
  
  try {
    console.log('Adicionando cliente:', customer);
    
    // Usar diretamente o rpc para adicionar cliente
    const { error } = await supabase.rpc('add_customer', {
      p_name: customer.name,
      p_phone: customer.phone || null,
      p_email: customer.email || null,
      p_address: customer.address || null
    }) as any;

    if (error) {
      console.error('Erro ao adicionar cliente:', error);
      throw error;
    }

    // Retornar lista atualizada de clientes
    return getCustomers();
  } catch (error) {
    console.error('Erro em addCustomer:', error);
    throw error;
  }
}

export async function updateCustomer(customer: Customer): Promise<Customer[]> {
  if (!customer.name) {
    throw new Error("Nome do cliente é obrigatório");
  }
  
  try {
    console.log('Atualizando cliente:', customer);
    
    // Usar diretamente o rpc para atualizar cliente
    const { error } = await supabase.rpc('update_customer', {
      p_id: customer.id,
      p_name: customer.name,
      p_phone: customer.phone || null,
      p_email: customer.email || null,
      p_address: customer.address || null
    }) as any;

    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }

    // Retornar lista atualizada de clientes
    return getCustomers();
  } catch (error) {
    console.error('Erro em updateCustomer:', error);
    throw error;
  }
}

export async function deleteCustomer(id: string): Promise<Customer[]> {
  try {
    console.log('Excluindo cliente com ID:', id);
    
    // Usar diretamente o rpc para excluir cliente
    const { error } = await supabase.rpc('delete_customer', {
      p_id: id
    }) as any;

    if (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }

    // Retornar lista atualizada de clientes
    return getCustomers();
  } catch (error) {
    console.error('Erro em deleteCustomer:', error);
    throw error;
  }
}
