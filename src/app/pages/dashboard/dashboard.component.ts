import { Component, OnInit } from '@angular/core';
import { Indicador } from '../../models/indicador.model';
import { INDICADORES_MOCK } from 'src/assets/data/indicadores.mock';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  indicadores: Indicador[] = [];
  nomeLoja = 'Kafka Multimarcas';
  palavrasMaisBuscadas: { palavra: string; quantidade: number }[] = [];

  ngOnInit(): void {
    // Simulando requisição futura de service/API
    this.indicadores = INDICADORES_MOCK;

    this.palavrasMaisBuscadas = [
      { "palavra": "Onix", "quantidade": 12 },
      { "palavra": "Mercedes", "quantidade": 10 },
      { "palavra": "Jetta", "quantidade": 9 },
      { "palavra": "Automatico", "quantidade": 8 },
      { "palavra": "Hilux", "quantidade": 6 }
    ]

    /* this.chatService.getPalavrasMaisBuscadas().subscribe({
      next: res => this.palavrasMaisBuscadas = res,
      error: err => console.error('Erro ao buscar palavras mais buscadas', err)
    });*/ 
  }
}
