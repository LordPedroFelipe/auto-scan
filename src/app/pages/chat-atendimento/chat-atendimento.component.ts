import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription, switchMap } from 'rxjs';
import { ImagemModalComponent } from 'src/app/components/imagem-modal/imagem-modal.component';
import { LeadFormModalComponent } from 'src/app/components/lead-form-modal/lead-form-modal.component';
import { MicRecordingSnackComponent } from 'src/app/components/mic-recording-snack/mic-recording-snack.component';
import { SendMessageRequest } from 'src/app/models/send-message.model';
import { AlertService } from 'src/app/services/alert.service';
import { ChatService } from 'src/app/services/chat.service';
import { IaChatService } from 'src/app/services/ia-chat.service';
import { LeadService } from 'src/app/services/lead.service';
import { LocationService } from 'src/app/services/location.service';
import { VeiculoService } from 'src/app/services/veiculo.service';

interface Mensagem {
  autor: 'IA' | 'Cliente';
  texto: string;
  data: Date;
  opcoes?: any[] | null;
  isLoading?: boolean;
  fotos?: string[];
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

  humor: string | null = 'happy';
  vehicleId?: string;
  data?: any;

  sugestoesVisiveis: string[] = [];
  fotoSelecionadaIndex: number | null = null;
  sugestoesBusca = [
    'SUV até 100 mil',
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
    'Carros até 30 mil',
    'Carros até 50 mil',
    'Carros até 70 mil',
    'Carros até 100 mil'
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
    private veiculoService: VeiculoService,
  ) {}

  ngOnInit(): void {
    this.placa = this.route.snapshot.paramMap.get('placa');
    this.vehicleId = this.route.snapshot.paramMap.get('placa') || '';

    // Verifica se já tem LEAD salvo em localStorage
    const leadStorage = localStorage.getItem('leadData');
    if (leadStorage) {
      this.leadData = JSON.parse(leadStorage);
      this.leadCapturado = true;
    }

    if (this.placa) {
      this.buscarImagensDoVeiculo(this.placa);
    } else {
      this.enviarMensagemBoasVindas();
    }

    this.iniciarPollingMensagens();
    this.sugestoesVisiveis = this.shuffle(this.sugestoesBusca).slice(0, 6);
  }

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
        shopId: '1ae44908-6f2e-49f9-a3e8-34be6f882084', // se você tiver esse ID disponível no contexto
        // vehicleId: this.placa ?? '' // se a placa for equivalente ao veículoId
      };

      try {
        await this.leadService.criar(novoLead).toPromise();
        this.leadData = result;
        this.leadCapturado = true;

        localStorage.setItem('leadData', JSON.stringify(result));
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

    const loadingMsg: Mensagem = {
      autor: 'IA',
      texto: 'Pensando...',
      data: new Date(),
      isLoading: true
    };

    this.mensagens.push(loadingMsg);
    this.scrollToBottom();
    this.isLoading = true;
    this.chatService.sendMessage(payload).subscribe({
      next: (resposta: any) => {

        console.log('msg enviar', resposta);
        this.mensagens = this.mensagens.filter(msg => !msg.isLoading);

        const mensagem = resposta?.message || 'Resposta recebida.';
        const opcoes = resposta?.options || [];
        const fotos = resposta?.photos || [];
        this.humor = resposta?.humor || 'happy';

        const opcoesFormatadas = [...opcoes];

        // Se houver fotos, adiciona uma opção para ver em destaque
        if (fotos.length > 0) {
          fotos.forEach((url: any) => {
            this.imagensVeiculo.push(url);
          });
        }

        this.mensagens.push({
          autor: 'IA',
          texto: mensagem,
          data: new Date(),
          opcoes: opcoesFormatadas,
          fotos
        });

        this.scrollToBottom();
        this.isLoading = false;
      },
      error: () => {
        this.mensagens = this.mensagens.filter(msg => !msg.isLoading);
        this.isLoading = false;
        this.alert.showError('Tente enviar a mensagem novamente.');
      }
    });
  }

  enviarMensagemIA(texto: string, sugestoesVisiveis: string[] | null): void {
    this.mensagens.push({ autor: 'IA', texto, data: new Date(), opcoes: sugestoesVisiveis });
  }

  buscarImagensDoVeiculo(placa: string): void {
    if (this.vehicleId) {
      this.veiculoService.getVeiculoById(this.vehicleId).subscribe({
        next: (res: any) => {
          this.data = res;
          this.imagensVeiculo = this.data.mainPhotoUrl;
          console.log('this.data ', this.data)
          // this.enviarMensagemIA(`🚗 Encontramos um veículo com placa ${this.placa}. Veja abaixo os detalhes.`);
          this.enviarMensagemPlacaCarro();
        },
        error: (err: any) => console.error('Erro ao carregar veículo:', err)
      });
    }
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
            console.log('msg ', msg);
            const autor = msg.autor?.toLowerCase() === 'cliente' ? 'Cliente' : 'IA';
            this.mensagens.push({ autor, texto: msg.texto, data: new Date(msg.data) });
            this.mensagensMap.set(msg.texto, true);
          }
        });
      },
      error: (err) => {
        if (err.status === 401) {
          console.warn('[ChatService] Usuário não autenticado. Chat desativado.');
          this.mensagemPollingSub?.unsubscribe();
          return;
        }

        // this.alert.showError('Erro ao buscar mensagens do chat.');
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
    const mensagem = this.iaChatService.gerarMensagemVendaComDados(this.data);
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

  clicarOpcao(op: any): void {
    if (typeof op === 'object' && op.url) {
      window.open(op.url, '_blank');
    } else if (typeof op === 'string') {
      this.selecionarOpcao(op);
    }
  }
  selecionarOpcao(opcao: string): void {
    this.novaMensagem = opcao;
    this.enviar();
  }

  limparLeadCache(): void {
    localStorage.removeItem('leadData');
    this.leadCapturado = false;
    this.leadData = null;
  }

  formatarTexto(texto: string): string {
    if (!texto) return '';
    const comLinks = texto.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    return comLinks.replace(/\n/g, '<br>');
  }

  onImageError(event: any): void {
    event.target.src = 'assets/img/sem-foto.png';
  }

  getImagemPorHumor(): string {
    switch (this.humor) {
      case 'happy':
        return 'assets/img/ScanDrive-White/9.png';
      case 'neutral':
        return 'assets/img/ScanDrive-White/neutral.png';
      case 'sad':
        return 'assets/img/ScanDrive-White/sad.png';
      case 'surprised':
        return 'assets/img/ScanDrive-White/surprised.png';
      default:
        return 'assets/img/ScanDrive-White/9.png';
    }
  }

  abrirFotoFullscreen(index: number) {
    this.fotoSelecionadaIndex = index;
  }

  fecharFullscreen() {
    this.fotoSelecionadaIndex = null;
  }

  proximaFoto() {
    if (this.fotoSelecionadaIndex !== null && this.fotoSelecionadaIndex < this.data.photoUrls.length - 1) {
      this.fotoSelecionadaIndex++;
    }
  }

  fotoAnterior() {
    if (this.fotoSelecionadaIndex !== null && this.fotoSelecionadaIndex > 0) {
      this.fotoSelecionadaIndex--;
    }
  }
}
