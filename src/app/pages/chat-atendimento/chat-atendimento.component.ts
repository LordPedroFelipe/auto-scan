import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  idCarro: string = '';
  mensagens: Mensagem[] = [];
  novaMensagem: string = '';
  placa: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.placa = this.route.snapshot.paramMap.get('placa');
  
    if (this.placa) {
      this.carregarCarroPorPlaca(this.placa);
      const mensagem = this.montarMensagemVendaIAtest();
      this.enviarMensagemIA(mensagem);
    } else {
      this.enviarMensagemIA('Olá! Estou aqui para te ajudar a encontrar o carro ideal. Qual tipo você procura?');
    }
  }

  carregarCarroPorPlaca(placa: string): void {
    /*this.carroService.buscarPorPlaca(placa).subscribe({
      next: (dados) => {
        this.carro = dados;
        const mensagem = this.montarMensagemVendaIA(dados);
        this.enviarMensagemIA(mensagem);
      },
      error: () => {
        this.enviarMensagemIA('Desculpe, não encontrei dados para essa placa. Você gostaria de procurar outro carro?');
      }
    });*/
  }

  montarMensagemVendaIAtest(): string {
    const dadosFake = {
      marca: 'Mercedes-Benz',
      modelo: 'GLA 200',
      ano: 2018,
      motor: '1.6 Turbo Flex',
      km: 78000,
      valor: '120.000,00',
      caracteristicas: [
        'Câmbio automático de 7 marchas',
        'Teto solar panorâmico',
        'Faróis full LED',
        'Ar digital dual zone',
        'Bancos em couro',
        'Sistema Start/Stop',
        'Central multimídia com GPS'
      ]
    };

    return `🚗 Esse veículo é um ${dadosFake.marca} ${dadosFake.modelo} ${dadosFake.ano}, motor ${dadosFake.motor}, com ${dadosFake.km.toLocaleString()} km rodados.
      Está disponível por apenas R$ ${dadosFake.valor}!
      Ele possui as seguintes características:
      👉 ${dadosFake.caracteristicas.join('\n👉 ')}.
      Além disso, ele conta com garantia de fábrica e todas as revisões feitas.
      💰 Temos ótimas condições para financiamento, podendo parcelar em até 60x.
      Você pode dar uma entrada de 20% e financiar o restante.  
      Deseja simular uma proposta agora mesmo?`;
  }

  montarMensagemVendaIA(dados: any): string {
    return `🚗 Esse veículo é um ${dados.marca} ${dados.modelo} ${dados.ano}, motor ${dados.motor} e está com ${dados.km}km rodados. 
      Está disponível por apenas R$ ${dados.valor}!
      Ele possui as seguintes características: ${dados.caracteristicas.join(', ')}.
      Além disso, ele conta com garantia de fábrica e revisões em dia.
      Se você está pensando em financiar, temos ótimas opções!
      Podemos fazer o financiamento em até 60x. Deseja simular?`;
  }

  enviar(): void {
    if (!this.novaMensagem.trim()) return;

    this.mensagens.push({ autor: 'Cliente', texto: this.novaMensagem, data: new Date() });

    const pergunta = this.novaMensagem.toLowerCase();
    this.novaMensagem = '';

    setTimeout(() => {
      this.enviarMensagemIA(this.respostaAutomatica(pergunta));
    }, 1000);
  }

  enviarMensagemIA(texto: string): void {
    this.mensagens.push({ autor: 'IA', texto, data: new Date() });
  }

  respostaAutomatica(pergunta: string): string {
    if (pergunta.includes('preço')) {
      return 'Esse carro está saindo por R$ 79.900,00 com IPVA pago.';
    } else if (pergunta.includes('financiamento')) {
      return 'Sim! Trabalhamos com várias financeiras e facilitamos o processo de aprovação.';
    } else if (pergunta.includes('disponível')) {
      return 'Sim, ele está disponível. Deseja agendar uma visita?';
    } else {
      return 'Me dá um momento para verificar essa informação...';
    }
  }
}
