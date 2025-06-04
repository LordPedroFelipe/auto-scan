import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LojaModel } from 'src/app/models/loja.model';
import { LojaService } from 'src/app/services/loja.service';
import { LojaFormComponent } from 'src/app/components/loja-form/loja-form.component';

@Component({
  selector: 'app-loja-lista',
  templateUrl: './loja-lista.component.html',
  styleUrls: ['./loja-lista.component.scss']
})
export class LojaListaComponent implements OnInit {
  lojas: LojaModel[] = [];

  constructor(
    private lojaService: LojaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarLojas();
  }

  carregarLojas(): void {
    this.lojaService.listar().subscribe({
      next: (res) => this.lojas = res.filter(loja => !loja.isDeleted),
      error: (err) => console.error('Erro ao carregar lojas', err)
    });
  }

  abrirCadastro(): void {
    const dialogRef = this.dialog.open(LojaFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lojaService.criar(result).subscribe(() => this.carregarLojas());
      }
    });
  }

  editar(loja: LojaModel): void {
    const dialogRef = this.dialog.open(LojaFormComponent, {
      width: '400px',
      data: loja
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lojaService.atualizar(loja.id, result).subscribe(() => this.carregarLojas());
      }
    });
  }

  excluir(id: string): void {
    if (confirm('Deseja realmente excluir esta loja?')) {
      this.lojaService.excluir(id).subscribe(() => this.carregarLojas());
    }
  }
}
