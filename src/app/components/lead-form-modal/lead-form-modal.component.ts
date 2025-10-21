import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstoqueService } from 'src/app/services/estoque.service';

// Ajuste os paths conforme seu projeto:
import { LeadService } from 'src/app/services/lead.service';
import { LojaService } from 'src/app/services/loja.service';

type LeadDto = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  contactDate?: string | Date | null;
  lastContactDate?: string | Date | null;
  notes?: string;
  status: 'New' | 'InProgress' | 'Contacted' | 'Won' | 'Lost';
  hasBeenContacted: boolean;
  shopId?: string | null;
  shopName?: string | null;
  vehicleId?: string | null;
  vehicleName?: string | null;
  createdById?: string | null;
  createdByName?: string | null;
  lastUpdatedById?: string | null;
  lastUpdatedByName?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  isActive: boolean;
  city?: string;
  dateBirthday?: string;
  document?: string;
};

@Component({
  selector: 'app-lead-form-modal',
  templateUrl: './lead-form-modal.component.html',
  styleUrls: ['./lead-form-modal.component.scss']
})
export class LeadFormModalComponent implements OnInit {
  form: FormGroup;
  isEdicao = false;
  abaSelecionada = 0;

  // Opções para selects/autocomplete (simuladas; plugue seus services)
  statusOptions: LeadDto['status'][] = ['New', 'InProgress', 'Contacted', 'Won', 'Lost'];

  lojas: { id: string; name: string }[] = [];
  lojasFiltradas: { id: string; name: string }[] = [];

  veiculos: { id: string; name: string }[] = [];
  veiculosFiltrados: { id: string; name: string }[] = [];

  constructor(
    public dialogRef: MatDialogRef<LeadFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<LeadDto> | null,
    private fb: FormBuilder,
    private leadService: LeadService,
    private estoqueService: EstoqueService,
    private lojaService: LojaService
  ) {
    this.isEdicao = !!data?.id;

    this.form = this.fb.group({
      // Dados principais
      id: [data?.id || null],
      name: [data?.name || '', [Validators.required, Validators.minLength(3)]],
      phone: [data?.phone || '', [Validators.required]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      isActive: [data?.isActive ?? true],

      // Contato & Status
      status: [data?.status || 'New', Validators.required],
      hasBeenContacted: [data?.hasBeenContacted ?? false],
      contactDate: [data?.contactDate ?? null],
      lastContactDate: [data?.lastContactDate ?? null],
      notes: [data?.notes || ''],

      // Vínculos
      shopId: [data?.shopId || null],
      shopName: [data?.shopName || ''],
      vehicleId: [data?.vehicleId || null],
      vehicleName: [data?.vehicleName || ''],

      // Auditoria (somente leitura na UI)
      createdById: [{ value: data?.createdById || null, disabled: true }],
      createdByName: [{ value: data?.createdByName || null, disabled: true }],
      lastUpdatedById: [{ value: data?.lastUpdatedById || null, disabled: true }],
      lastUpdatedByName: [{ value: data?.lastUpdatedByName || null, disabled: true }],
      createdAt: [{ value: data?.createdAt || null, disabled: true }],
      updatedAt: [{ value: data?.updatedAt || null, disabled: true }],
      city: [{ value: data?.city || null }],
      dateBirthday: [{ value: data?.dateBirthday || null }],
      document: [{ value: data?.document || null }]
    });
  }

  ngOnInit(): void {
    // Carregar opções reais de loja/veículo via services aqui
    this.lojaService.listar().subscribe(res => this.lojas = res);

    this.estoqueService.listarAtivosSimples().subscribe((veiculos: any) => {
      // console.log(' veiculos ', veiculos);
      this.veiculos = veiculos.map((v: any) => ({
        id: v.id,
        label: `${v.description}`,
        name: `${v.description}`
      }));
      console.log(' this.veiculos ', this.veiculos);
      this.veiculosFiltrados = [...this.veiculos];
    });


    // Simulação (remova ao integrar):
    /*this.lojas = [
      { id: '111', name: 'AutoScan Joinville' },
      { id: '222', name: 'AutoScan Balneário' },
      { id: '333', name: 'AutoScan Floripa' }
    ];
    this.veiculos = [
      { id: 'AAA', name: 'Mercedes GLA 200 2018' },
      { id: 'BBB', name: 'Fiat Cronos 2023' },
      { id: 'CCC', name: 'Chevrolet Onix 2022' }
    ];*/

    this.lojasFiltradas = [...this.lojas];
  }

  // ------ Autocomplete Loja ------
  filtrarLojas(valor: string) {
    const q = (valor || '').toLowerCase();
    this.lojasFiltradas = this.lojas.filter(x => x.name.toLowerCase().includes(q));
  }

  lojaSelecionada(event: any) {
    const name = event.option.value as string;
    const found = this.lojas.find(x => x.name === name);
    this.form.patchValue({
      shopId: found?.id ?? null,
      shopName: name
    });
  }

  limparLoja() {
    this.form.patchValue({ shopId: null, shopName: '' });
  }

  // ------ Autocomplete Veículo ------
  filtrarVeiculos(valor: string) {
    const q = (valor || '').toLowerCase();
    this.veiculosFiltrados = this.veiculos.filter(x => x.name.toLowerCase().includes(q));
  }

  veiculoSelecionado(event: any) {
    const name = event.option.value as string;
    const found = this.veiculos.find(x => x.name === name);
    this.form.patchValue({
      vehicleId: found?.id ?? null,
      vehicleName: name
    });
  }

  limparVeiculo() {
    this.form.patchValue({ vehicleId: null, vehicleName: '' });
  }

  // ------ Persistência ------
  salvar(): void {
    const raw = this.form.getRawValue();
    const payload: LeadDto = {
      id: raw.id ?? undefined,
      name: raw.name,
      phone: raw.phone,
      email: raw.email,
      contactDate: raw.contactDate,
      lastContactDate: raw.lastContactDate,
      notes: raw.notes,
      status: raw.status,
      hasBeenContacted: raw.hasBeenContacted,
      shopId: raw.shopId ?? null,
      shopName: raw.shopName ?? null,
      vehicleId: raw.vehicleId ?? null,
      vehicleName: raw.vehicleName ?? null,
      isActive: raw.isActive,
      city: raw.city ?? null,
      dateBirthday: raw.dateBirthday ?? null,
      document: raw.document ?? null
    };

    if (this.isEdicao && payload.id) {
      this.leadService.atualizar(payload.id, payload).subscribe({
        next: (result) => this.dialogRef.close(result),
        error: (err) => console.error('Erro ao atualizar lead:', err)
      });
    } else {
      // Remover id no create
      delete (payload as any).id;
      this.leadService.criar(payload).subscribe({
        next: (result) => this.dialogRef.close(result),
        error: (err) => console.error('Erro ao criar lead:', err)
      });
    }
  }

  fechar(): void {
    this.dialogRef.close();
  }

  // Helpers UI
  get f() { return this.form.controls; }
}
