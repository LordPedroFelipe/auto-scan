import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LeadModel, LeadModelResponse } from '../models/lead.model';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private readonly apiUrl = `${environment.apiUrl}/Lead`;

  constructor(private http: HttpClient) {}

  listar(): Observable<LeadModelResponse> {
    return this.http.get<LeadModelResponse>(this.apiUrl);
  }

  getLeads(): Observable<LeadModelResponse> {
    return this.http.get<LeadModelResponse>(this.apiUrl);
  }

  listarPaginado(pageNumber: number = 1, pageSize: number = 10) {
    return this.http.get<any>(this.apiUrl, {
      params: {
        pageNumber,
        pageSize
      }
    });
  }

  listarPaginadoComFiltro(filtros: any) {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<any>(this.apiUrl, { params });
  }

  buscarPorId(id: string): Observable<LeadModel> {
    return this.http.get<LeadModel>(`${this.apiUrl}/${id}`);
  }

  criar(lead: LeadModel): Observable<LeadModel> {
    return this.http.post<LeadModel>(this.apiUrl, lead);
  }

  atualizar(id: string, lead: Partial<LeadModel>): Observable<LeadModel> {
    return this.http.put<LeadModel>(`${this.apiUrl}/${id}`, lead);
  }

  excluir(id: string | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
