import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LojaModel } from '../models/loja.model';
import { LojaCreateDto } from '../models/loja-create.dto';
import { environment } from '../../environments/environment';
import { TestDrive, TestDriveResponse } from '../models/test-drive.model';

@Injectable({
  providedIn: 'root'
})
export class TestDriveService {
  private readonly apiUrl = `${environment.apiUrl}/TestDrives`;

  constructor(private http: HttpClient) {}

  listar(params: any): Observable<TestDriveResponse> {
    return this.http.get<TestDriveResponse>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<TestDrive> {
    return this.http.get<TestDrive>(`${this.apiUrl}/${id}`);
  }

  criar(loja: TestDrive): Observable<TestDrive> {
    return this.http.post<TestDrive>(this.apiUrl, loja);
  }

  atualizar(id: string, loja: TestDrive): Observable<TestDrive> {
    return this.http.put<TestDrive>(`${this.apiUrl}/${id}`, loja);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
