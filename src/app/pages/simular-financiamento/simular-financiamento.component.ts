import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LeadModel } from 'src/app/models/lead.model';
import { AlertService } from 'src/app/services/alert.service';
import { LeadService } from 'src/app/services/lead.service';
import { VeiculoService } from 'src/app/services/veiculo.service';

@Component({
  selector: 'app-simular-financiamento',
  templateUrl: './simular-financiamento.component.html',
  styleUrls: ['./simular-financiamento.component.scss']
})
export class SimularFinanciamentoComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  simulacaoConfirmada = false;

  @Input() valorVeiculoFixo: string = '85000';
  @Input() fotoVeiculoUrl: string = '';

  placa: string = '';
  leadData: any = null;
  leadCapturado: boolean = false;
  vehicleId!: string;
  data?: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private leadService: LeadService,
    private alert: AlertService,
    private veiculoService: VeiculoService
  ) {}

  ngOnInit(): void {
    const rotaFoto = this.route.snapshot.queryParamMap.get('foto');
    if (rotaFoto) {
      this.fotoVeiculoUrl = rotaFoto;
    }

    this.valorVeiculoFixo = '85000';
    this.vehicleId = this.route.snapshot.paramMap.get('vehicleId')!;

    if (this.vehicleId) {
      this.veiculoService.getVeiculoById(this.vehicleId).subscribe({
        next: (res: any) => {
          this.data = res;
          this.valorVeiculoFixo = String(this.data?.price ?? '85000');
          this.buildForm();
          this.attachCalcListeners();
          this.calcularParcela(); // garante cálculo após carregar veículo
        },
        error: (err: any) => {
          console.error('Erro ao carregar veículo:', err);
          this.buildForm();
          this.attachCalcListeners();
          this.calcularParcela();
        }
      });
    } else {
      this.buildForm();
      this.attachCalcListeners();
      this.calcularParcela();
    }
  }

  /** Monta o form (sem listeners). */
  private buildForm(): void {
    this.form = this.fb.group({
      // Valores e condições
      valorVeiculo: [{ value: this.valorVeiculoFixo, disabled: true }],
      // entrada opcional: vazio => 0
      valorEntrada: [0, [Validators.min(0)]],
      quantidadeParcelas: [36, Validators.required],
      taxaJuros: [2, [Validators.required, Validators.min(0)]], // % ao mês
      valorParcela: [{ value: '', disabled: true }],

      // Dados pessoais
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      dataNascimento: [null],
      cpf: [null],
      cidade: [null]
    });
  }

  /** Registra os listeners de cálculo e já calcula na montagem. */
  private attachCalcListeners(): void {
    this.form.get('valorEntrada')?.valueChanges.subscribe(() => this.calcularParcela());
    this.form.get('quantidadeParcelas')?.valueChanges.subscribe(() => this.calcularParcela());
    this.form.get('taxaJuros')?.valueChanges.subscribe(() => this.calcularParcela());
  }

  /** Cálculo da parcela pela Tabela Price (PMT). */
  calcularParcela(): void {
    if (!this.form) return;

    const valorVeiculo = Number(this.valorVeiculoFixo) || 0;
    const entrada = Number(this.form.get('valorEntrada')?.value ?? 0) || 0;
    const parcelas = Number(this.form.get('quantidadeParcelas')?.value ?? 0) || 0;
    const taxaPerc = this.form.get('taxaJuros')?.value;
    const taxa = Number(taxaPerc ?? 0) / 100; // mensal

    const principal = Math.max(valorVeiculo - entrada, 0);

    // calcula assim que tiver o mínimo: principal >= 0, parcelas > 0, taxa >= 0
    if (parcelas > 0 && taxa >= 0) {
      const pmt =
        taxa === 0
          ? (principal > 0 ? principal / parcelas : 0)
          : (principal * taxa * Math.pow(1 + taxa, parcelas)) /
            (Math.pow(1 + taxa, parcelas) - 1);

      this.form.get('valorParcela')?.setValue(pmt.toFixed(2), { emitEvent: false });
    } else {
      this.form.get('valorParcela')?.setValue('', { emitEvent: false });
    }
  }

  buscarEndereco(): void {
    const cep = this.form.get('cep')?.value?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
        next: (res: any) => {
          if (res?.erro) return;
          this.form.patchValue({
            rua: res.logradouro,
            bairro: res.bairro,
            cidade: res.localidade,
            estado: res.uf
          });
        },
        error: () => console.error('Erro ao buscar endereço')
      });
    }
  }

  async simular(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    setTimeout(async () => {
      this.simulacaoConfirmada = true;
      this.isLoading = false;

      const formData = this.form.getRawValue();

      const observacaoSimulacao = `
        Valor Veículo: R$ ${formData.valorVeiculo}
        Entrada: R$ ${formData.valorEntrada}
        Parcelas: ${formData.quantidadeParcelas}x
        Juros: ${formData.taxaJuros}%
        Parcela Estimada: R$ ${formData.valorParcela}
      `.trim();

      const novoLead: LeadModel = {
        name: (formData.nome ?? '').trim(),
        email: (formData.email ?? '').trim(),
        phone: (formData.telefone ?? '').trim(),
        notes: observacaoSimulacao ?? '',
        shopId: '1ae44908-6f2e-49f9-a3e8-34be6f882084', // TODO: substituir pelo ID real da loja logada
        vehicleId: this.placa || null,
        status: 'New',
        hasBeenContacted: false,
        contactDate: new Date().toISOString(),
        lastContactDate: null,
        isActive: true,
        city: formData.cidade ?? null,
        comments: []
      };

      try {
        await this.leadService.criar(novoLead).toPromise();
        this.leadCapturado = true;
        this.leadData = novoLead;
        localStorage.setItem('leadData', JSON.stringify(novoLead));
        this.alert.showSuccess('Informações salvas com sucesso.');
      } catch (error) {
        this.alert.showError('Erro ao salvar o LEAD.');
      }
    }, 800);
  }

  imprimir(): void {
    window.print();
  }

  voltarInicio(): void {
    this.simulacaoConfirmada = false;
    this.form.reset({
      valorVeiculo: this.valorVeiculoFixo,
      valorEntrada: 0,
      quantidadeParcelas: 36,
      taxaJuros: 2,
      valorParcela: ''
    });
    this.calcularParcela();
  }
}
