import { Component, OnInit } from '@angular/core';
import { Veiculo } from '../../models/veiculo';
import { EstoqueService } from '../../services/estoque.service';
import { MatDialog } from '@angular/material/dialog';
import { CadastroVeiculoModalComponent } from '../../components/cadastro-veiculo-modal/cadastro-veiculo-modal.component';
import { VeiculoResumoModel } from 'src/app/models/veiculo.model';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {
  veiculos: VeiculoResumoModel[] = [];
  carregando = false;

  displayedColumns: string[] = ['brand', 'model', 'year', 'price', 'mileage', 'color', 'acoes'];


  constructor(
    private estoqueService: EstoqueService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregando = true;
    this.estoqueService.listarAtivos().subscribe({
      next: (res) => {
        this.veiculos = res;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar veículos', err);
        this.carregando = false;
      }
    });
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

  excluir(id: string) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      this.estoqueService.excluir(id);
    }
  }
}
