import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private iaChatService: IaChatService
  ) {}

  ngOnInit(): void {
    this.placa = this.route.snapshot.paramMap.get('placa');

    if (this.placa) {
      const msg = this.iaChatService.gerarMensagemVendaFake(); // substituir por API real futuramente
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
}
