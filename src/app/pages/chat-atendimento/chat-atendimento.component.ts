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
import { IaChatService } from 'src/app/services/ia-chat.service';
import { LeadFormModalComponent } from 'src/app/components/lead-form-modal/lead-form-modal.component';
import { LeadService } from 'src/app/services/lead.service';
import { LocationService } from 'src/app/services/location.service';

interface Mensagem {
  autor: 'IA' | 'Cliente';
  texto: string;
  data: Date;
  opcoes?: string[] | null;
}

@Component({
  selector: 'app-chat-atendimento',
  templateUrl: './chat-atendimento.component.html',
  styleUrls: ['./chat-atendimento.component.scss']
})
export class ChatAtendimentoComponent implements OnInit {
  @ViewChild('mensagensDiv') mensagensDiv!: ElementRef;
  mensagens: Mensagem[] = [];
  mensagensMap = new Map<string, boolean>();
  mensagemPollingSub?: Subscription;
  novaMensagem = '';
  placa: string | null = null;
  imagensVeiculo: string[] = [];
  sessionId: string = crypto.randomUUID();
  isLoading = false;

  speechRecognition: any;
  isRecording = false;
  snackBarRef: any;
  isPrimeiraInteracao = true;
  leadCapturado = false;
  leadData: any = null;

  sugestoesVisiveis: string[] = [];
  sugestoesBusca = [
    'SUV automático até 100 mil',
    'Carro econômico para cidade',
    'Sedan confortável',
    'Pick-up 4x4',
    'Hatch até 50 mil',
    'Veículo com baixo KM',
    'Financiamento sem entrada',
    'Veículo com garantia de fábrica',
    'Câmbio automático',
    'Carros com teto solar',
    'Carro com banco de couro',
    // 'Modelos com consumo abaixo de 10km/l',
    'Veículos 0km',
    'SUV compacto',
    'Sedan premium',
    'Modelos populares para Uber',
    // 'Carros para PCD com isenção',
    'Baixa manutenção',
    // 'Carros para jovens motoristas',
    // 'Carros para viajar com pets'
  ];

