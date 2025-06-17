import { UsuarioModel } from './usuario.model';
import { VeiculoModel } from './veiculo.model';
import { ReservaModel } from './reserva.model';
import { TestDrive } from './test-drive.model';

export interface LojaModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  name: string;
  description: string;
  ownerId: string;
  owner: UsuarioModel;
  sellers: UsuarioModel[];
  vehicles: VeiculoModel[];
  reservations: ReservaModel[];
  testDrives: TestDrive[];
  isActive: boolean;
}
