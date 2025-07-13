import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

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

  userClaims: string[] = [];
  userPermissions: string[] = [];
  modulos: string[] = [];
  papeis: { id: string, description: string }[] = [];
  permissoesDisponiveis: string[] = [];
  permissoesFiltradas: string[] = [];

  moduloSelecionado: string = '';
  permissaoSelecionada: string = '';
  papelSelecionado: string = '';

  isLoadingClaims = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: UsuarioModel
  ) {}

  ngOnInit(): void {
    this.userId = this.data?.id;
    console.log('this.data?:', this.data);
    console.log('userId:', this.userId);

    this.form = this.fb.group({
      userName: [this.data?.userName || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [this.data?.phoneNumber || ''],
      password: ['', this.data ? [] : [Validators.required]],
      confirmPassword: ['']
    });
    if (this.userId) {
      this.carregarPermissoes(this.userId);
    }

    this.usuarioService.listarModulos().subscribe(m => this.modulos = m);
    this.usuarioService.listarPermissoesDisponiveis().subscribe(p => this.permissoesDisponiveis = p);
    this.usuarioService.listarPapeis().subscribe(p => this.papeis = p);
    console.log('modulos:', this.modulos);
    console.log('permissoesDisponiveis:', this.permissoesDisponiveis);
    console.log('papeis:', this.papeis);

  }

  salvar(): void {
    console.log('salvar:', this.form.invalid);
    console.log('salvar form:', this.form);
    console.log('salvar value:', this.form.value);
    if (this.form.invalid) return;

    const usuarioForm = this.form.value;

    const usuarioPayload: Partial<UsuarioModel> = {
      userName: usuarioForm.userName,
      email: usuarioForm.email,
      phoneNumber: usuarioForm.phoneNumber,
      password: usuarioForm.password, // ou renomear no DTO, se preferir
      roles: this.userRoles
    };

    if (this.data?.id) {
      this.usuarioService.atualizar(this.data.id, usuarioPayload).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => console.error('Erro ao atualizar usuário', err)
      });
    } else {
      this.usuarioService.criar(usuarioPayload).subscribe({
        next: (res) => this.dialogRef.close(res),
        error: (err) => console.error('Erro ao criar usuário', err)
      });
    }
  }

  fechar(): void {
    this.dialogRef.close();
  }

  carregarPermissoes(userId: string): void {
    this.isLoadingClaims = true;
    this.usuarioService.buscarPermissoesDoUsuario(userId).subscribe({
      next: (res) => {
        console.log('carregarPermissoes:', res);
        this.userPermissions = res;
        this.isLoadingClaims = false;
      },
      error: () => this.isLoadingClaims = false
    });
  }

  buscarClaimsDoUsuario(): void {
    if (!this.userId) return;

    this.isLoadingClaims = true;
    this.usuarioService.buscarClaimDoUsuario(this.userId).subscribe({
      next: (res) => {
        console.log('buscarClaimsDoUsuario:', res);
        this.userClaims = res;
        this.isLoadingClaims = false;
      },
      error: () => this.isLoadingClaims = false
    });
  }

  filtrarPermissoesPorModulo(): void {
    if (!this.moduloSelecionado) {
      this.permissoesFiltradas = [];
      return;
    }

    this.permissoesFiltradas = this.permissoesDisponiveis.filter(p =>
      p.startsWith(this.moduloSelecionado)
    );
  }


  adicionarModulo(): void {
    if (!this.userId || !this.moduloSelecionado) return;

    this.usuarioService.adicionarPermissao(this.userId, [this.moduloSelecionado]).subscribe(() => {
      this.userClaims.push(this.moduloSelecionado);
      this.moduloSelecionado = '';
    });
  }

  adicionarPapel(): void {
      console.log('adicionarPapel:', this.userId, this.papelSelecionado);
    if (!this.userId || !this.papelSelecionado) return;

    this.usuarioService.adicionarPermissao(this.userId, [this.papelSelecionado]).subscribe(() => {
      this.userRoles.push(this.papelSelecionado);
      this.papelSelecionado = '';
    });
  }

  adicionarClaim(): void {
      console.log('adicionarClaim:', this.userId, this.permissaoSelecionada);
    if (!this.userId || !this.permissaoSelecionada) return;

    this.usuarioService.adicionarClaim(this.userId, [this.permissaoSelecionada]).subscribe(() => {
      this.userClaims.push(this.permissaoSelecionada);
      this.permissaoSelecionada = '';
    });
  }

}
