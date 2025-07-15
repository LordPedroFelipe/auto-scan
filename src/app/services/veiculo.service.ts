import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private readonly apiUrl = `${environment.apiUrl}/Vehicles`;

  constructor(private http: HttpClient) {}

  getVeiculoById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}