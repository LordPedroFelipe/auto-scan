import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestDriveService } from 'src/app/services/test-drive.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-agendamento-test-drive',
  templateUrl: './agendamento-test-drive.component.html',
  styleUrls: ['./agendamento-test-drive.component.scss']
})
export class AgendamentoTestDriveComponent implements OnInit {
  form!: FormGroup;
  vehicleId!: string;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private testDriveService: TestDriveService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('vehicleId')!;
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

  /*const dataFormatada = preferredTime
    ? new Date(`${preferredDate}T${preferredTime}:00`)
    : new Date(preferredDate);

  if (isNaN(dataFormatada.getTime())) {
    this.alert.showError('Data ou hora inválida.');
    return;
  }*/

  const dto = {
    vehicleId: this.vehicleId,
    preferredDate: preferredDate,
    ...rest
  };

  const payload = {
    vehicleId: this.vehicleId,
    preferredDate: preferredDate,
    ...rest 
  };

  this.isLoading = true;

  this.testDriveService.agendarTestDrive(payload).subscribe({
    next: () => {
      this.alert.showSuccess('Test Drive agendado com sucesso!');
      this.form.reset();
    },
    error: () => {
      this.alert.showError('Erro ao agendar Test Drive.');
    },
    complete: () => (this.isLoading = false)
  });
}


}
