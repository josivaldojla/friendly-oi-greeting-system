
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
