import { Component } from '@angular/core';
import { NotificacaoPreferencia } from 'src/app/models/notificacoes.model';
import { NotificacoesService } from 'src/app/services/notificacoes.service';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.scss']
})
export class NotificacoesComponent {
  preferencias: NotificacaoPreferencia[] = [];
  frequencias = ['imediato', 'diario', 'semanal', 'mensal'];

  constructor(private notificacoesService: NotificacoesService) {}

  ngOnInit(): void {
    this.preferencias = this.notificacoesService.getPreferencias();
  }

  salvar() {
    this.notificacoesService.salvar(this.preferencias);
  }

}
