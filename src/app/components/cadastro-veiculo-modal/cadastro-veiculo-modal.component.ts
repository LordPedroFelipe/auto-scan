import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Veiculo } from '../../models/veiculo';

@Component({
  selector: 'app-cadastro-veiculo-modal',
  templateUrl: './cadastro-veiculo-modal.component.html'
})
export class CadastroVeiculoModalComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CadastroVeiculoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Veiculo | null,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [data?.id],
      modelo: [data?.modelo || '', Validators.required],
      marca: [data?.marca || '', Validators.required],
      ano: [data?.ano || '', Validators.required],
      preco: [data?.preco || '', Validators.required],
      status: [data?.status || 'disponível', Validators.required],
    });
  }

  salvar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  fechar() {
    this.dialogRef.close();
  }
}
