import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LojaModel } from '../models/loja.model';
import { LojaCreateDto } from '../models/loja-create.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LojaService {
  private readonly apiUrl = `${environment.apiUrl}/Shops`;

  constructor(private http: HttpClient) {}

  listar(): Observable<LojaModel[]> {
    return this.http.get<LojaModel[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<LojaModel> {
    return this.http.get<LojaModel>(`${this.apiUrl}/${id}`);
  }

  criar(loja: LojaCreateDto): Observable<LojaModel> {
    return this.http.post<LojaModel>(this.apiUrl, loja);
  }

  atualizar(id: string, loja: LojaModel): Observable<LojaModel> {
    return this.http.put<LojaModel>(`${this.apiUrl}/${id}`, loja);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
