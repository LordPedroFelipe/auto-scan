import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VeiculoResumoModel } from '../models/veiculo.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {
  private readonly apiUrl = `${environment.apiUrl}/Vehicles`;

  constructor(private http: HttpClient) {}

  listarAtivos(): Observable<VeiculoResumoModel[]> {
    return this.http.get<VeiculoResumoModel[]>(this.apiUrl);
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
