import { Component, OnInit } from '@angular/core';
import { LojaService } from 'src/app/services/loja.service';
import { LojaModel } from 'src/app/models/loja.model';

@Component({
  selector: 'app-loja-lista',
  templateUrl: './loja-lista.component.html',
  styleUrls: ['./loja-lista.component.scss']
})
export class LojaListaComponent implements OnInit {
  lojas: LojaModel[] = [];
  carregando = true;

  constructor(private lojaService: LojaService) {}

  ngOnInit(): void {
    this.lojaService.listar().subscribe({
      next: (res) => {
        this.lojas = res.filter(loja => !loja.isDeleted);
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar lojas:', err);
        this.carregando = false;
      }
    });
  }
}
