
import { Customer } from "../types";
import { supabase } from "@/integrations/supabase/client";

export async function getCustomers(): Promise<Customer[]> {
  try {
    // Check if the table exists using SQL directly
    const { data: tableExists } = await supabase
      .rpc('table_exists', { table_name: 'customers' })
      .single();
    
    if (!tableExists) {
      // If the table doesn't exist, create it
      await supabase.rpc('create_customers_table');
      return [];
    }

    // Query using SQL directly to avoid type errors
    const { data, error } = await supabase
      .rpc('get_all_customers');

    if (error) {
      console.error('Error fetching customers:', error);
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
    console.error('Error accessing customers table:', error);
    return [];
  }
}

export async function addCustomer(customer: Omit<Customer, "id">): Promise<Customer[]> {
  if (!customer.name) {
    throw new Error("Customer name is required");
  }
  
  try {
    // Insert using SQL directly
    const { error } = await supabase
      .rpc('add_customer', { 
        p_name: customer.name, 
        p_phone: customer.phone || null, 
        p_email: customer.email || null, 
        p_address: customer.address || null 
      });

    if (error) {
      console.error('Error adding customer:', error);
      return [];
    }

    return getCustomers();
  } catch (error) {
    console.error('Error in addCustomer:', error);
    return [];
  }
}

export async function updateCustomer(customer: Customer): Promise<Customer[]> {
  if (!customer.name) {
    throw new Error("Customer name is required");
  }
  
  try {
    // Update using SQL directly
    const { error } = await supabase
      .rpc('update_customer', { 
        p_id: customer.id,
        p_name: customer.name, 
        p_phone: customer.phone || null, 
        p_email: customer.email || null, 
        p_address: customer.address || null 
      });

    if (error) {
      console.error('Error updating customer:', error);
      return [];
    }

    return getCustomers();
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    return [];
  }
}

export async function deleteCustomer(id: string): Promise<Customer[]> {
  try {
    // Delete using SQL directly
    const { error } = await supabase
      .rpc('delete_customer', { p_id: id });

    if (error) {
      console.error('Error deleting customer:', error);
      return [];
    }

    return getCustomers();
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    return [];
  }
}
