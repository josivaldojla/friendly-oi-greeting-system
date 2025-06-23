
import { supabase } from "@/integrations/supabase/client";

export async function getDailyEarnings(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Os dados já vêm filtrados pelo RLS - usuários comuns só veem seus dados
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
  
  // Os dados já vêm filtrados pelo RLS - usuários comuns só veem seus dados
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
  
  // Os dados já vêm filtrados pelo RLS - usuários comuns só veem seus dados
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
