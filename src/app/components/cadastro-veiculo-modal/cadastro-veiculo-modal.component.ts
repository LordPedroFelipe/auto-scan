import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cadastro-veiculo-modal',
  templateUrl: './cadastro-veiculo-modal.component.html',
  styleUrls: ['./cadastro-veiculo-modal.component.scss']
})
export class CadastroVeiculoModalComponent {
  form: FormGroup;
  abaSelecionada = 0;

  constructor(
    public dialogRef: MatDialogRef<CadastroVeiculoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id: [data?.id || null],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      isActive: [data?.isActive ?? true],
      qrCodeLimit: [data?.qrCodeLimit ?? 10, [Validators.required, Validators.min(1)]],
      ownerId: [data?.ownerId || '', Validators.required],
      ownerEmail: [data?.owner?.email || '', [Validators.required, Validators.email]],
    });
  }

  salvar() {
    if (this.form.valid) {
      const payload = {
        ...this.form.value,
        owner: {
          id: this.form.value.ownerId,
          email: this.form.value.ownerEmail
        }
      };
      console.log('Dados do Shop:', payload);
      this.dialogRef.close(payload);
    }
  }

  fechar() {
    this.dialogRef.close();
  }
}
