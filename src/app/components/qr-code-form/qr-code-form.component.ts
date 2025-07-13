import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EstoqueService } from 'src/app/services/estoque.service';

@Component({
  selector: 'app-qr-code-form',
  templateUrl: './qr-code-form.component.html',
  styleUrls: ['./qr-code-form.component.scss']
})
export class QrCodeFormComponent implements OnInit {
  form: FormGroup;
  opcoesRedirectId: { id: string, label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<QrCodeFormComponent>,
    private estoqueService: EstoqueService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      redirectType: ['', Validators.required],
      redirectId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.form.value.redirectType === 'Vehicle') {
      this.onRedirectTypeChange();
    }
  }

  onRedirectTypeChange(): void {
    const tipo = this.form.get('redirectType')?.value;

    // console.log(' onRedirectTypeChange ', tipo);
    if (tipo === 'Vehicle') {
      this.estoqueService.listarAtivosSimples().subscribe((veiculos: any) => {
        console.log(' veiculos ', veiculos);
        this.opcoesRedirectId = veiculos.items.map((v: any) => ({
          id: v.id,
          label: `${v.alternativeName} ${v.brand} - ${v.licensePlate}`
        }));
        // console.log(' this.opcoesRedirectId ', this.opcoesRedirectId);
      });
    } else {
      this.opcoesRedirectId = [{
        id: this.data.shopId,
        label: 'Loja atual'
      }];
    }

    this.form.get('redirectId')?.setValue(null);
  }

  salvar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
