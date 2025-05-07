
import { Customer } from "../types";
import { supabase } from "@/integrations/supabase/client";

export async function getCustomers(): Promise<Customer[]> {
  try {
    // Check if the table exists using SQL directly
    const { data: tableExists, error: tableCheckError } = await supabase
      .rpc('table_exists', { table_name: 'customers' })
      .single();
    
    if (tableCheckError) {
      console.error('Error checking if table exists:', tableCheckError);
      return [];
    }
    
    if (!tableExists) {
      // If the table doesn't exist, create it
      const { error: createError } = await supabase.rpc('create_customers_table');
      if (createError) {
        console.error('Error creating customers table:', createError);
      }
      return [];
    }

    // Query using SQL directly
    const { data, error } = await supabase
      .rpc('get_all_customers');

    if (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
    
    console.log('Fetched customers from DB:', data);
    
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
    console.log('Adding customer:', customer);
    
    // Insert using SQL directly
    const { data, error } = await supabase
      .from('customers')
      .insert([{ 
        name: customer.name, 
        phone: customer.phone || null, 
        email: customer.email || null, 
        address: customer.address || null 
      }]);

    if (error) {
      console.error('Error adding customer:', error);
      throw error;
    }

    // Return updated list of customers
    return getCustomers();
  } catch (error) {
    console.error('Error in addCustomer:', error);
    throw error;
  }
}

export async function updateCustomer(customer: Customer): Promise<Customer[]> {
  if (!customer.name) {
    throw new Error("Customer name is required");
  }
  
  try {
    console.log('Updating customer:', customer);
    
    // Update using SQL directly
    const { data, error } = await supabase
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
      console.error('Error updating customer:', error);
      throw error;
    }

    // Return updated list of customers
    return getCustomers();
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    throw error;
  }
}

export async function deleteCustomer(id: string): Promise<Customer[]> {
  try {
    console.log('Deleting customer with ID:', id);
    
    // Delete using SQL directly
    const { data, error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }

    // Return updated list of customers
    return getCustomers();
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    throw error;
  }
}
