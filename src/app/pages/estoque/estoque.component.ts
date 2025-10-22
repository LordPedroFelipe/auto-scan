import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { VeiculoResponse, VeiculoResumoModel } from 'src/app/models/veiculo.model';
import { AuthService } from 'src/app/services/auth.service';
import { CadastroVeiculoModalComponent } from '../../components/cadastro-veiculo-modal/cadastro-veiculo-modal.component';
import { DetalhesVeiculosModalComponent } from '../../components/detalhes-veiculos-modal/detalhes-veiculos-modal.component';
import { Veiculo } from '../../models/veiculo';
import { EstoqueService } from '../../services/estoque.service';
import { LojaService } from '../../services/loja.service';

type KV = { key: string; count: number };

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss']
})
export class EstoqueComponent implements OnInit, OnDestroy {
  // dados
  veiculos: VeiculoResumoModel[] = [];
  carregando = false;

  // filtros
  filtroForm!: FormGroup;
  hasShopId = false;
  shops$ = this.lojaService.listar();

  // abas
  selectedTab = 0;

  // tabela
  displayedColumnsTable: string[] = ['foto', 'veiculo', ...(this.hasShopId ? [] : ['loja']), 'local', 'km', 'preco', 'acoes'];

  // paginação
  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;

  // análises
  analytics = {
    avgPrice: 0,
    avgKm: 0,
    avgAge: 0,
    byCategory: [] as KV[],
    byShop: [] as KV[],
    topCities: [] as KV[],
    byCityState: [] as KV[]
  };

  private destroy$ = new Subject<void>();
  private autoApply$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private estoqueService: EstoqueService,
    private dialog: MatDialog,
    public authService: AuthService,
    private lojaService: LojaService
  ) {}

  ngOnInit(): void {
    const shopIdAuth = this.authService.getShopId();
    this.hasShopId = !!shopIdAuth;

    // ajustar colunas da tabela considerando shopId
    this.displayedColumnsTable = ['foto', 'veiculo', ...(this.hasShopId ? [] : ['loja']), 'local', 'km', 'preco', 'acoes'];

    // form de filtros
    this.filtroForm = this.fb.group({
      shopId: [this.hasShopId ? '' : ''],
      q: [''],
      brand: [''],
      model: [''],
      version: [''],
      color: [''],
      transmission: [''],
      fuelType: [''],
      condition: [''],
      categoryType: [''],
      city: [''],
      state: [''],
      minYear: [''],
      maxYear: [''],
      minMileage: [''],
      maxMileage: [''],
      minPrice: [''],
      maxPrice: [''],
      ownersCountMin: [''],
      ownersCountMax: [''],
      hasAuction: [false],
      hasAccident: [false],
      isFirstOwner: [false],
      isOnOffer: [false],
      isHighlighted: [false],
      isSold: [false]
    });

    // auto-aplicar
    this.filtroForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0;
        this.autoApply$.next();
      });

    this.autoApply$
      .pipe(
        tap(() => (this.carregando = true)),
        switchMap(() => this.listar(this.pageIndex)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => this.applyResponse(res),
        error: () => (this.carregando = false)
      });

    // carga inicial
    this.carregarVeiculos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildParams(pageIndex: number) {
    const raw = this.filtroForm.value || {};
    const base = { pageNumber: pageIndex + 1, pageSize: this.pageSize };
    const clean: any = {};
    Object.entries(raw).forEach(([k, v]) => {
      if (typeof v === 'boolean') {
        if (v) clean[k] = true;
      } else if (v !== null && v !== undefined && v !== '') {
        clean[k] = v;
      }
    });
    return { ...base, ...clean };
  }

  private listar(pageIndex: number) {
    const params = this.buildParams(pageIndex);
    return this.estoqueService.listarPaginadoComFiltro(params);
  }

  private applyResponse(res: VeiculoResponse) {
    this.veiculos = res.items || [];
    this.totalCount = res.totalCount || 0;
    this.rebuildAnalytics();
    this.carregando = false;
  }

  private rebuildAnalytics() {
    const arr = this.veiculos || [];
    const now = new Date().getFullYear();

    const sum = (a: number, b: number) => a + b;
    const safe = (n: any, d = 0) => (typeof n === 'number' && !isNaN(n) ? n : d);

    const prices = arr.map(v => safe(v.price));
    const kms = arr.map(v => safe(v.mileage));
    const ages = arr.map(v => Math.max(0, now - safe(v.year)));

    const avg = (xs: number[]) => (xs.length ? xs.reduce(sum, 0) / xs.length : 0);

    this.analytics.avgPrice = Math.round(avg(prices));
    this.analytics.avgKm = Math.round(avg(kms));
    this.analytics.avgAge = Math.round(avg(ages) * 10) / 10;

    this.analytics.byCategory = this.groupCount(arr, v => v.categoryType || '');
    this.analytics.byShop = this.groupCount(arr, v => v.shopName || '');
    const byCity = this.groupCount(arr, v => v.city || '');
    this.analytics.topCities = [...byCity].sort((a,b)=>b.count-a.count).slice(0,8);

    // city + state para o "mapa" mvp
    this.analytics.byCityState = this.groupCount(arr, v => [v.city||'', v.state||''].filter(Boolean).join('/') || '—');
  }

  private groupCount<T>(arr: T[], keyFn: (x: T)=>string): KV[] {
    const map = new Map<string, number>();
    for (const item of arr) {
      const k = keyFn(item);
      map.set(k, (map.get(k) || 0) + 1);
    }
    return Array.from(map.entries()).map(([key, count]) => ({ key, count }));
  }

  carregarVeiculos(pageIndex: number = 0) {
    this.carregando = true;
    this.listar(pageIndex).subscribe({
      next: (res) => this.applyResponse(res),
      error: () => (this.carregando = false)
    });
  }

  mudarPagina(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarVeiculos(this.pageIndex);
  }

  aplicarFiltros() {
    this.pageIndex = 0;
    this.carregarVeiculos(this.pageIndex);
  }

  limparFiltros() {
    const keepShopId = this.hasShopId ? {} : { shopId: '' };
    this.filtroForm.reset({
      ...keepShopId,
      q: '',
      brand: '',
      model: '',
      version: '',
      color: '',
      transmission: '',
      fuelType: '',
      condition: '',
      categoryType: '',
      city: '',
      state: '',
      minYear: '',
      maxYear: '',
      minMileage: '',
      maxMileage: '',
      minPrice: '',
      maxPrice: '',
      ownersCountMin: '',
      ownersCountMax: '',
      hasAuction: false,
      hasAccident: false,
      isFirstOwner: false,
      isOnOffer: false,
      isHighlighted: false,
      isSold: false
    });
    this.aplicarFiltros();
  }

  abrirCadastro(veiculo?: Veiculo) {
    const dialogRef = this.dialog.open(CadastroVeiculoModalComponent, {
      data: veiculo || null,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        veiculo ? this.estoqueService.editar(result).subscribe(() => this.aplicarFiltros())
                : this.estoqueService.adicionar(result).subscribe(() => this.aplicarFiltros());
      }
    });
  }

  abrirDetalhes(veiculo: VeiculoResumoModel) {
    this.dialog.open(DetalhesVeiculosModalComponent, {
      data: veiculo,
      width: '600px'
    });
  }

  excluir(id: string) {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      this.estoqueService.excluir(id).subscribe(() => this.aplicarFiltros());
    }
  }

  // === helpers para a aba Mapa (MVP) ===
  bubbleSizeClass(count: number) {
    if (count >= 12) return 'dot-lg';
    if (count >= 5) return 'dot-md';
    return 'dot-sm';
  }
}
