import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserRole } from 'src/app/models/user-role.enum';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  // @ViewChild('sidenav') sidenav!: MatSidenav;
  isLogado = false;
  UserRole = UserRole;
  role: UserRole | null = null;
  menuAberto = false;
  modoMenu: 'over' | 'side' = 'side';
  chatAtendimento = false;
  email: string | null = null;

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
    const urlAtual = this.router.url;
    this.chatAtendimento = urlAtual.includes('atendimento') || urlAtual.includes('vehicle') || urlAtual.includes('simular-financiamento');

    // Lista de rotas públicas
    const rotasPublicas = ['/', '/login', '/cadastro', '/planos', '/home'];

    // Verifica se está em rota pública
    const emRotaPublica = rotasPublicas.includes(urlAtual);

    if (emRotaPublica) {
      this.authService.logout(); // Faz logout
      this.isLogado = false;
      this.role = null;
      this.menuAberto = false;
      return;
    }

    this.isLogado = this.authService.isAuthenticated();

    if (this.isLogado) {
      const roles = this.authService.getRoles();
      console.log('roles:', roles);
      this.role = roles.length > 0 ? roles[0] as UserRole : null;

      const email = this.authService.getUserEmail();
      const permissions = this.authService.getPermissions();
      this.email = email || null;

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
