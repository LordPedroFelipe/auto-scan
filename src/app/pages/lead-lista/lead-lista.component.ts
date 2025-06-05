import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeadService } from 'src/app/services/lead.service';
import { LeadModel } from 'src/app/models/lead.model';

@Component({
  selector: 'app-lead-lista',
  templateUrl: './lead-lista.component.html',
  styleUrls: ['./lead-lista.component.scss']
})
export class LeadListaComponent implements OnInit {
  leads: LeadModel[] = [];

  constructor(
    private leadService: LeadService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.carregarLeads();
  }

  carregarLeads(): void {
    this.leadService.listar().subscribe({
      next: (res) => this.leads = res,
      error: (err) => console.error('Erro ao carregar leads', err)
    });
  }

  excluir(id: string): void {
    if (confirm('Deseja realmente excluir este lead?')) {
      this.leadService.excluir(id).subscribe(() => this.carregarLeads());
    }
  }
}
