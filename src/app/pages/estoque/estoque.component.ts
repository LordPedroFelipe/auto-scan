import { Component, OnInit } from '@angular/core';
import { Veiculo } from '../../models/veiculo';
import { EstoqueService } from '../../services/estoque.service';
import { MatDialog } from '@angular/material/dialog';
import { CadastroVeiculoModalComponent } from '../../components/cadastro-veiculo-modal/cadastro-veiculo-modal.component';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit {
  veiculos: Veiculo[] = [];

  displayedColumns = ['modelo', 'marca', 'ano', 'preco', 'status', 'acoes'];

  constructor(
    private estoqueService: EstoqueService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.estoqueService.veiculos$.subscribe(data => {
      this.veiculos = data;
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

  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      this.estoqueService.excluir(id);
    }
  }
}
