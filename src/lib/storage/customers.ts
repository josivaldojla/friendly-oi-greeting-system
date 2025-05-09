
import { Customer } from "../types";
import { supabase } from "@/integrations/supabase/client";

export async function getCustomers(): Promise<Customer[]> {
  try {
    // Verificar se a tabela existe
    const { data: existingTables, error: tableCheckError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'customers');
      
    if (tableCheckError) {
      console.error('Erro ao verificar se a tabela existe:', tableCheckError);
      return [];
    }
    
    // Se a tabela não existir, criá-la
    if (!existingTables || existingTables.length === 0) {
      // Criar tabela de clientes
      const { error: createTableError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.customers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Enable full access to all users" ON public.customers;
        
        CREATE POLICY "Enable full access to all users" 
          ON public.customers 
          USING (true) 
          WITH CHECK (true);
      `);
      
      if (createTableError) {
        console.error('Erro ao criar tabela de clientes:', createTableError);
      }
      
      return [];
    }
    
    // Buscar todos os clientes
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');
      
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
    
    // Verificar se a tabela existe
    const { data: existingTables } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .eq('tablename', 'customers');
      
    // Se a tabela não existir, criá-la
    if (!existingTables || existingTables.length === 0) {
      await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.customers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Enable full access to all users" ON public.customers;
        
        CREATE POLICY "Enable full access to all users" 
          ON public.customers 
          USING (true) 
          WITH CHECK (true);
      `);
    }
    
    // Inserir cliente
    const { error } = await supabase
      .from('customers')
      .insert([
        {
          name: customer.name,
          phone: customer.phone || null,
          email: customer.email || null,
          address: customer.address || null
        }
      ]);

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
    
    // Atualizar cliente
    const { error } = await supabase
      .from('customers')
      .update({
        name: customer.name,
        phone: customer.phone || null,
        email: customer.email || null,
        address: customer.address || null,
        updated_at: new Date()
      })
      .eq('id', customer.id);

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
    
    // Excluir cliente
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

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
