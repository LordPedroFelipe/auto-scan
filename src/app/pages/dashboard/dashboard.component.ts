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

  ngOnInit(): void {
    // Simulando requisição futura de service/API
    this.indicadores = INDICADORES_MOCK;
  }
}
