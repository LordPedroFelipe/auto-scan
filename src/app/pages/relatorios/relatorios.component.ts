import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RelatorioService } from 'src/app/services/relatorios.service';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})
export class RelatoriosComponent implements OnInit {
  relatorios = [
    { id: 'shopReport', nome: 'Relatório da Loja' }
  ];

  relatorioSelecionado: any;

  formShopReport!: FormGroup;

  lojas: any[] = [];       // mock ou via service
  vendedores: any[] = [];  // mock ou via service
  shopId: string = '';

  constructor(
    private fb: FormBuilder,
    private relatorioService: RelatorioService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.formShopReport = this.fb.group({
      shopId: [null, Validators.required],
      sellerId: [null],
      startDate: [null],
      endDate: [null]
    });
    this.shopId = this.authService.getShopId() || '';

    // TODO: carregar lojas e vendedores via service
  }

  onRelatorioChange() {
    this.formShopReport.reset();
  }

  gerarRelatorioShop() {
    const { shopId, sellerId, startDate, endDate } = this.formShopReport.value;

    const params: any = {};
    if (sellerId) params.sellerId = sellerId;
    if (startDate) params.startDate = new Date(startDate).toISOString();
    if (endDate) params.endDate = new Date(endDate).toISOString();

    this.relatorioService.getRelatorioLoja(this.shopId, params).subscribe({
      next: (res) => {
        // TODO: abrir modal, gerar PDF, ou exibir na tela
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}