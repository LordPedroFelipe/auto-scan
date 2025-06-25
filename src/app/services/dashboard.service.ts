import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    // private readonly apiUrl = 'https://scandrive.duckdns.org:8443/api/Chat';
    private readonly apiUrl = `${environment.apiUrl}/Chat`;

    constructor(private http: HttpClient) {}

    getPalavrasMaisBuscadas(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/keywords`);
    }
}