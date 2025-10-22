import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

/** Tipagens auxiliares para papéis/roles */
type RoleItem = { id: string; name?: string; description?: string };

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit {
  form!: FormGroup;
  userId?: string;

  // loading flags
  isSavingUser = false;
  isSavingRole = false;
  isSavingClaim = false;
  isLoadingClaims = false;
  isLoadingPermissionsByRole = false;

  // catálogos
  modulos: string[] = [];
  papeis: RoleItem[] = [];
  permissoesDisponiveis: string[] = [];

  // estado dos selects
  moduloSelecionado = '';
  permissaoSelecionada = '';
  papelSelecionadoId = '';

  // do usuário
  userRoles: RoleItem[] = [];
  userClaims: string[] = [];
  userPermissions: string[] = []; // permissões herdadas por papel (se a sua API expuser)

  permissoesFiltradas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: UsuarioModel
  ) {}

  ngOnInit(): void {
    this.userId = this.data?.id;

    this.form = this.fb.group(
      {
        userName: [this.data?.userName || '', Validators.required],
        email: [this.data?.email || '', [Validators.required, Validators.email]],
        phoneNumber: [this.data?.phoneNumber || ''],
        password: ['', this.data ? [] : [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['']
      },
      { validators: this.passwordMatchValidator }
    );

    // catálogos básicos
    this.usuarioService.listarModulos().subscribe(m => (this.modulos = m || []));
    this.usuarioService.listarPermissoesDisponiveis().subscribe(p => (this.permissoesDisponiveis = p || []));
    this.usuarioService.listarPapeis().subscribe(p => (this.papeis = p || []));

    // carga dos dados do usuário (roles, claims e permissões herdadas)
    if (this.userId) {
      this.recarregarTudoDoUsuario();
    }
  }

  // =================== Validadores ===================
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!pass && !confirm) return null; // no edit mode
    return pass === confirm ? null : { passwordMismatch: true };
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

  // =================== Papéis ===================
  adicionarPapel(): void {
    if (!this.userId || !this.papelSelecionadoId) return;
    this.isSavingRole = true;

    // Preferível: usar um endpoint específico de roles
    // Se não existir, ajuste seu UsuarioService conforme abaixo.
    this.usuarioService.adicionarPermissao(this.userId, [this.papelSelecionadoId])
      .pipe(finalize(() => (this.isSavingRole = false)))
      .subscribe({
        next: () => {
          this.papelSelecionadoId = '';
          // 1) recarrega lista de papéis do usuário
          this.carregarRolesDoUsuario();
          // 2) opcional: recarrega permissões herdadas
          this.carregarPermissoesHerdadasPorPapel();
        },
        error: (e) => console.error('Erro ao atribuir papel', e)
      });
  }

  removerPapel(role: RoleItem | string): void {
    if (!this.userId) return;
    const roleId = typeof role === 'string' ? role : (role.id || role.name);
    if (!roleId) return;

    this.isSavingRole = true;
    /*this.usuarioService.removerRole(this.userId, roleId)
      .pipe(finalize(() => (this.isSavingRole = false)))
      .subscribe({
        next: () => {
          this.carregarRolesDoUsuario();
          this.carregarPermissoesHerdadasPorPapel();
        },
        error: (e) => console.error('Erro ao remover papel', e)
      });*/
  }

  private carregarRolesDoUsuario(): void {
    if (!this.userId) return;
    this.usuarioService.buscarPermissoesDoUsuario(this.userId).subscribe({
      next: (roles) => (this.userRoles = roles || []),
      error: (e) => console.error('Erro ao listar roles do usuário', e)
    });
  }

  // =================== Claims Diretas (Módulos/Permissões) ===================
  filtrarPermissoesPorModulo(): void {
    if (!this.moduloSelecionado) {
      this.permissoesFiltradas = [];
      return;
    }
    this.permissoesFiltradas = (this.permissoesDisponiveis || []).filter(p => p.startsWith(this.moduloSelecionado));
  }

  adicionarClaim(): void {
    if (!this.userId || !this.permissaoSelecionada) return;
    this.isSavingClaim = true;

    this.usuarioService.adicionarClaim(this.userId, [this.permissaoSelecionada])
      .pipe(finalize(() => (this.isSavingClaim = false)))
      .subscribe({
        next: () => {
          this.permissaoSelecionada = '';
          this.buscarClaimsDoUsuario();
        },
        error: (e) => console.error('Erro ao adicionar claim', e)
      });
  }

  removerClaim(claim: string): void {
    if (!this.userId || !claim) return;
    this.isLoadingClaims = true;

    /*this.usuarioService.removerClaim(this.userId, claim)
      .pipe(finalize(() => (this.isLoadingClaims = false)))
      .subscribe({
        next: () => this.buscarClaimsDoUsuario(),
        error: (e) => console.error('Erro ao remover claim', e)
      });*/
  }

  buscarClaimsDoUsuario(): void {
    if (!this.userId) return;
    this.isLoadingClaims = true;

    this.usuarioService.buscarClaimDoUsuario(this.userId)
      .pipe(finalize(() => (this.isLoadingClaims = false)))
      .subscribe({
        next: (res) => (this.userClaims = res || []),
        error: () => (this.userClaims = [])
      });
  }

  // =================== Permissões herdadas por papel (opcional) ===================
  private carregarPermissoesHerdadasPorPapel(): void {
    if (!this.userId) {
      this.userPermissions = [];
      return;
    }
    this.isLoadingPermissionsByRole = true;
    // Se já tem esse endpoint: buscarPermissoesDoUsuario (herdadas)
    this.usuarioService.buscarPermissoesDoUsuario(this.userId)
      .pipe(finalize(() => (this.isLoadingPermissionsByRole = false)))
      .subscribe({
        next: (perms) => (this.userPermissions = perms || []),
        error: () => (this.userPermissions = [])
      });
  }

  // =================== Carga geral ===================
  private recarregarTudoDoUsuario(): void {
    this.carregarRolesDoUsuario();
    this.buscarClaimsDoUsuario();
    this.carregarPermissoesHerdadasPorPapel();
  }
}
