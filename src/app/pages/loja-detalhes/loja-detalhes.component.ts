import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  catchError,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
  takeUntil,
} from 'rxjs';

// Ajuste os tipos/serviços conforme seu projeto
type SortKey = 'recentes' | 'menor-preco' | 'maior-preco' | 'menor-km' | 'maior-ano';

export interface LojaDetalhe {
  id: string;
  name: string;
  logoUrl?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  rating?: number;
  openingHours?: string;
  description?: string;
}

export interface VeiculoResumo {
  id: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  mileage: number;
  color?: string;
  price: number;
  mainPhotoUrl?: string;
}

interface EstoqueResponse {
  items: VeiculoResumo[];
  total: number;
}

interface EstoqueState {
  loading: boolean;
  items: VeiculoResumo[];
  total: number;
  pageIndex: number;
  pageSize: number;
  termo: string;
  sort: SortKey;
  erro?: string;
}

import { EstoqueService } from 'src/app/services/estoque.service';
import { LojaService } from 'src/app/services/loja.service';

@Component({
  selector: 'app-loja-detalhes',
  templateUrl: './loja-detalhes.component.html',
  styleUrls: ['./loja-detalhes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LojaDetalhesComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject<void>();

  shopId!: string;
  loop = true;

  /** Estado/filtros do ESTOQUE */
  private pageIndex$ = new BehaviorSubject<number>(0);
  private pageSize$ = new BehaviorSubject<number>(12);
  private termo$     = new BehaviorSubject<string>('');
  private sort$      = new BehaviorSubject<SortKey>('recentes');
  private refreshEstoque$ = new BehaviorSubject<void>(undefined);

  /** Refresh separado da LOJA */
  private refreshLoja$ = new BehaviorSubject<void>(undefined);

  /** Fluxos expostos ao template */
  loja$         = of<LojaDetalhe | null>(null);
  estoqueState$ = of<EstoqueState>({
    loading: true, items: [], total: 0, pageIndex: 0, pageSize: 12, termo: '', sort: 'recentes',
  });

  /** VM combinada (opcional) — útil se quiser um único async no template */
  vm$ = of({
    loja: null as LojaDetalhe | null,
    estoque: [] as VeiculoResumo[],
    total: 0,
    pageIndex: 0,
    pageSize: 12,
    termo: '',
    sort: 'recentes' as SortKey,
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estoqueService: EstoqueService,
    private lojaService: LojaService
  ) {}

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('shopId') || '';

    this.loja$ = this.loadLoja().pipe(shareReplay(1));
    this.estoqueState$ = this.loadEstoque().pipe(shareReplay(1));

    // VM combinada: NÃO bloqueia carros se a loja vier null
    this.vm$ = combineLatest([this.loja$, this.estoqueState$]).pipe(
      map(([loja, est]) => ({
        loja,
        estoque: est.items,
        total: est.total,
        pageIndex: est.pageIndex,
        pageSize: est.pageSize,
        termo: est.termo,
        sort: est.sort,
      })),
      takeUntil(this.destroyed$)
    );
  }

  /** -------- LOJA (independente) -------- */
  private loadLoja() {
    return this.refreshLoja$.pipe(
      switchMap(() =>
        this.lojaService.buscarPorId(this.shopId).pipe(
          catchError(() => of<LojaDetalhe | null>(null))
        )
      ),
      takeUntil(this.destroyed$)
    );
  }

  /** -------- ESTOQUE (independente) -------- */
  private loadEstoque() {
    const params$ = combineLatest([
      this.pageIndex$,
      this.pageSize$,
      this.termo$,
      this.sort$,
      this.refreshEstoque$,
    ]);

    return params$.pipe(
      switchMap(([pageIndex, pageSize, termo, sort]) =>
        this.estoqueService.getByShop(this.shopId, {
          pageNumber: pageIndex + 1,
          pageSize,
          search: termo || undefined,
          sort: this.mapSort(sort),
        }).pipe(
          map((resp: any) => ({
            loading: false,
            items: resp.items ?? [],
            total: resp.totalCount ?? 0,
            pageIndex,
            pageSize,
            termo,
            sort,
          })),
          catchError(() =>
            of<EstoqueState>({
              loading: false,
              items: [],
              total: 0,
              pageIndex,
              pageSize,
              termo,
              sort,
              erro: 'Falha ao carregar estoque.',
            })
          )
        )
      ),
      takeUntil(this.destroyed$)
    );
  }

  /** -------- MAPEAMENTO DE ORDENAÇÃO -------- */
  private mapSort(sort: SortKey): string | undefined {
    switch (sort) {
      case 'menor-preco': return 'price_asc';
      case 'maior-preco': return 'price_desc';
      case 'menor-km':    return 'mileage_asc';
      case 'maior-ano':   return 'year_desc';
      case 'recentes':
      default:            return 'created_desc';
    }
  }

  /** -------- Handlers de UI (estoque) -------- */
  onSearchChange(value: any) {
    this.pageIndex$.next(0);
    this.termo$.next((value ?? '').trim());
  }
  onSortChange(value: SortKey) {
    this.pageIndex$.next(0);
    this.sort$.next(value);
  }
  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pageIndex$.next(event.pageIndex);
    this.pageSize$.next(event.pageSize);
  }
  refreshLoja()   { this.refreshLoja$.next(); }
  refreshEstoque(){ this.refreshEstoque$.next(); }

  /** -------- Ações -------- */
  abrirDetalheVeiculo(v: VeiculoResumo) {
    this.router.navigate(['/vehicle', v.id]);
  }
  simularFinanciamento(v: VeiculoResumo) {
    // this.router.navigate(['/simular-financiamento'], { queryParams: { vehicleId: v.id } });
    this.router.navigate(['/simular-financiamento', v.id]);
  }
  agendarTestDrive(v: VeiculoResumo) {
    this.router.navigate(['/testdrive', v.id]);
  }
  falarComChatIA(v?: VeiculoResumo) {
    this.router.navigate(['/atendimento'], { queryParams: { shopId: this.shopId, vehicleId: v?.id } });
  }

  trackByVeiculo = (_: number, v: VeiculoResumo) => v.id;

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

}
