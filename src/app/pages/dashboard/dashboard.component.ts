import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { INDICADORES_MOCK } from 'src/assets/data/indicadores.mock';
import { Indicador } from '../../models/indicador.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  indicadores: Indicador[] = [];
  nomeLoja: string | null = null;
  shopId: string | null = null;
  // palavrasMaisBuscadas: { palavra: string; quantidade: number }[] = [];
  displayedColumns: string[] = ['palavra', 'quantidade'];
  palavrasMaisBuscadas = new MatTableDataSource<any>();
  isLoading = false;

  modoTabela = true;

  constructor(
    private dashboardService: DashboardService,
    private alert: AlertService,
    public authService: AuthService
    // private alert: AlertService
  ) {}

  ngOnInit(): void {
    // Simulando requisição futura de service/API
    this.indicadores = INDICADORES_MOCK;

    this.carregarPalavras();
    this.nomeLoja = this.authService.getShopName();
    this.shopId = this.authService.getShopId();

    /* this.palavrasMaisBuscadas = [
      { "palavra": "Onix", "quantidade": 12 },
      { "palavra": "Mercedes", "quantidade": 10 },
      { "palavra": "Jetta", "quantidade": 9 },
      { "palavra": "Automatico", "quantidade": 8 },
      { "palavra": "Hilux", "quantidade": 6 }
    ]*/

    /* this.chatService.getPalavrasMaisBuscadas().subscribe({
      next: res => this.palavrasMaisBuscadas = res,
      error: err => console.error('Erro ao buscar palavras mais buscadas', err)
    });*/
  }



  carregarPalavras(): void {
    this.isLoading = true;
    this.dashboardService.getPalavrasMaisBuscadas().subscribe({
      next: (res) => {
        this.palavrasMaisBuscadas.data = res;
        this.isLoading = false;
      },
      error: () => {
        this.alert.showError('Erro ao carregar palavras mais buscadas.');
        this.isLoading = false;
      }
    });
  }
}