  private mensagensBoasVindas: string[] = [
    '🚗 Olá! Seja bem-vindo à ScanDrive, sua nova experiência inteligente na busca pelo carro ideal! 🤖 Me diga, qual modelo ou estilo de carro você procura hoje?',
    '👋 Bem-vindo à ScanDrive! Eu sou seu assistente virtual. Vamos encontrar o carro dos seus sonhos de forma rápida e sem complicação?',
    '🔍 Olá! Sou o assistente inteligente da ScanDrive 🤖. Com tecnologia de ponta, vou te ajudar a encontrar o carro perfeito. O que você está buscando hoje?',
    '🎯 Olá! Pronto para achar o carro ideal? Me diga o que você procura e eu te mostro as melhores opções com ótimas condições.',
    '✨ Seja muito bem-vindo à ScanDrive! 🚗 Conte comigo para encontrar o veículo ideal com confiança e praticidade. Vamos começar?'
  ];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private chatService: ChatService,
    private alert: AlertService,
    private snackBar: MatSnackBar,
    private iaChatService: IaChatService,
    private leadService: LeadService,
    private localizacaoService: LocationService,
  ) {}

  ngOnInit(): void {
    this.placa = this.route.snapshot.paramMap.get('placa');

    if (this.placa) {
      this.imagensVeiculo = this.buscarImagensDoVeiculo(this.placa);
      // this.enviarMensagemIA(`🚗 Encontramos um veículo com placa ${this.placa}. Veja abaixo os detalhes.`);
      this.enviarMensagemPlacaCarro();
    } else {
      this.enviarMensagemBoasVindas();
    }

    this.iniciarPollingMensagens();
    this.sugestoesVisiveis = this.shuffle(this.sugestoesBusca).slice(0, 6);
  }
  /*
  enviar(): void {
    if (!this.novaMensagem.trim()) return;

    const pergunta = this.novaMensagem;
    this.mensagens.push({ autor: 'Cliente', texto: pergunta, data: new Date() });
    this.novaMensagem = '';

    const payload: SendMessageRequest = {
      sessionId: this.sessionId,
      message: pergunta
    };

    this.isLoading = true;
    this.chatService.sendMessage(payload).subscribe({
      next: (resposta: any) => {
        const mensagem = resposta?.message || 'Resposta recebida.';
        this.mensagens.push({ autor: 'IA', texto: mensagem, data: new Date() });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alert.showError('Erro ao enviar mensagem para o assistente.');
      }
    });
  }
  */

  async enviar(): Promise<void> {
    if (!this.novaMensagem.trim()) return;

    // Se ainda não capturou o lead, abre o modal
    if (!this.leadCapturado) {
      const dialogRef = this.dialog.open(LeadFormModalComponent, {
        width: '400px',
        disableClose: true
      });

      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

      const localizacao = await this.localizacaoService.obterCoordenadas();
      const cidade = localizacao
        ? await this.localizacaoService.obterCidadePorCoordenadas(localizacao.latitude, localizacao.longitude)
        : null;

      // Aqui você prepara o objeto esperado pela API
      const novoLead = {
        name: result.nome,
        email: result.email,
        phone: result.telefone,
        notes: (localizacao && `Localização: ${localizacao.latitude}, ${localizacao.longitude}, Cidade: ${cidade}`) || '',
        shopId: '', // se você tiver esse ID disponível no contexto
        vehicleId: this.placa ?? '' // se a placa for equivalente ao veículoId
      };

      try {
        await this.leadService.criar(novoLead).toPromise();
        this.leadData = result;
        this.leadCapturado = true;
      } catch (error) {
        this.alert.showError('Erro ao salvar o LEAD.');
        return;
      }
    }

    // Continua com o envio da mensagem
    const pergunta = this.novaMensagem;
    this.mensagens.push({ autor: 'Cliente', texto: pergunta, data: new Date() });
    this.novaMensagem = '';

    const payload: SendMessageRequest = {
      sessionId: this.sessionId,
      message: pergunta
    };

    this.isLoading = true;
    this.chatService.sendMessage(payload).subscribe({
      next: (resposta: any) => {
        const mensagem = resposta?.message || 'Resposta recebida.';
        this.mensagens.push({ autor: 'IA', texto: mensagem, data: new Date() });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.alert.showError('Erro ao enviar mensagem para o assistente.');
      }
    });
  }

  enviarMensagemIA(texto: string, sugestoesVisiveis: string[] | null): void {
    this.mensagens.push({ autor: 'IA', texto, data: new Date(), opcoes: sugestoesVisiveis });
  }

  buscarImagensDoVeiculo(placa: string): string[] {
    return [
      `assets/img/veiculos/${placa}-1.jpeg`,
      `assets/img/veiculos/${placa}-2.jpeg`,
      `assets/img/veiculos/${placa}-3.jpeg`,
      `assets/img/veiculos/${placa}-4.jpeg`,
      `assets/img/veiculos/${placa}-5.jpeg`
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
    this.mensagemPollingSub = interval(3000).pipe(
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
      this.novaMensagem = resultado;
      this.enviar();
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

  enviarMensagemBoasVindas(): void {
    const index = Math.floor(Math.random() * this.mensagensBoasVindas.length);
    const mensagem = this.mensagensBoasVindas[index];
    
    const sugestoesVisiveis = this.shuffle(this.sugestoesBusca).slice(0, 3);
    this.enviarMensagemIA(mensagem, sugestoesVisiveis);
  }

  enviarMensagemPlacaCarro(): void {
    const mensagem = this.iaChatService.gerarMensagemVendaFake();
    // const mensagem = `🚗 Encontramos um veículo com placa ${this.placa}. Veja abaixo os detalhes.`;
    
    const sugestoesVisiveis = [
      'Agendar TestDrive',
      'Simular Financiamento',
      'Detalhes Tecnicos do Carro'
    ]
    this.enviarMensagemIA(mensagem, sugestoesVisiveis);
  }

  shuffle(array: string[]): string[] {
    return array.sort(() => 0.5 - Math.random());
  }

  enviarSugestao(sugestao: string): void {
    this.novaMensagem = sugestao;
    this.enviar();
  }

  selecionarOpcao(opcao: string): void {
    this.novaMensagem = opcao;
    this.enviar();
  }

}
