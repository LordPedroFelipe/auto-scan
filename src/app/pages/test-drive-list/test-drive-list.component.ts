import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TestDrive } from 'src/app/models/test-drive.model';
import { TestDriveService } from 'src/app/services/test-drive.service';

@Component({
  selector: 'app-test-drive-list',
  templateUrl: './test-drive-list.component.html',
  styleUrls: ['./test-drive-list.component.scss']
})
export class TestDriveListComponent implements OnInit {
  filtrosForm: FormGroup;
  testDrives: TestDrive[] = [];
  totalCount = 0;
  pageSize = 10;
  pageIndex = 0;
  carregando = false;
  modoVisualizacao: 'cards' | 'tabela' = 'cards';

  displayedColumns: string[] = ['customerName', 'vehicleModel', 'preferredDate', 'acoes'];

  constructor(
    private fb: FormBuilder,
    private service: TestDriveService
  ) {
    this.filtrosForm = this.fb.group({
      customerName: [''],
      customerEmail: [''],
      customerPhone: [''],
      vehicleBrand: [''],
      vehicleModel: ['']
    });
  }

  ngOnInit(): void {
    this.buscar();
  }

  buscar(page: number = 1): void {
    const filtros = this.filtrosForm.value;
    const params = {
      ...filtros,
      pageNumber: page,
      pageSize: this.pageSize
    };

    this.carregando = true;
    this.service.listar(params).subscribe({
      next: (res) => {
        this.testDrives = res.items;
        this.totalCount = res.totalCount;
        this.pageIndex = res.pageNumber - 1;
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  resetar(): void {
    this.filtrosForm.reset();
    this.buscar(1);
  }

  mudarPagina(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscar(this.pageIndex + 1);
  }

  alternarModo(): void {
    this.modoVisualizacao = this.modoVisualizacao === 'tabela' ? 'cards' : 'tabela';
  }

  abrirCadastro(): void {
    // lógica de edição futura
  }

  abrirDetalhes(testDrive: TestDrive): void {
    // lógica de edição futura
  }

  editar(testDrive: TestDrive): void {
    // lógica de edição futura
  }

  excluir(id: string): void {
    if (confirm('Deseja realmente excluir este Test Drive?')) {
      // lógica de exclusão futura
    }
  }
}
