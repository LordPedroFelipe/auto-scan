import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeadService } from 'src/app/services/lead.service';
import { LeadModel } from 'src/app/models/lead.model';
import { LeadDetalheModalComponent } from 'src/app/components/lead-detalhe-modal/lead-detalhe-modal.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-lead-lista',
  templateUrl: './lead-lista.component.html',
  styleUrls: ['./lead-lista.component.scss']
})
export class LeadListaComponent implements OnInit {
  leads: LeadModel[] = [];
  carregando = false;
  filtroForm!: FormGroup;

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;
  modoVisualizacao: 'cards' | 'tabela' = 'cards';
  displayedColumns: string[] = ['name', 'email', 'phone', 'acoes'];

  constructor(
    private fb: FormBuilder,
    private leadService: LeadService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      name: [''],
      email: [''],
      phone: ['']
    });

    this.carregarLeads();
  }

  carregarLeads(pageIndex: number = 0): void {
    this.carregando = true;

    const params = {
      pageNumber: pageIndex + 1,
      pageSize: this.pageSize,
      ...this.filtroForm.value
    };

    this.leadService.listarPaginadoComFiltro(params).subscribe({
      next: (res) => {
        this.leads = res.items;
        this.totalCount = res.totalCount;
        this.carregando = false;
      },
      error: () => (this.carregando = false)
    });
  }

  mudarPagina(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarLeads(this.pageIndex);
  }

  aplicarFiltros(): void {
    this.pageIndex = 0;
    this.carregarLeads();
  }

  limparFiltros(): void {
    this.filtroForm.reset();
    this.aplicarFiltros();
  }

  abrirCadastro(): void {
    /*const dialogRef = this.dialog.open(LeadFormModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.carregarLeads();
    });*/
  }

  editar(lead: LeadModel): void {
    /*const dialogRef = this.dialog.open(LeadFormModalComponent, {
      data: lead,
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.carregarLeads();
    });*/
  }

  abrirDetalhes(lead: LeadModel): void {
    this.dialog.open(LeadDetalheModalComponent, {
      data: lead,
      width: '600px'
    });
  }

  excluir(id: string | undefined): void {
    if (confirm('Deseja realmente excluir este lead?')) {
      this.leadService.excluir(id).subscribe(() => this.carregarLeads());
    }
  }

  alternarModo() {
    if (this.modoVisualizacao == 'cards') {
      this.modoVisualizacao = 'tabela';
    } else {
      this.modoVisualizacao = 'cards';      
    }
  }
}
