import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    private veiculoService: VeiculoService,
  ) {}

  ngOnInit(): void {
    const rotaFoto = this.route.snapshot.queryParamMap.get('foto');
    if (rotaFoto) {
      this.fotoVeiculoUrl = rotaFoto;
    }
    /*const valorVeiculoFixo = this.route.snapshot.queryParamMap.get('valor');
    if (valorVeiculoFixo) {
      this.valorVeiculoFixo = rotaFoto || '85000';
    }*/
    this.valorVeiculoFixo = '85000';
    this.vehicleId = this.route.snapshot.paramMap.get('vehicleId')!;

    if (this.vehicleId) {
      this.veiculoService.getVeiculoById(this.vehicleId).subscribe({
        next: (res: any) => {
          this.data = res;
          this.valorVeiculoFixo = this.data.price;

          this.form = this.fb.group({
            valorVeiculo: [{ value: this.valorVeiculoFixo, disabled: true }],
            valorEntrada: [null, [Validators.required, Validators.min(0)]],
            quantidadeParcelas: [null, Validators.required],
            taxaJuros: [1.5, [Validators.required, Validators.min(0)]], // em percentual
            valorParcela: [{ value: '', disabled: true }],
            nome: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            telefone: ['', Validators.required],
            dataNascimento: [null]
          });
        },
        error: (err: any) => console.error('Erro ao carregar veículo:', err)
      });
    } else {
      this.form = this.fb.group({
        valorVeiculo: [{ value: this.valorVeiculoFixo, disabled: true }],
        valorEntrada: [null, [Validators.required, Validators.min(0)]],
        quantidadeParcelas: [null, Validators.required],
        taxaJuros: [1.5, [Validators.required, Validators.min(0)]], // em percentual
        valorParcela: [{ value: '', disabled: true }],
        nome: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefone: ['', Validators.required],
        dataNascimento: [null]
      });
    }

    // Observa mudanças e recalcula valor da parcela
    this.form.get('valorEntrada')?.valueChanges.subscribe(() => this.calcularParcela());
    this.form.get('quantidadeParcelas')?.valueChanges.subscribe(() => this.calcularParcela());
    this.form.get('taxaJuros')?.valueChanges.subscribe(() => this.calcularParcela());
  }

  calcularParcela(): void {
    const valorVeiculo = this.valorVeiculoFixo;
    const entrada = this.form.get('valorEntrada')?.value;
    const parcelas = this.form.get('quantidadeParcelas')?.value;
    const taxa = this.form.get('taxaJuros')?.value;

    if (entrada >= 0 && parcelas && taxa >= 0) {
      const montante = Number(valorVeiculo) - entrada;
      const jurosDecimal = taxa / 100;
      const valorFinal = montante * (1 + jurosDecimal * parcelas);
      const valorParcela = valorFinal / parcelas;

      this.form.get('valorParcela')?.setValue(valorParcela.toFixed(2));
    }
  }

  buscarEndereco(): void {
    const cep = this.form.get('cep')?.value?.replace(/\D/g, '');

    if (cep && cep.length === 8) {
      this.http.get(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
        next: (res: any) => {
          if (res.erro) {
            console.warn('CEP não encontrado');
            return;
          }

          this.form.patchValue({
            rua: res.logradouro,
            bairro: res.bairro,
            cidade: res.localidade,
            estado: res.uf
          });
        },
        error: () => {
          console.error('Erro ao buscar endereço');
        }
      });
    }
  }

  async simular(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading = true;

    // Mock de simulação com atraso
    setTimeout(async () => {
      this.simulacaoConfirmada = true;
      this.isLoading = false;

      const formData = this.form.value;

      // Montar observações com dados da simulação
      const observacaoSimulacao = `
        Valor Veículo: R$ ${formData.valorVeiculo?.value}
        Entrada: R$ ${formData.valorEntrada}
        Parcelas: ${formData.quantidadeParcelas}x
        Juros: ${formData.taxaJuros}%
        Parcela Estimada: R$ ${formData.valorParcela?.value}
      `.trim();

      const novoLead = {
        name: formData.nome,
        email: formData.email,
        phone: formData.telefone,
        notes: observacaoSimulacao,
        shopId: '1ae44908-6f2e-49f9-a3e8-34be6f882084', // use seu shopId real
        // vehicleId: this.placa ?? '', // se estiver usando placa como ID do veículo
        birthDate: formData.dataNascimento,
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

    }, 1000);
  }

  imprimir(): void {
    window.print();
  }

  voltarInicio(): void {
    this.simulacaoConfirmada = false;

    // Reset preservando valor do veículo e taxa default
    this.form.reset();
    this.form.patchValue({
      valorVeiculo: this.valorVeiculoFixo,
      taxaJuros: 1.5
    });
  }
}
