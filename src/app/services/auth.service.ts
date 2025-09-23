import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { DecodedTokenModel } from '../models/decoded-token.model';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private readonly tokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  register(data: RegisterModel): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginModel): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getDecodedToken(): DecodedTokenModel | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedTokenModel>(token);
    } catch (error) {
      console.error('[AuthService] Erro ao decodificar token:', error);
      return null;
    }
  }

  getUserId(): string | null {
    return this.getDecodedToken()?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
  }

  getUserEmail(): string | null {
    return this.getDecodedToken()?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || null;
  }

  getRoles(): string[] {
    const role = this.getDecodedToken()?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return role ? (Array.isArray(role) ? role : [role]) : [];
  }

  getPermissions(): string[] {
    return this.getDecodedToken()?.Permission || [];
  }

  isInRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  getShopId(): string | null {
    return this.getDecodedToken()?.["ShopId"] || null;
  }

  getShopName(): string | null {
    return this.getDecodedToken()?.["ShopName"] || null;
  }
}
