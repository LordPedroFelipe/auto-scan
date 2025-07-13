import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QrCodeService {
  private readonly apiUrl = `${environment.apiUrl}/QRCode`;
  // private readonly apiUrl = 'https://scandrive.duckdns.org:8443/api/QRCode';

  constructor(private http: HttpClient) {}

  getQrCodesByShop(shopId?: string): Observable<any[]> {
    // return this.http.get<any[]>(`${this.apiUrl}/shop/${shopId}`);
    return this.http.get<any[]>(`${this.apiUrl}/shop/1ae44908-6f2e-49f9-a3e8-34be6f882084`);
    
  }

  visualizarQRCode(id: string): void {
    const url = `${this.apiUrl}/${id}/image`;
    window.open(url, '_blank');
  }
  
  criar(qrCode: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/shop/1ae44908-6f2e-49f9-a3e8-34be6f882084`, qrCode);
  }
}
