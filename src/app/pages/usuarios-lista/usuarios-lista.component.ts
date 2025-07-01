import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { UsuarioFormComponent } from 'src/app/components/usuario-form/usuario-form.component';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.scss']
})
export class UsuariosListaComponent {
  usuarios: UsuarioModel[] = [];
  displayedColumns = ['userName', 'email', 'phoneNumber', 'acoes'];
  
  carregando = false;
  filtroForm!: FormGroup;

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;
  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(pageIndex: number = 0): void {
    this.usuarioService.listar().subscribe({
      next: (res) => this.usuarios = res,
      error: (err) => console.error('Erro ao carregar usuários', err)
    });
  }

  abrirCadastro(): void {
    const dialogRef = this.dialog.open(UsuarioFormComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.criar(result).subscribe(() => this.carregarUsuarios());
      }
    });
  }

  editar(usuario: UsuarioModel): void {
    const dialogRef = this.dialog.open(UsuarioFormComponent, {
      width: '400px',
      data: usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioService.atualizar(usuario.id, result).subscribe(() => this.carregarUsuarios());
      }
    });
  }

  excluir(id: string): void {
    if (confirm('Deseja realmente excluir este usuário?')) {
      this.usuarioService.excluir(id).subscribe(() => this.carregarUsuarios());
    }
  }
  
    mudarPagina(event: PageEvent) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.carregarUsuarios(this.pageIndex);
    }
}
