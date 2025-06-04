import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { RegisterModel } from '../models/register.model';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  register(data: RegisterModel): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('access_token', res.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

}
