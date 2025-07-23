import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DatabaseStatus, HealthStatus, Metrics } from '../models/monitoramento.model';

@Injectable({
  providedIn: 'root'
})
export class MonitoramentoService {
    // private readonly baseUrl = 'https://scandrive.duckdns.org:8443/api/Monitoring';
    private readonly baseUrl = `${environment.apiUrl}/Chat`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // ou use serviço de auth
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: '*/*'
    });
  }

  getHealth(): Observable<HealthStatus> {
    return this.http.get<HealthStatus>(`${this.baseUrl}/health`, {
      headers: this.getAuthHeaders()
    });
  }

  getMetrics(): Observable<Metrics> {
    return this.http.get<Metrics>(`${this.baseUrl}/metrics`, {
      headers: this.getAuthHeaders()
    });
  }

  getDbStatus(): Observable<DatabaseStatus> {
    return this.http.get<DatabaseStatus>(`${this.baseUrl}/db-status`, {
      headers: this.getAuthHeaders()
    });
  }
}
