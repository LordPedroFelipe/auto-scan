import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const rotaFoto = this.route.snapshot.queryParamMap.get('foto');
    if (rotaFoto) {
      this.fotoVeiculoUrl = rotaFoto;
    }
    const valorVeiculoFixo = this.route.snapshot.queryParamMap.get('valor');
    if (valorVeiculoFixo) {
      this.valorVeiculoFixo = rotaFoto || '85000';
    }

    this.form = this.fb.group({
      valorVeiculo: [{ value: this.valorVeiculoFixo, disabled: true }],
      valorEntrada: [null, [Validators.required, Validators.min(0)]],
      quantidadeParcelas: [null, Validators.required],
      taxaJuros: [1.5, [Validators.required, Validators.min(0)]], // em percentual
      valorParcela: [{ value: '', disabled: true }],
      nomeCompleto: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      rua: [''],
      numero: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    });

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

  simular(): void {
    if (this.form.invalid) return;

    this.isLoading = true;

    // Simulação fake (mock delay)
    setTimeout(() => {
      this.simulacaoConfirmada = true;
      this.isLoading = false;
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
