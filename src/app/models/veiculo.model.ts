import { ReservaModel } from './reserva.model';
import { TestDrive } from './test-drive.model';
import { UsuarioModel } from './usuario.model';

export interface FotoModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  url: string;
  fileName: string;
  order: number;
  isMain: boolean;
  vehicleId: string;
  vehicle: string;
}

export interface VeiculoModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  mileage: number;
  color: string;
  mainPhotoUrl: string;
  shopId: string;
  shop: string;
  createdById: string;
  createdBy: UsuarioModel;
  lastUpdatedById: string;
  lastUpdatedBy: UsuarioModel;
  isActive: boolean;
  isSold: boolean;
  photos: FotoModel[];
  reservations: ReservaModel[];
  testDrives: TestDrive[];
}

export interface VeiculoResumoModel {
  id: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  price: number;
  mainPhotoUrl: string;
  shopName: string;
}
export interface VeiculoResponse {
  items: any;
}