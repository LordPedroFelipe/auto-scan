
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly apiUrl = `${environment.apiUrl}/api/Reports`;

  constructor(private http: HttpClient) {}

  getRelatorioLoja(shopId: string, params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/shops/${shopId}`, { params });
  }
}