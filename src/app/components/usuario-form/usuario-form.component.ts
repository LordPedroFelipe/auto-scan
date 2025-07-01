import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit {
  form!: FormGroup;
  userRoles: string[] = [];
  userId?: string;
  isLoadingRoles = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: UsuarioModel
  ) {}

  ngOnInit(): void {
    this.userId = this.data?.id;

    this.form = this.fb.group({
      userName: [this.data?.userName || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [this.data?.phoneNumber || ''],
      password: ['', this.data ? [] : [Validators.required]],
      confirmPassword: ['']
    });

    if (this.userId) {
      this.buscarPermissoes(this.userId);
    }
  }

  buscarPermissoes(userId: string): void {
    this.http.get<string[]>(`/api/Permissions/user/${userId}/roles`).subscribe({
      next: (res) => (this.userRoles = res),
      error: (err) => console.error('Erro ao buscar permissões', err)
    });
  }

  salvar(): void {
    if (this.form.valid) {
      this.dialogRef.close({ ...this.form.value, roles: this.userRoles });
    }
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
