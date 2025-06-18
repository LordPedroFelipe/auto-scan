import { Component, OnInit } from '@angular/core';
import { Veiculo } from '../../models/veiculo';
import { EstoqueService } from '../../services/estoque.service';
import { MatDialog } from '@angular/material/dialog';
import { CadastroVeiculoModalComponent } from '../../components/cadastro-veiculo-modal/cadastro-veiculo-modal.component';
import { VeiculoResumoModel } from 'src/app/models/veiculo.model';
import { PageEvent } from '@angular/material/paginator';
import { DetalhesVeiculosModalComponent } from '../../components/detalhes-veiculos-modal/detalhes-veiculos-modal.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {
  veiculos: VeiculoResumoModel[] = [];
  carregando = false;
  filtroForm!: FormGroup;

  displayedColumns: string[] = ['foto', 'brand', 'model', 'year', 'price', 'mileage', 'color', 'acoes'];
  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;

  constructor(
    private fb: FormBuilder,
    private estoqueService: EstoqueService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      brand: [''],
      model: [''],
      year: [''],
      color: [''],
      transmission: [''],
      fuelType: [''],
      hasAuction: [false],
      hasAccident: [false],
      isFirstOwner: [false],
      isOnOffer: [false]
    });
    this.carregarVeiculos();
  }

  carregarVeiculos(pageIndex: number = 0) {
    this.carregando = true;
    this.estoqueService.listarPaginado(pageIndex + 1, this.pageSize).subscribe({
      next: (res) => {
        this.veiculos = res.items;
        this.totalCount = res.totalCount;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  mudarPagina(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarVeiculos(this.pageIndex);
  }

  abrirCadastro(veiculo?: Veiculo) {
    const dialogRef = this.dialog.open(CadastroVeiculoModalComponent, {
      data: veiculo || null,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        veiculo ? this.estoqueService.editar(result) : this.estoqueService.adicionar(result);
      }
    });
  }

  abrirDetalhes(veiculo: VeiculoResumoModel) {
    this.dialog.open(DetalhesVeiculosModalComponent, {
      data: veiculo,
      width: '600px'
    });
  }

  excluir(id: string) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      // this.estoqueService.excluir(id);
    }
  }

  aplicarFiltros() {
    const filtros = this.filtroForm.value;

    const params = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      ...filtros
    };

    this.carregando = true;
    this.estoqueService.listarPaginadoComFiltro(params).subscribe({
      next: (res) => {
        this.veiculos = res.items;
        this.totalCount = res.totalCount;
        this.carregando = false;
      },
      error: () => this.carregando = false
    });
  }

  limparFiltros() {
    this.filtroForm.reset();
    this.aplicarFiltros();
  }
}
