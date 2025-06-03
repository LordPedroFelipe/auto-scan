import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ImagemModalComponent } from 'src/app/components/imagem-modal/imagem-modal.component';
import { IaChatService } from 'src/app/services/ia-chat.service';

interface Mensagem {
  autor: 'IA' | 'Cliente';
  texto: string;
  data: Date;
}

@Component({
  selector: 'app-chat-atendimento',
  templateUrl: './chat-atendimento.component.html',
  styleUrls: ['./chat-atendimento.component.scss']
})
export class ChatAtendimentoComponent implements OnInit {
  mensagens: Mensagem[] = [];
  novaMensagem: string = '';
  placa: string | null = null;
  imagensVeiculo: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private iaChatService: IaChatService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.placa = this.route.snapshot.paramMap.get('placa');

    if (this.placa) {
      const msg = this.iaChatService.gerarMensagemVendaFake(); // substituir por API real futuramente
      this.buscarImagensDoVeiculo(this.placa).forEach(img => this.imagensVeiculo.push(img));
      this.enviarMensagemIA(msg);
    } else {
      this.enviarMensagemIA('Olá! Sou o assistente ScanDrive 🤖. Que tipo de carro você está buscando hoje?');
    }
  }

  enviar(): void {
    if (!this.novaMensagem.trim()) return;

    this.mensagens.push({ autor: 'Cliente', texto: this.novaMensagem, data: new Date() });

    const pergunta = this.novaMensagem;
    this.novaMensagem = '';

    setTimeout(() => {
      const resposta = this.iaChatService.gerarRespostaAutomatica(pergunta);
      this.enviarMensagemIA(resposta);
    }, 600);
  }

  enviarMensagemIA(texto: string): void {
    this.mensagens.push({ autor: 'IA', texto, data: new Date() });
  }

  buscarImagensDoVeiculo(placa: string): string[] {
    // Simulação estática (poderá ser substituído por uma chamada de serviço)
    return [
      `assets/img/veiculos/${placa}-1.jpeg`,
      `assets/img/veiculos/${placa}-2.jpeg`,
      `assets/img/veiculos/${placa}-3.jpeg`,
      `assets/img/veiculos/${placa}-4.jpeg`
    ];
  }

  abrirImagem(imgUrl: string): void {
    const index = this.imagensVeiculo.indexOf(imgUrl);

    this.dialog.open(ImagemModalComponent, {
      data: {
        imagens: this.imagensVeiculo,
        indice: index
      },
      panelClass: 'imagem-fullscreen-dialog'
    });
  }
}
