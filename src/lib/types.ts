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

// Adicionando nova interface para indicar o tipo de cliente
export interface CustomerSelection {
  id?: string;  // ID se for cliente existente
  name: string; // Nome do cliente (existente ou novo)
  isNew?: boolean; // Indica se é um novo cliente
}

// Nova interface para histórico de serviços
export interface ServiceHistory {
  id: string;
  title: string;
  mechanic_id: string;
  service_data: Service[];
  total_amount: number;
  received_amount: number;
  created_at: string;
  mechanic?: Mechanic; // Relação com o mecânico
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
