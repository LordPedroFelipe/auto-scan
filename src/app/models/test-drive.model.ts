export interface TestDrive {
  id: string;
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
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleMainPhotoUrl: string;
  vehicleTransmission: string;
  vehicleFuelType: string;
  vehicleHasAuction: boolean;
  vehicleHasAccident: boolean;
  vehicleIsFirstOwner: boolean;
  vehicleOwnersCount: number;
  shopId: string;
  shopName: string;
}

export interface TestDriveResponse {
  items: TestDrive[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}
