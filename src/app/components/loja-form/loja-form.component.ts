import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LojaCreateDto } from 'src/app/models/loja-create.dto';
import { LojaService } from 'src/app/services/loja.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-loja-form',
  templateUrl: './loja-form.component.html',
  styleUrls: ['./loja-form.component.scss']
})
export class LojaFormComponent {
  form: FormGroup;
  abaSelecionada = 0;
  usuarios: any[] = [];
  isEdicao = false;

  constructor(
    public dialogRef: MatDialogRef<LojaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userService: UsuarioService,
    private lojaService: LojaService
  ) {
    this.isEdicao = !!data?.id;

    this.form = this.fb.group({
      id: [data?.id || null],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      isActive: [data?.isActive ?? true],
      qrCodeLimit: [data?.qrCodeLimit ?? 10, [Validators.required, Validators.min(1)]],
      ownerId: [data?.ownerId || '', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.listarUsuarios().subscribe(users => {
      this.usuarios = users;
    });
  }

  salvar() {
    console.log('salvar:', this.form.invalid);
    console.log('salvar form:', this.form);
    console.log('salvar value:', this.form.value);
    if (this.form.invalid) return;

    const lojaForm = this.form.value;

    if (this.isEdicao) {
      const lojaAtualizada: any = {
        ...this.data!,
        ...lojaForm
      };

      this.lojaService.atualizar(lojaAtualizada.id!, lojaAtualizada).subscribe(result => {
        this.dialogRef.close(result);
      });
    } else {
      const novaLoja: LojaCreateDto = {
        name: lojaForm.name,
        description: lojaForm.description,
        isActive: lojaForm.isActive,
        qrCodeLimit: lojaForm.qrCodeLimit,
        ownerId: lojaForm.ownerId
      };

      this.lojaService.criar(novaLoja).subscribe(result => {
        this.dialogRef.close(result);
      });
    }
  }
  fechar() {
    this.dialogRef.close();
  }
}