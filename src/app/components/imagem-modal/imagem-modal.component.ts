import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-imagem-modal',
  templateUrl: './imagem-modal.component.html',
  styleUrls: ['./imagem-modal.component.scss']
})
export class ImagemModalComponent {
  imagens: string[] = [];
  indiceAtual = 0;
  loop = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imagens: string[], indice: number, loop?: boolean }) {
    this.imagens = data?.imagens ?? [];
    this.indiceAtual = Math.min(Math.max(0, data?.indice ?? 0), Math.max(0, this.imagens.length - 1));
    if (typeof data?.loop === 'boolean') this.loop = data.loop;
  }

  altAtual(): string {
    return `Imagem ${this.indiceAtual + 1} de ${this.imagens.length}`;
  }

  avancar(): void {
    if (!this.imagens.length) return;
    if (this.indiceAtual < this.imagens.length - 1) this.indiceAtual++;
    else if (this.loop) this.indiceAtual = 0;
  }

  voltar(): void {
    if (!this.imagens.length) return;
    if (this.indiceAtual > 0) this.indiceAtual--;
    else if (this.loop) this.indiceAtual = this.imagens.length - 1;
  }

  // setas do teclado
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') this.avancar();
    if (e.key === 'ArrowLeft')  this.voltar();
  }
}
