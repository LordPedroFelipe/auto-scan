import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalhes-veiculos-modal',
  templateUrl: './detalhes-veiculos-modal.component.html',
  styleUrls: ['./detalhes-veiculos-modal.component.scss']
})
export class DetalhesVeiculosModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
