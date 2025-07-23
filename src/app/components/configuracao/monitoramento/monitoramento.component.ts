import { Component, OnInit } from '@angular/core';
import { DatabaseStatus, HealthStatus, Metrics } from 'src/app/models/monitoramento.model';
import { MonitoramentoService } from 'src/app/services/monitoramento.service';

@Component({
  selector: 'app-monitoramento',
  templateUrl: './monitoramento.component.html',
  styleUrls: ['./monitoramento.component.scss']
})
export class MonitoramentoComponent implements OnInit {
  health?: HealthStatus;
  metrics?: Metrics;
  dbStatus?: DatabaseStatus;

  loading = true;
  erroDb = false;

  constructor(private service: MonitoramentoService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading = true;

    this.service.getHealth().subscribe((res) => (this.health = res));
    this.service.getMetrics().subscribe((res) => (this.metrics = res));
    this.service.getDbStatus().subscribe({
      next: (res: any) => {
        this.dbStatus = res;
        this.erroDb = false;
        this.loading = false;
      },
      error: () => {
        this.erroDb = true;
        this.loading = false;
      }
    });
  }

  // --- Getters para uso seguro no template ---

  get statusApi(): string {
    return this.health?.status || 'Indefinido';
  }

  get versaoApi(): string {
    return this.health?.version || '---';
  }

  get timestampApi(): string {
    return this.health?.timestamp || '';
  }

  get uptime(): string {
    return this.metrics?.system.uptime || '';
  }

  get cpu(): number {
    return this.metrics?.system.cpu.usagePercent ?? 0;
  }

  get memoria() {
    return this.metrics?.system.memory || {
      total: '-', used: '-', free: '-', usagePercent: 0
    };
  }

  get disco() {
    return this.metrics?.system.disk || {
      total: '-', used: '-', free: '-', usagePercent: 0
    };
  }

  get conexao(): string {
    return this.dbStatus?.database.connection || '-';
  }

  get estadoDb(): string {
    return this.dbStatus?.database.state || '-';
  }

  get conexaoAtiva(): string {
    return this.dbStatus?.database.canConnect ? 'Sim' : 'Não';
  }

  get tamanhoTotalTabelas(): string {
    return this.dbStatus?.database.tables_size_in_mb_total || '-';
  }

  get tabelasMaisPesadas() {
    return this.dbStatus?.database.tables_size_in_mb?.slice(0, 5) || [];
  }
}
