import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { TestDriveService } from 'src/app/services/test-drive.service';
import { VeiculoService } from 'src/app/services/veiculo.service';

@Component({
  selector: 'app-agendamento-test-drive',
  templateUrl: './agendamento-test-drive.component.html',
  styleUrls: ['./agendamento-test-drive.component.scss']
})
export class AgendamentoTestDriveComponent implements OnInit {
  form!: FormGroup;
  vehicleId!: string;
  isLoading = false;
  agendamentoConfirmado = false;
  agendamento?: any;
  data?: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private testDriveService: TestDriveService,
    private alert: AlertService,
    private veiculoService: VeiculoService,
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('vehicleId')!;

    if (this.vehicleId) {
      this.veiculoService.getVeiculoById(this.vehicleId).subscribe({
        next: (res: any) => this.data = res,
        error: (err: any) => console.error('Erro ao carregar veículo:', err)
      });
    }

    this.form = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required]],
      preferredDate: ['', Validators.required],
      preferredTime: [''],
      notes: ['']
    });
  }

  agendar(): void {
    if (this.form.invalid) return;

    const { preferredDate, preferredTime, ...rest } = this.form.value;

    // Verificação de preenchimento de data e hora
    if (!preferredDate) {
      this.alert.showError('A data do test drive é obrigatória.');
      return;
    }

    // Combina data e hora no formato ISO UTC
    const data = new Date(preferredDate);
    if (preferredTime) {
      const [hours, minutes] = preferredTime.split(':').map(Number);
      data.setHours(hours);
      data.setMinutes(minutes);
      data.setSeconds(0);
      data.setMilliseconds(0);
    }

    const preferredDateISO = data.toISOString(); // Gera no formato desejado: 2025-06-19T01:52:33.262Z

    const payload = {
      vehicleId: this.vehicleId,
      preferredDate: preferredDateISO,
      ...rest
    };

    this.isLoading = true;

    this.testDriveService.agendarTestDrive(payload).subscribe({
      next: (res) => {
        this.agendamentoConfirmado = true;
        this.agendamento = res;
        this.form.reset();
        this.alert.showSuccess('Test Drive agendado com sucesso!');
      },
      error: () => {
        this.alert.showError('Erro ao agendar Test Drive.');
      },
      complete: () => (this.isLoading = false)
    });
  }

  imprimir() {
    window.print();
  }

  enviarWhatsApp() {
    const texto = `Olá, meu nome é ${this.agendamento.customerName} e agendei um test drive no carro ${this.agendamento.vehicleBrand} ${this.agendamento.vehicleModel} na loja ${this.agendamento.shopName} para o dia ${new Date(this.agendamento.preferredDate).toLocaleString('pt-BR')}.`;
    const telefone = this.agendamento.customerPhone;
    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;
    window.open(link, '_blank');
  }

  enviarEmail() {
    const assunto = `Agendamento de Test Drive - ${this.agendamento.vehicleBrand} ${this.agendamento.vehicleModel}`;
    const corpo = `Olá,\n\nAgendei um test drive com as seguintes informações:\n\nNome: ${this.agendamento.customerName}\nData: ${new Date(this.agendamento.preferredDate).toLocaleString('pt-BR')}\nVeículo: ${this.agendamento.vehicleBrand} ${this.agendamento.vehicleModel}\nLoja: ${this.agendamento.shopName}`;
    const mailto = `mailto:${this.agendamento.customerEmail}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    window.open(mailto, '_blank');
  }

  voltarInicio() {
    // this.router.navigate(['/']);
  }
}
