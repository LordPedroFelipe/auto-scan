import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeadModel } from 'src/app/models/lead.model';

@Component({
  selector: 'app-lead-detalhe-modal',
  templateUrl: './lead-detalhe-modal.component.html',
  styleUrls: ['./lead-detalhe-modal.component.scss']
})
export class LeadDetalheModalComponent {
  novoComentario: string = '';

  constructor(
    public dialogRef: MatDialogRef<LeadDetalheModalComponent>,
    @Inject(MAT_DIALOG_DATA) public lead: LeadModel
  ) {}

  copiarParaClipboard(texto: string) {
    navigator.clipboard.writeText(texto);
  }

  abrirWhatsApp() {
    const mensagem = encodeURIComponent(`Olá ${this.lead.name}, tudo bem?`);
    window.open(`https://wa.me/${this.lead.phone}?text=${mensagem}`, '_blank');
  }

  enviarEmail() {
    window.open(`mailto:${this.lead.email}`, '_blank');
  }

  ligar() {
    window.open(`tel:${this.lead.phone}`);
  }

  adicionarComentario() {
    if (this.novoComentario.trim()) {
      this.lead.comments = this.lead.comments || [];
      this.lead.comments.push({
        texto: this.novoComentario,
        data: new Date().toISOString()
      });
      this.novoComentario = '';
    }
  }
}
