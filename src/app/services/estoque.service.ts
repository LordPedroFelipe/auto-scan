import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VeiculoResponse, VeiculoResumoModel } from '../models/veiculo.model';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private readonly apiUrl = `${environment.apiUrl}/Vehicles`;

  constructor(private http: HttpClient) {}

  listarPaginado(pageNumber: number = 1, pageSize: number = 10): Observable<VeiculoResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);
    return this.http.get<VeiculoResponse>(this.apiUrl, { params });
  }

  listarPaginadoComFiltro(filtros: any): Observable<VeiculoResponse> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) params = params.set(key, 'true');
      } else if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return this.http.get<VeiculoResponse>(this.apiUrl, { params });
  }

  listarAtivos(): Observable<VeiculoResponse> {
    return this.http.get<VeiculoResponse>(this.apiUrl);
  }

  listarAtivosSimples(): Observable<VeiculoResponse> {
    return this.http.get<VeiculoResponse>(`${this.apiUrl}/list-items`);
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
