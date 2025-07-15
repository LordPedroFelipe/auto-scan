import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalhes-veiculos-modal',
  templateUrl: './detalhes-veiculos-modal.component.html',
  styleUrls: ['./detalhes-veiculos-modal.component.scss']
})
export class DetalhesVeiculosModalComponent {

  fotoSelecionadaIndex: number | null = null;
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  abrirFotoFullscreen(index: number) {
    this.fotoSelecionadaIndex = index;
  }

  fecharFullscreen() {
    this.fotoSelecionadaIndex = null;
  }

  proximaFoto() {
    if (this.fotoSelecionadaIndex !== null && this.fotoSelecionadaIndex < this.data.photoUrls.length - 1) {
      this.fotoSelecionadaIndex++;
    }
  }

  fotoAnterior() {
    if (this.fotoSelecionadaIndex !== null && this.fotoSelecionadaIndex > 0) {
      this.fotoSelecionadaIndex--;
    }
  }
}
