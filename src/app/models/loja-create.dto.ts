// src/app/models/loja-create.dto.ts
export interface LojaCreateDto {
  name: string;
  description?: string;
  ownerId?: string;
  isActive?: boolean;
  qrCodeLimit?: number;
  owner?: {
    userName: string;
    normalizedUserName: string;
    email: string;
    normalizedEmail: string;
    emailConfirmed: boolean;
    passwordHash: string;
    phoneNumber: string;
    phoneNumberConfirmed: boolean;
  };
}
