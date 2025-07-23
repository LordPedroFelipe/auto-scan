import { Injectable } from '@angular/core';
import { Pagamento } from '../models/pagamento.model';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {
  private pagamentos: Pagamento[] = [
    {
      id: 5,
      plano: 'Premium',
      valor: 799,
      metodo: 'cartao',
      data: '2025-07-01',
      status: 'Pago',
    },
    {
      id: 4,
      plano: 'Premium',
      valor: 799,
      metodo: 'cartao',
      data: '2025-06-01',
      status: 'Pago',
    },
    {
      id: 4,
      plano: 'Premium',
      valor: 799,
      metodo: 'cartao',
      data: '2025-05-01',
      status: 'Pago',
    },
    {
      id: 2,
      plano: 'Medium',
      valor: 599,
      metodo: 'pix',
      data: '2025-04-01',
      status: 'Pago',
    },
    {
      id: 1,
      plano: 'Básico',
      valor: 199,
      metodo: 'pix',
      data: '2025-03-01',
      status: 'Pago',
    },
  ];

  getPagamentoAtual(): Pagamento {
    return this.pagamentos[0]; // o mais recente
  }

  getHistorico(): Pagamento[] {
    return this.pagamentos.slice(1); // os anteriores
  }
}
