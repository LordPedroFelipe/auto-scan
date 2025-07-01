import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QrCodeService } from 'src/app/services/qr-code.service';

export interface QrCodeModel {
  id: string;
  code: string;
  link: string;
  vehiclePlate: string;
  createdAt: string;
}

@Component({
  selector: 'app-qr-code-list',
  templateUrl: './qr-code-list.component.html',
  styleUrls: ['./qr-code-list.component.scss']
})
export class QrCodeListComponent {
  displayedColumns: string[] = ['vehiclePlate', 'code', 'link', 'createdAt'];
  qrCodes: QrCodeModel[] = [];
  isLoading = true;

  constructor(
    private qrCodeService: QrCodeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const shopId = this.route.snapshot.paramMap.get('shopId');
    if (shopId) {
      this.qrCodeService.getQrCodesByShop(shopId).subscribe({
        next: (data) => {
          this.qrCodes = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
    this.qrCodeService.getQrCodesByShop().subscribe({
        next: (data) => {
          this.qrCodes = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }
}
