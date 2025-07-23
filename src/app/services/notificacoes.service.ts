import { Injectable } from '@angular/core';
import { NotificacaoPreferencia } from '../models/notificacoes.model';

@Injectable({ providedIn: 'root' })
export class NotificacoesService {
  private preferenciasMock: NotificacaoPreferencia[] = [
    {
      tipo: 'Leads recebidos',
      email: true,
      whatsapp: true,
      sms: false,
      push: true,
      frequencia: 'imediato',
    },
    {
      tipo: 'Avisos de vencimento de plano',
      email: true,
      whatsapp: false,
      sms: false,
      push: false,
      frequencia: 'diario',
    },
    {
      tipo: 'Promoções e novidades',
      email: false,
      whatsapp: true,
      sms: true,
      push: true,
      frequencia: 'mensal',
    },
  ];

  getPreferencias(): NotificacaoPreferencia[] {
    return this.preferenciasMock;
  }

  salvar(preferencias: NotificacaoPreferencia[]) {
    console.log('Preferências salvas:', preferencias);
    alert('Preferências de notificação salvas com sucesso!');
  }
}
