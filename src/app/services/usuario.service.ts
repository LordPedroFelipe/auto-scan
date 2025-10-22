import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuarioModel } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/Users`;
  private readonly apiUrlBase = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(this.apiUrl);
  }

  criar(usuario: Partial<UsuarioModel>): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(this.apiUrl, usuario);
  }

  atualizar(id: string, usuario: Partial<UsuarioModel>): Observable<UsuarioModel> {
    return this.http.put<UsuarioModel>(`${this.apiUrl}/${id}`, usuario);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  buscarPorId(id: string): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.apiUrl}/${id}`);
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/list-items`);
  }

  listarPapeis(): Observable<{ id: string, description: string }[]> {
    return this.http.get<{ id: string, description: string }[]>(`${this.apiUrlBase}/Permissions/roles`);
  }

  listarModulos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlBase}/Permissions/modules`);
  }

  listarPermissoesDisponiveis(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlBase}/Permissions/available-claims`);
  }

  buscarPermissoesDoUsuario(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlBase}/Permissions/user/${userId}/roles`);
  }

  adicionarPermissao(userId: string, role: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrlBase}/Permissions/user/${userId}/roles`, role);
  }

  buscarClaimDoUsuario(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrlBase}/Permissions/user/${userId}/claims`);
  }

  adicionarClaim(userId: string, claim: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrlBase}/Permissions/user/${userId}/claims`, claim);
  }

}
