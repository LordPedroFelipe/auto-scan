import { UsuarioModel } from './usuario.model';

export interface TestDriveModel {
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
  preferredDate: string;
  notes: string;
  isActive: boolean;
  isCancelled: boolean;
  isCompleted: boolean;
  completionDate: string;
  completionNotes: string;
  cancellationDate: string;
  cancellationReason: string;
}
