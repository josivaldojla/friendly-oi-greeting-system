
export interface Mechanic {
  id: string;
  name: string;
  specialization?: string;
  phone?: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  comment?: string;
}

export interface CompletedService {
  id: string;
  mechanicId: string;
  serviceIds: string[];
  totalAmount: number;
  receivedAmount: number;
  completionDate: string; // ISO string
  createdAt: string; // ISO string
}

export type ViewMode = 'list' | 'grid';

export interface MotorcycleModel {
  id: string;
  name: string;
  brand?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

// Updated interface for customer selection
export interface CustomerSelection {
  id?: string;  // ID for existing customer
  name: string; // Customer name
  isNew?: boolean; // Flag for new customers
}

// Keep the rest of the types
export interface ServiceHistory {
  id: string;
  title: string;
  mechanic_id: string;
  service_data: Service[];
  total_amount: number;
  received_amount: number;
  created_at: string;
  mechanic?: Mechanic; // Relation to mechanic
}

export interface ServiceRecord {
  id: string;
  title: string;
  customer_id: string | null;
  motorcycle_model_id: string | null;
  mechanic_id: string | null;
  created_at: string;
  updated_at: string;
  notes: string | null;
  status: string;
  // Add relations for better TypeScript support
  customers?: Customer;
  motorcycle_models?: MotorcycleModel;
  mechanics?: Mechanic;
}

export interface ServicePhoto {
  id: string;
  service_record_id: string;
  photo_url: string;
  caption: string | null;
  notes: string | null;
  sequence_number: number;
  created_at: string;
}

export type PhotoViewMode = 'grid' | 'list';
