import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LojaModel } from 'src/app/models/loja.model';

@Component({
  selector: 'app-loja-form',
  templateUrl: './loja-form.component.html',
  styleUrls: ['./loja-form.component.scss']
})
export class LojaFormComponent {
  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LojaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: LojaModel
  ) {
    this.isEditMode = !!data;

    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      description: [data?.description || ''],
      ownerId: [data?.ownerId || '', Validators.required]
    });
  }

  salvar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
