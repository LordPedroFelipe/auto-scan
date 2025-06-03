import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loja } from '../models/loja.model';

@Injectable({
  providedIn: 'root'
})
export class LojaService {
  private apiUrl = 'https://api.meusite.com/lojas'; // substitua pela sua API real

  constructor(private http: HttpClient) {}

  listar(): Observable<Loja[]> {
    return this.http.get<Loja[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Loja> {
    return this.http.get<Loja>(`${this.apiUrl}/${id}`);
  }

  criar(loja: Loja): Observable<Loja> {
    return this.http.post<Loja>(this.apiUrl, loja);
  }

  atualizar(id: number, loja: Loja): Observable<Loja> {
    return this.http.put<Loja>(`${this.apiUrl}/${id}`, loja);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
