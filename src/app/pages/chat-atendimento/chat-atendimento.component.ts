import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, interval, switchMap, takeUntil } from 'rxjs';

import { ImagemModalComponent } from 'src/app/components/imagem-modal/imagem-modal.component';
import { LeadFormModalComponent } from 'src/app/components/lead-form-modal/lead-form-modal.component';
import { MicRecordingSnackComponent } from 'src/app/components/mic-recording-snack/mic-recording-snack.component';
import { LeadModel } from 'src/app/models/lead.model';
import { SendMessageRequest } from 'src/app/models/send-message.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { IaChatService } from 'src/app/services/ia-chat.service';
import { LeadService } from 'src/app/services/lead.service';
import { LocationService } from 'src/app/services/location.service';
import { VeiculoService } from 'src/app/services/veiculo.service';

type Autor = 'IA' | 'Cliente';

interface OpcaoMsg { label?: string; url?: string; [k: string]: any }
interface Mensagem {
  id?: string;                 // para dedupe no polling
  autor: Autor;
  texto: string;
  data: Date;
  opcoes?: OpcaoMsg[] | any[] | string | null;
  isLoading?: boolean;
  fotos?: string[];
  testdriveUrl?: string;
  financingUrl?: string;
}

@Component({
  selector: 'app-chat-atendimento',
  templateUrl: './chat-atendimento.component.html',
  styleUrls: ['./chat-atendimento.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatAtendimentoComponent implements OnInit, OnDestroy {
  @ViewChild('mensagensDiv') mensagensDiv!: ElementRef<HTMLDivElement>;

  mensagens: Mensagem[] = [];
  private seenIds = new Set<string>();
  private destroy$ = new Subject<void>();

  novaMensagem = '';
  placa: string | null = null;
  imagensVeiculo: string[] = [];
  readonly sessionId: string = crypto.randomUUID();
  isLoading = false;

  private speechRecognition: any;
  isRecording = false;
  snackBarRef: any;

  isPrimeiraInteracao = true;
  leadCapturado = false;
  leadData: any = null;

  humor: string | null = 'happy';
  shopId!: string;
  vehicleId?: string;
  data?: any;

  sugestoesVisiveis: string[] = [];
  fotoSelecionadaIndex: number | null = null;

  private readonly sugestoesBusca: string[] = [
    'SUV até 100 mil', 'Carro econômico para cidade', 'Sedan confortável', 'Pick-up 4x4',
    'Hatch até 50 mil', 'Veículo com baixo KM', 'Financiamento sem entrada', 'Veículo com garantia de fábrica',
    'Câmbio automático', 'Carros com teto solar', 'Carro com banco de couro',
    'Veículos 0km', 'SUV compacto', 'Sedan premium', 'Modelos populares para Uber',
    'Baixa manutenção', 'Carros até 30 mil', 'Carros até 50 mil', 'Carros até 70 mil', 'Carros até 100 mil'
  ];

  private readonly mensagensBoasVindas: string[] = [
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
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.placa = this.route.snapshot.paramMap.get('placa');
    this.shopId = this.route.snapshot.paramMap.get('shopId') || '';
    this.vehicleId = this.route.snapshot.paramMap.get('vehicleId') || '';

    // Lead salvo
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
    this.sugestoesVisiveis = this.randomSample(this.sugestoesBusca, 6);
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch {}
    }
    if (this.snackBarRef) this.snackBarRef.dismiss();
  }

  async enviar(): Promise<void> {
    const pergunta = this.novaMensagem?.trim();
    if (!pergunta) return;

    // Captura de lead (uma vez)
    if (!this.leadCapturado) {
      const dialogRef = this.dialog.open(LeadFormModalComponent, { width: '400px', disableClose: true });
      const result = await dialogRef.afterClosed().toPromise();
      if (!result) return;

      const localizacao = await this.localizacaoService.obterCoordenadas().catch(() => null);
      const cidade = localizacao
        ? await this.localizacaoService.obterCidadePorCoordenadas(localizacao.latitude, localizacao.longitude).catch(() => null)
        : null;

      const novoLead: LeadModel = {
        name: (result.nome ?? '').trim(),
        email: (result.email ?? '').trim(),
        phone: (result.telefone ?? '').trim(),
        notes: (result.observacoes ?? '').trim(),
        shopId: this.authService.getShopId(),
        vehicleId: this.vehicleId ?? this.placa ?? null,
        status: 'New',
        hasBeenContacted: false,
        contactDate: new Date().toISOString(),
        lastContactDate: null,
        isActive: true,
        city: cidade ?? result.cidade ?? null,
        comments: []
      };

      try {
        await this.leadService.criar(novoLead).toPromise();
        this.leadData = result;
        this.leadCapturado = true;
        localStorage.setItem('leadData', JSON.stringify(result));
      } catch {
        this.alert.showError('Erro ao salvar o LEAD.');
        return;
      }
    }

    // Mensagem do cliente
    this.mensagens.push({ autor: 'Cliente', texto: pergunta, data: new Date() });
    this.novaMensagem = '';

    const loadingMsg: Mensagem = { autor: 'IA', texto: 'Digitando...', data: new Date(), isLoading: true };
    this.mensagens.push(loadingMsg);
    this.scrollToBottom();

    this.isLoading = true;
    this.cdr.markForCheck();

    const payload: SendMessageRequest = { sessionId: this.sessionId, message: pergunta };

    this.chatService.sendMessage(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resposta: any) => {
        this.mensagens = this.mensagens.filter(msg => !msg.isLoading);

        const mensagem = (resposta?.message as string) || 'Resposta recebida.';
        const opcoes = (resposta?.options as any[]) || [];
        const fotos = (resposta?.photos as string[]) || [];
        this.humor = resposta?.humor || 'happy';

        if (Array.isArray(fotos) && fotos.length) {
          this.imagensVeiculo.push(...fotos);
        }

        this.mensagens.push({
          id: resposta?.id,
          autor: 'IA',
          texto: mensagem,
          data: new Date(),
          opcoes,
          fotos,
          testdriveUrl: resposta?.testdriveUrl || undefined,
          financingUrl: resposta?.financingUrl || undefined
        });

        this.isLoading = false;
        this.scrollToBottom();
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensagens = this.mensagens.filter(msg => !msg.isLoading);
        this.isLoading = false;
        this.alert.showError('Tente enviar a mensagem novamente.');
        this.cdr.markForCheck();
      }
    });
  }

  enviarMensagemIA(texto: string, opcoes: string[] | null): void {
    this.mensagens.push({ autor: 'IA', texto, data: new Date(), opcoes });
    this.cdr.markForCheck();
  }

  buscarImagensDoVeiculo(placa: string): void {
    if (!this.vehicleId) return;
    this.veiculoService.getVeiculoById(this.vehicleId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.data = res;
        // garante array
        this.imagensVeiculo = Array.isArray(this.data?.photoUrls) ? this.data.photoUrls.slice() : [];
        this.enviarMensagemPlacaCarro();
        this.cdr.markForCheck();
      },
      error: (err: any) => console.error('Erro ao carregar veículo:', err)
    });
  }

  abrirImagem(imgUrl: string): void {
    const index = this.imagensVeiculo.indexOf(imgUrl);
    console.log('Abrindo imagem:', imgUrl, this.imagensVeiculo, index);
    this.dialog.open(ImagemModalComponent, {
      data: { imagens: this.imagensVeiculo, indice: index },
      panelClass: 'imagem-fullscreen-dialog'
    });
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const el = this.mensagensDiv?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  iniciarPollingMensagens(): void {
    interval(3000).pipe(
      switchMap(() => this.chatService.getMessages(this.sessionId)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any[]) => {
        for (const msg of res || []) {
          const id: string = msg.id || `${msg.autor}-${msg.data}-${msg.texto}`;
          if (this.seenIds.has(id)) continue;
          this.seenIds.add(id);

          const autor: Autor = (msg.autor?.toLowerCase() === 'cliente') ? 'Cliente' : 'IA';
          this.mensagens.push({
            id,
            autor,
            texto: msg.texto,
            data: new Date(msg.data),
            testdriveUrl: msg.testdriveUrl || undefined,
            financingUrl: msg.financingUrl || undefined
          });
        }
        if (res?.length) {
          this.scrollToBottom();
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        if (err?.status === 401) return; // silencioso
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
        duration: undefined, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['mic-snackbar']
      });
      this.cdr.markForCheck();
    };

    this.speechRecognition.onresult = (event: any) => {
      const resultado = event.results?.[0]?.[0]?.transcript || '';
      this.novaMensagem = resultado;
      this.enviar();
    };

    this.speechRecognition.onerror = () => {
      this.alert.showError('Erro ao capturar voz.');
    };

    this.speechRecognition.onend = () => {
      this.isRecording = false;
      if (this.snackBarRef) this.snackBarRef.dismiss();
      this.cdr.markForCheck();
    };

    this.speechRecognition.start();
  }

  alternarGravacao(): void {
    if (this.isRecording) this.pararGravacao(); else this.iniciarGravacao();
  }

  pararGravacao(): void {
    if (this.speechRecognition) {
      try { this.speechRecognition.stop(); } catch {}
    }
  }

  enviarMensagemBoasVindas(): void {
    const mensagem = this.mensagensBoasVindas[Math.floor(Math.random() * this.mensagensBoasVindas.length)];
    const opcoes = this.randomSample(this.sugestoesBusca, 3);
    this.enviarMensagemIA(mensagem, opcoes);
  }

  enviarMensagemPlacaCarro(): void {
    const mensagem = this.iaChatService.gerarMensagemVendaComDados(this.data);
    const opcoes = ['Agendar TestDrive', 'Simular Financiamento', 'Detalhes Tecnicos do Carro'];
    this.enviarMensagemIA(mensagem, opcoes);
  }

  private randomSample<T>(arr: T[], n: number): T[] {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
  }

  enviarSugestao(sugestao: string): void {
    this.novaMensagem = sugestao;
    this.enviar();
  }

  clicarOpcao(op: any): void {
    if (op && typeof op === 'object' && op.url) {
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
    this.cdr.markForCheck();
  }

  formatarTexto(texto: string): SafeHtml {
    if (!texto) return '';
    const linked = texto.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    const html = linked.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onImageError(event: Event): void {
    const el = event.target as HTMLImageElement;
    el.src = 'assets/img/sem-foto.png';
  }

  getImagemPorHumor(): string {
    switch (this.humor) {
      case 'happy': return 'assets/img/ScanDrive-White/9.png';
      case 'neutral': return 'assets/img/ScanDrive-White/neutral.png';
      case 'sad': return 'assets/img/ScanDrive-White/sad.png';
      case 'surprised': return 'assets/img/ScanDrive-White/surprised.png';
      default: return 'assets/img/ScanDrive-White/9.png';
    }
  }

  abrirFotoFullscreen(index: number) { this.fotoSelecionadaIndex = index; }
  fecharFullscreen() { this.fotoSelecionadaIndex = null; }

  proximaFoto() {
    if (this.fotoSelecionadaIndex !== null && this.data?.photoUrls?.length) {
      if (this.fotoSelecionadaIndex < this.data.photoUrls.length - 1) this.fotoSelecionadaIndex++;
    }
  }

  fotoAnterior() {
    if (this.fotoSelecionadaIndex !== null && this.fotoSelecionadaIndex > 0) this.fotoSelecionadaIndex--;
  }

  // trackBys
  trackByMsg = (_: number, m: Mensagem) => m.id ?? `${m.autor}-${m.data?.toISOString?.() ?? ''}-${m.texto?.slice(0, 20)}`;
  trackByFoto = (_: number, url: string) => url;
  trackByOpcao = (_: number, op: any) => (typeof op === 'string' ? op : op?.label ?? op?.url ?? _);
  trackByIndex = (_: number, __: any) => _;
}
