import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    
    // Rotas que não precisam de autenticação
    private rotasPublicas: string[] = ['/', '/login', '/cadastro', '/planos', '/home'];
  
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const urlAtual = state.url;

        // Se a rota for pública, deixa passar
        if (this.ehRotaPublica(urlAtual)) {
            return true;
        }

        // Se for rota protegida e estiver autenticado, deixa passar
        if (this.authService.isAuthenticated()) {
            return true;
        }

        // Se não estiver autenticado e rota for protegida → faz logout e redireciona
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
    }

    private ehRotaPublica(url: string): boolean {
        return this.rotasPublicas.some(rota => url === rota || url.startsWith(rota + '/'));
    }
}
