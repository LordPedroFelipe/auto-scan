export interface LeadModel {
  id?: string;

  // Dados principais
  name: string;
  phone: string;
  email: string;
  notes?: string;

  // Status & contato
  status: 'New' | 'InProgress' | 'Contacted' | 'Won' | 'Lost';
  hasBeenContacted?: boolean;
  contactDate?: string | Date | null;
  lastContactDate?: string | Date | null;

  // Vínculos
  shopId?: string | null;
  shopName?: string | null;
  vehicleId?: string | null;
  vehicleName?: string | null;

  // Metadados
  createdById?: string | null;
  createdByName?: string | null;
  lastUpdatedById?: string | null;
  lastUpdatedByName?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;

  // Outros campos opcionais do seu projeto
  isActive: boolean;
  city?: string;

  // Histórico de comentários (por exemplo, follow-up)
  comments?: {
    texto: string;
    data: string;
  }[];
}

/** Padrão de retorno paginado da API */
export interface LeadModelResponse {
  items: LeadModel[];
  totalCount?: number;
}
