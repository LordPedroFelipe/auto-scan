import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImagemModalComponent } from 'src/app/components/imagem-modal/imagem-modal.component';
import { SendMessageRequest } from 'src/app/models/send-message.model';
import { AlertService } from 'src/app/services/alert.service';
import { ChatService } from 'src/app/services/chat.service';
import { interval, Subscription, switchMap } from 'rxjs';
import { MicRecordingSnackComponent } from 'src/app/components/mic-recording-snack/mic-recording-snack.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @ViewChild('mensagensDiv') mensagensDiv!: ElementRef;
  mensagens: Mensagem[] = [];
  mensagensMap = new Map<string, boolean>(); // para evitar duplicatas
  mensagemPollingSub?: Subscription;
  novaMensagem = '';
  placa: string | null = null;
  imagensVeiculo: string[] = [];
  sessionId: string = crypto.randomUUID(); // ou use um ID real da API se disponível
  isLoading = false;

  speechRecognition: any;
  isRecording = false;
  snackBarRef: any; // Referência ao Snackbar

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private chatService: ChatService,
    private alert: AlertService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.placa = this.route.snapshot.paramMap.get('placa');

    if (this.placa) {
      this.imagensVeiculo = this.buscarImagensDoVeiculo(this.placa);
      this.enviarMensagemIA(`🚗 Encontramos um veículo com placa ${this.placa}. Veja abaixo os detalhes.`);
    } else {
      this.enviarMensagemIA('Olá! Sou o assistente ScanDrive 🤖. Que tipo de carro você está buscando hoje?');
    }

    // Opcional: carregar mensagens de uma sessão anterior
    // this.carregarMensagens();
    this.iniciarPollingMensagens();
  }

  enviar(): void {
    if (!this.novaMensagem.trim()) return;

    const pergunta = this.novaMensagem;
    this.mensagens.push({ autor: 'Cliente', texto: pergunta, data: new Date() });
    this.novaMensagem = '';

    const payload: SendMessageRequest = {
      sessionId: this.sessionId,
      mensagem: pergunta
    };

    this.isLoading = true;
    this.chatService.sendMessage(payload).subscribe({
      next: (resposta: string) => {
        this.mensagens.push({ autor: 'IA', texto: resposta, data: new Date() });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alert.showError('Erro ao enviar mensagem para o assistente.');
      }
    });
  }

  enviarMensagemIA(texto: string): void {
    this.mensagens.push({ autor: 'IA', texto, data: new Date() });
  }

  buscarImagensDoVeiculo(placa: string): string[] {
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

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.mensagensDiv) {
        this.mensagensDiv.nativeElement.scrollTop = this.mensagensDiv.nativeElement.scrollHeight;
      }
    }, 100);
  }

  iniciarPollingMensagens(): void {
    this.mensagemPollingSub = interval(3000).pipe( // a cada 3s
      switchMap(() => this.chatService.getMessages(this.sessionId))
    ).subscribe({
      next: (res: any[]) => {
        res.forEach(msg => {
          if (!this.mensagensMap.has(msg.texto)) {
            const autor = msg.autor?.toLowerCase() === 'cliente' ? 'Cliente' : 'IA';
            this.mensagens.push({ autor, texto: msg.texto, data: new Date(msg.data) });
            this.mensagensMap.set(msg.texto, true);
          }
        });
      },
      error: (err) => {
        this.alert.showError('Erro ao buscar mensagens do chat.');
        console.error('[Polling Chat]', err);
      }
    });
  }

  iniciarGravacao(): void {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.alert.showWarning('Reconhecimento de voz não suportado neste navegador.');
      return;
    }

    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.lang = 'pt-BR';
    this.speechRecognition.continuous = false;
    this.speechRecognition.interimResults = false;

    this.speechRecognition.onstart = () => {
      this.isRecording = true;
      this.snackBarRef = this.snackBar.openFromComponent(MicRecordingSnackComponent, {
        duration: undefined,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['mic-snackbar']
      });
    };

    this.speechRecognition.onresult = (event: any) => {
      const resultado = event.results[0][0].transcript;
      console.log('🗣 Texto reconhecido:', resultado);
      this.novaMensagem = resultado;
      this.enviar(); // envia automaticamente
    };

    this.speechRecognition.onerror = (event: any) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      this.alert.showError('Erro ao capturar voz.');
    };

    this.speechRecognition.onend = () => {
      this.isRecording = false;
      if (this.snackBarRef) {
        this.snackBarRef.dismiss();
      }
    };

    this.speechRecognition.start();
  }

  alternarGravacao(): void {
    if (this.isRecording) {
      this.pararGravacao();
    } else {
      this.iniciarGravacao();
    }
  }

  pararGravacao(): void {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
    }
  }
}
