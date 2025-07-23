import { Component } from '@angular/core';
import { Pagamento } from 'src/app/models/pagamento.model';
import { PagamentoService } from 'src/app/services/pagamento.service';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent {
  planos = [
    { nome: 'Premium', preco: 799 },
    { nome: 'Medium', preco: 599 },
    { nome: 'Básico', preco: 299 },
  ];

  planoSelecionado = this.planos[0];
  metodoPagamento: 'pix' | 'cartao' = 'pix';

  pagamentoAtual!: Pagamento;
  historico: Pagamento[] = [];

  constructor(private pagamentoService: PagamentoService) {}

  ngOnInit(): void {
    this.pagamentoAtual = this.pagamentoService.getPagamentoAtual();
    this.historico = this.pagamentoService.getHistorico();
  }

  confirmarPagamento() {
    // Simula ação de pagamento
    console.log(`Plano: ${this.planoSelecionado.nome}`);
    console.log(`Método: ${this.metodoPagamento}`);
    alert('Pagamento confirmado (simulado).');
  }

}
