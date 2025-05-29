import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    // Verifique a lógica de autenticação aqui, pode ser via serviço
    if (this.email === 'usuario@exemplo.com' && this.password === 'senha') {
      // Redireciona para a página principal (ou onde você quiser)
      this.router.navigate(['/home']);
    } else {
      alert('Credenciais inválidas');
    }
  }
}
