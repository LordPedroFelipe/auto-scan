import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  welcomeMessage: string = 'Bem-vindo ao ScanDrive - A plataforma para lojas de carros!';

  constructor() {}

  ngOnInit(): void {
    // Aqui você pode adicionar qualquer lógica necessária quando o componente for inicializado
  }
}
