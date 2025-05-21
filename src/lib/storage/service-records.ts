
import { ServiceRecord, ServicePhoto } from "../types";
import { supabase } from "@/integrations/supabase/client";

// Fetch all service records
export async function getServiceRecords(): Promise<ServiceRecord[]> {
  const { data, error } = await supabase
    .from('service_records')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching service records:', error);
    return [];
  }
  
  return data as ServiceRecord[];
}

// Fetch a single service record by ID
export async function getServiceRecordById(id: string): Promise<ServiceRecord | null> {
  const { data, error } = await supabase
    .from('service_records')
    .select(`
      *,
      customers(*),
      motorcycle_models(*),
      mechanics(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching service record:', error);
    return null;
  }
  
  return data as ServiceRecord;
}

// Add a new service record
export async function addServiceRecord(record: Omit<ServiceRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ServiceRecord | null> {
  const { data, error } = await supabase
    .from('service_records')
    .insert([record])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding service record:', error);
    return null;
  }
  
  return data as ServiceRecord;
}

// Update an existing service record
export async function updateServiceRecord(record: Partial<ServiceRecord> & { id: string }): Promise<ServiceRecord | null> {
  const { id, ...updateData } = record;
  
  const { data, error } = await supabase
    .from('service_records')
    .update({
      ...updateData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating service record:', error);
    return null;
  }
  
  return data as ServiceRecord;
}

// Delete a service record
export async function deleteServiceRecord(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('service_records')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service record:', error);
    return false;
  }
  
  return true;
}

// Get all photos for a service record
export async function getServicePhotos(serviceRecordId: string): Promise<ServicePhoto[]> {
  const { data, error } = await supabase
    .from('service_photos')
    .select('*')
    .eq('service_record_id', serviceRecordId)
    .order('sequence_number', { ascending: true });

  if (error) {
    console.error('Error fetching service photos:', error);
    return [];
  }
  
  return data as ServicePhoto[];
}

// Add a new photo to a service record
export async function addServicePhoto(photo: Omit<ServicePhoto, 'id' | 'created_at'>): Promise<ServicePhoto | null> {
  const { data, error } = await supabase
    .from('service_photos')
    .insert([photo])
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding service photo:', error);
    return null;
  }
  
  return data as ServicePhoto;
}

// Update a photo
export async function updateServicePhoto(photo: Partial<ServicePhoto> & { id: string }): Promise<ServicePhoto | null> {
  const { id, ...updateData } = photo;
  
  const { data, error } = await supabase
    .from('service_photos')
    .update(updateData)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating service photo:', error);
    return null;
  }
  
  return data as ServicePhoto;
}

// Delete a photo
export async function deleteServicePhoto(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('service_photos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service photo:', error);
    return false;
  }
  
  return true;
}

// Upload a photo to storage
export async function uploadServicePhoto(file: File, serviceId: string): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${serviceId}/${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;
  
  const { error } = await supabase.storage
    .from('service_photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }
  
  const { data } = supabase.storage
    .from('service_photos')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

// Delete a photo from storage
export async function deleteStoragePhoto(path: string): Promise<boolean> {
  // Extract filename from the URL
  const urlParts = path.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const serviceId = urlParts[urlParts.length - 2];
  const filePath = `${serviceId}/${fileName}`;
  
  const { error } = await supabase.storage
    .from('service_photos')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting file from storage:', error);
    return false;
  }
  
  return true;
}
