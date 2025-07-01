export interface LeadModel {
  id?: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  shopId: string;
  vehicleId?: string;
  city?: string;
  comments?: { texto: string; data: string }[];
}

export interface LeadModelResponse {
  items: any;
}