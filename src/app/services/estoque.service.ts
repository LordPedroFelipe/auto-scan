import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VeiculoResponse, VeiculoResumoModel } from '../models/veiculo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private readonly apiUrl = `${environment.apiUrl}/Vehicles`;

  constructor(private http: HttpClient) {}

  listarAtivos(): Observable<VeiculoResponse> {
    return this.http.get<VeiculoResponse>(this.apiUrl);
  }

  listarPaginado(pageNumber: number = 1, pageSize: number = 10) {
    return this.http.get<any>(this.apiUrl, {
      params: {
        pageNumber,
        pageSize
      }
    });
  }

  adicionar(veiculo: Partial<VeiculoResumoModel>): Observable<VeiculoResumoModel> {
    return this.http.post<VeiculoResumoModel>(this.apiUrl, veiculo);
  }

  editar(veiculo: Partial<VeiculoResumoModel>): Observable<VeiculoResumoModel> {
    return this.http.put<VeiculoResumoModel>(`${this.apiUrl}/${veiculo.id}`, veiculo);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarPorId(id: string): Observable<VeiculoResumoModel> {
    return this.http.get<VeiculoResumoModel>(`${this.apiUrl}/${id}`);
  }
}
