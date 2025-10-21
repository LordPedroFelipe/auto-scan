import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { LeadDetalheModalComponent } from 'src/app/components/lead-detalhe-modal/lead-detalhe-modal.component';
import { LeadFormModalComponent } from 'src/app/components/lead-form-modal/lead-form-modal.component';
import { LeadModel } from 'src/app/models/lead.model';
import { LeadService } from 'src/app/services/lead.service';

// CDK drag-drop
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

type KanbanStatus = 'New' | 'InProgress' | 'Contacted' | 'Won' | 'Lost';

@Component({
  selector: 'app-lead-lista',
  templateUrl: './lead-lista.component.html',
  styleUrls: ['./lead-lista.component.scss']
})
export class LeadListaComponent implements OnInit {
  // ====== Estado geral/lista ======
  leads: LeadModel[] = [];
  carregando = false;
  filtroForm!: FormGroup;

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;
  modoVisualizacao: 'cards' | 'tabela' = 'cards';
  displayedColumns: string[] = ['name', 'email', 'phone', 'acoes'];
  connectedDropLists: string[] = []; // <— add

  // ====== Abas ======
  // 0 -> Lista, 1 -> Kanban
  abaIndex = 0;

  // ====== Kanban ======
  // Definições de colunas e rótulos
  statuses: { key: KanbanStatus; label: string }[] = [
    { key: 'New',         label: 'Novo' },
    { key: 'InProgress',  label: 'Em andamento' },
    { key: 'Contacted',   label: 'Contactado' },
    { key: 'Won',         label: 'Convertido' },
    { key: 'Lost',        label: 'Perdido' },
  ];

  // Mapa de colunas -> array de leads
  kanbanMap: Record<KanbanStatus, LeadModel[]> = {
    New: [],
    InProgress: [],
    Contacted: [],
    Won: [],
    Lost: [],
  };

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

    this.connectedDropLists = this.statuses.map(s => 'list-' + s.key);
    this.carregarLeads();
  }

  // ====== Dados ======
  carregarLeads(pageIndex: number = 0): void {
    this.carregando = true;

    const params = {
      pageNumber: pageIndex + 1,
      pageSize: this.pageSize,
      ...this.filtroForm.value
    };

    this.leadService.listarPaginadoComFiltro(params).subscribe({
      next: (res) => {
        this.leads = res.items ?? [];
        this.totalCount = res.totalCount ?? this.leads.length;
        this.rebuildKanbanFromLeads();
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  private rebuildKanbanFromLeads(): void {
    // limpa colunas
    (Object.keys(this.kanbanMap) as KanbanStatus[]).forEach(k => this.kanbanMap[k] = []);
    // distribui
    for (const l of this.leads) {
      const k = (l.status as KanbanStatus) || 'New';
      if (!this.kanbanMap[k]) this.kanbanMap[k] = [];
      this.kanbanMap[k].push(l);
    }
  }

  private syncLeadStatusInArray(leadId: string | undefined, newStatus: KanbanStatus) {
    if (!leadId) return;
    const idx = this.leads.findIndex(l => l.id === leadId);
    if (idx >= 0) this.leads[idx] = { ...this.leads[idx], status: newStatus };
  }

  // ====== Filtros/Paginação ======
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

  // ====== Ações ======
  abrirCadastro(): void {
    const dialogRef = this.dialog.open(LeadFormModalComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.carregarLeads(this.pageIndex);
    });
  }

  editar(lead: LeadModel): void {
    const dialogRef = this.dialog.open(LeadFormModalComponent, {
      data: lead,
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.carregarLeads(this.pageIndex);
    });
  }

  abrirDetalhes(lead: LeadModel): void {
    this.dialog.open(LeadDetalheModalComponent, {
      data: lead,
      width: '600px'
    });
  }

  excluir(id: string | undefined): void {
    if (!id) return;
    if (confirm('Deseja realmente excluir este lead?')) {
      this.leadService.excluir(id).subscribe(() => this.carregarLeads(this.pageIndex));
    }
  }

  alternarModo() {
    this.modoVisualizacao = this.modoVisualizacao === 'cards' ? 'tabela' : 'cards';
  }

  // ====== Kanban: Drag & Drop ======
  onDrop(event: CdkDragDrop<LeadModel[]>) {
    // console.log('onDrop fired:', event.container.data, event.previousIndex, event.currentIndex, event.previousContainer, event.container);
    const destinoId = event.container.id || '';                 // ex.: "list-InProgress"
    const novoStatus = destinoId.replace('list-', '') as KanbanStatus;

    // containers diferentes -> transferir
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // item movido (agora no container alvo)
    const moved = event.container.data[event.currentIndex];
    const movedId = moved?.id;
    // console.log('moved:', movedId, '->', novoStatus);

    if (moved && movedId) {
      moved.status = novoStatus;
      this.syncLeadStatusInArray(movedId, novoStatus);
      this.atualizarStatusNoServidor(movedId, novoStatus);
    }
  }

  private atualizarStatusNoServidor(id: string | undefined, status: KanbanStatus) {
    // console.log('Atualizando status no servidor:', id, status);
    if (!id) return;
    // Ajuste conforme sua API: se houver atualizarStatus, use-a.
    // Aqui uso um update parcial genérico:
    this.leadService.buscarPorId(id).subscribe(orig => {
      const payload: LeadModel = { ...orig, status };
      this.leadService.atualizar(id, payload).subscribe({
        next: () => {},
        error: (err) => {
          console.error('Erro ao atualizar status', err);
          this.carregarLeads(this.pageIndex);
        }
      });
    });
  }
}
