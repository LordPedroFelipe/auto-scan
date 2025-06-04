import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserRole } from 'src/app/models/user-role.enum';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLogado = false;
  UserRole = UserRole;
  role: UserRole | null = null;
  menuAberto = false;
  modoMenu: 'over' | 'side' = 'side';

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Atualiza ao carregar
    this.atualizarEstado();

    // Atualiza sempre que a rota mudar (ex: após login)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.atualizarEstado();
      });
  }

  atualizarEstado(): void {
    console.log('atualizarEstado:');
    this.isLogado = this.authService.isAuthenticated();

    if (this.isLogado) {
      const roles = this.authService.getRoles();
      console.log('roles:', roles);
      this.role = roles.length > 0 ? roles[0] as UserRole : null;

      const email = this.authService.getUserEmail();
      const permissions = this.authService.getPermissions();

      console.log('Usuário:', email);
      console.log('Role:', this.role);
      console.log('Permissões:', permissions);

      if (this.authService.hasPermission('Module.Vehicles:Permission.Edit')) {
        console.log('Usuário pode editar veículos');
      }
    } else {
      this.role = null;
    }
  }

  isInRole(role: UserRole | null): boolean {
    if (role) {
      return this.authService.isInRole(role);
    }
    return false;
  }

  logout(): void {
    this.authService.logout();
    this.atualizarEstado();
    this.menuAberto = false;
    this.router.navigate(['/login']);
  }
}
