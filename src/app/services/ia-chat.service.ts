import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IaChatService {

  constructor() {}

  gerarRespostaAutomatica(pergunta: string): string {
    const p = pergunta.toLowerCase();

    if (p.includes('preço') || p.includes('valor')) {
      return 'Esse modelo está saindo por R$ 120.000,00. Podemos negociar ou simular financiamento!';
    }

    if (p.includes('financiamento') || p.includes('parcelar')) {
      return 'Sim, temos ótimas condições de financiamento, com ou sem entrada. Quer que eu simule?';
    }

    if (p.includes('disponível') || p.includes('estoque')) {
      return 'Sim, ele está disponível para test drive ou reserva. Deseja agendar uma visita?';
    }

    if (p.includes('entrada') || p.includes('parcelas')) {
      return 'Com uma entrada de 20%, é possível financiar em até 60x. Quer ver um exemplo real?';
    }

    if (p.includes('garantia')) {
      return 'Esse veículo possui garantia de fábrica e todas as revisões feitas na concessionária.';
    }

    return 'Essa é uma ótima pergunta! Vou verificar essa informação e te responder em instantes.';
  }

  gerarMensagemVendaFake(): string {
    const carro = {
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

    return `🚗 Esse veículo é um ${carro.marca} ${carro.modelo} ${carro.ano}, motor ${carro.motor}, com ${carro.km.toLocaleString()} km rodados.
        💰 Está disponível por R$ ${carro.valor}, com possibilidade de financiamento em até 60x!

        Características principais:
        👉 ${carro.caracteristicas.join('\n👉 ')}

        ✅ Garantia de fábrica  
        ✅ Revisões em dia  
        ✅ Transferência grátis

        Deseja simular uma proposta ou agendar uma visita?`;
  }
}
