import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-imagem-modal',
  templateUrl: './imagem-modal.component.html',
  styleUrls: ['./imagem-modal.component.scss']
})
export class ImagemModalComponent {
  imagens: string[];
  indiceAtual: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imagens: string[], indice: number }) {
    this.imagens = data.imagens;
    this.indiceAtual = data.indice;
  }

  imagemAtual(): string {
    return this.imagens[this.indiceAtual];
  }

  proximaImagem(): void {
    if (this.indiceAtual < this.imagens.length - 1) {
      this.indiceAtual++;
    }
  }

  imagemAnterior(): void {
    if (this.indiceAtual > 0) {
      this.indiceAtual--;
    }
  }
}
