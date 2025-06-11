import { HttpClient } from '@angular/common/http';
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

  buscarPorId(id: string): Observable<LeadModel> {
    return this.http.get<LeadModel>(`${this.apiUrl}/${id}`);
  }

  criar(lead: LeadModel): Observable<LeadModel> {
    return this.http.post<LeadModel>(this.apiUrl, lead);
  }

  atualizar(id: string, lead: LeadModel): Observable<LeadModel> {
    return this.http.put<LeadModel>(`${this.apiUrl}/${id}`, lead);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
