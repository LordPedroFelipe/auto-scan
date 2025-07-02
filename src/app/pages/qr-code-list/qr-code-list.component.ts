import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QrCodeService } from 'src/app/services/qr-code.service';

export interface QrCodeModel {
  id: string;
  code: string;
  link: string;
  vehiclePlate: string;
  createdAt: string;
}

@Component({
  selector: 'app-qr-code-list',
  templateUrl: './qr-code-list.component.html',
  styleUrls: ['./qr-code-list.component.scss']
})
export class QrCodeListComponent {
  qrCodes: QrCodeModel[] = [];
  displayedColumns: string[] = ['vehiclePlate', 'code', 'link', 'createdAt'];

  isLoading = false;
  modoVisualizacao: 'cards' | 'tabela' = 'tabela';

  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private qrCodeService: QrCodeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.isLoading = true;

      const shopId = this.route.snapshot.paramMap.get('shopId');
      if (shopId) {
        this.qrCodeService.getQrCodesByShop(shopId).subscribe({
          next: (data) => {
            this.qrCodes = data;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      }
      this.qrCodeService.getQrCodesByShop().subscribe({
          next: (data) => {
            this.qrCodes = data;
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        });

    /*this.qrCodeService.listar({ pageNumber: this.pageIndex + 1, pageSize: this.pageSize }).subscribe(res => {
      this.qrCodes = res.items;
      this.totalCount = res.totalCount;
      this.isLoading = false;
    });*/
  }

  mudarPagina(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscar();
  }

  alternarModo(): void {
    this.modoVisualizacao = this.modoVisualizacao === 'cards' ? 'tabela' : 'cards';
  }

  abrirCadastro(): void {
    /*const dialogRef = this.dialog.open(LeadFormModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.carregarLeads();
    });*/
  }
  
  abrirDetalhes(lead: any): void {
    /*this.dialog.open(LeadDetalheModalComponent, {
      data: lead,
      width: '600px'
    });*/
  }

  excluir(id: string | undefined): void {
    if (confirm('Deseja realmente excluir este lead?')) {
      // this.leadService.excluir(id).subscribe(() => this.carregarLeads());
    }
  }
}
