import { Mechanic, Service, CompletedService, Customer } from "./types";
import { supabase } from "@/integrations/supabase/client";

// Função para converter arquivo para base64
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

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
  
  // Mapeando para o formato correto
  return data.map(item => ({
    id: item.id,
    name: item.name,
    specialization: item.specialization || undefined,
    phone: item.phone || undefined
  }));
}

export async function addMechanic(mechanic: Omit<Mechanic, "id">): Promise<Mechanic[]> {
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
  
  console.log('Services fetched from Supabase:', data);
  
  // Mapeando para o formato correto
  return data.map(item => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    description: item.description || "",
    imageUrl: item.image_url || undefined
  }));
}

export async function addService(service: Omit<Service, "id">): Promise<Service[]> {
  console.log('Adding service to Supabase:', service);
  
  const serviceData = {
    name: service.name,
    price: service.price,
    description: service.description,
    image_url: service.imageUrl
  };
  
  console.log('Formatted service data for Supabase:', serviceData);
  
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select();

  if (error) {
    console.error('Error adding service:', error);
    return [];
  }
  
  console.log('Service added successfully:', data);
  return getServices();
}

export async function updateService(service: Service): Promise<Service[]> {
  console.log('Updating service in Supabase:', service);
  
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

  console.log('Service updated successfully');
  return getServices();
}

export async function deleteService(id: string): Promise<Service[]> {
  console.log('Deleting service from Supabase, ID:', id);
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    return [];
  }

  console.log('Service deleted successfully');
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
  
  // Mapeando para o formato correto
  return data.map(item => ({
    id: item.id,
    mechanicId: item.mechanic_id || "",
    serviceIds: item.service_ids,
    totalAmount: Number(item.total_amount),
    receivedAmount: Number(item.received_amount),
    completionDate: item.completion_date,
    createdAt: item.created_at
  }));
}

export async function addCompletedService(completedService: Omit<CompletedService, "id">): Promise<CompletedService[]> {
  const { error } = await supabase
    .from('completed_services')
    .insert([{
      mechanic_id: completedService.mechanicId,
      service_ids: completedService.serviceIds,
      total_amount: completedService.totalAmount,
      received_amount: completedService.receivedAmount,
      completion_date: completedService.completionDate,
      created_at: completedService.createdAt
    }]);

  if (error) {
    console.error('Error adding completed service:', error);
    return [];
  }

  return getCompletedServices();
}

// Customers
export async function getCustomers(): Promise<Customer[]> {
  try {
    // Verifica se a tabela customers existe no esquema
    const { data: exists } = await supabase
      .from('customers')
      .select('id')
      .limit(1)
      .single();

    if (!exists) {
      console.warn('A tabela "customers" não existe no banco de dados.');
      return [];
    }

    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
    
    // Mapeando para o formato correto
    return data.map(item => ({
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
    const { error } = await supabase
      .from('customers')
      .insert([{
        name: customer.name,
        phone: customer.phone || null,
        email: customer.email || null,
        address: customer.address || null
      }]);

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
    const { error } = await supabase
      .from('customers')
      .update({
        name: customer.name,
        phone: customer.phone || null,
        email: customer.email || null,
        address: customer.address || null
      })
      .eq('id', customer.id);

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
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

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
