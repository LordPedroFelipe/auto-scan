import { UsuarioModel } from './usuario.model';

export interface ReservaModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  vehicleId: string;
  vehicle: string;
  shopId: string;
  shop: string;
  customerId: string;
  customer: UsuarioModel;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reservationDate: string;
  notes: string;
  isActive: boolean;
  isCancelled: boolean;
  cancellationDate: string;
  cancellationReason: string;
}
