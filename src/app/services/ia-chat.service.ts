import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IaChatService {

  constructor() {}

  gerarRespostaAutomatica(pergunta: string): string {
    const p = pergunta.toLowerCase();
  
    // Marca ou modelo mencionado
    const marcas = ['corolla', 'gla', 'hb20', 'onix', 't-cross', 'hilux', 'civic', 'crv', 'tracker', 'nissan kicks', 'fiat toro', 'jeep compass'];
    // const modelos = ['toyota corolla', 'mercedes gla', 'hyundai hb20', 'chevrolet onix', 'volkswagen t-cross', 'toyota hilux', 'honda civic', 'honda cr-v', 'chevrolet tracker', 'nissan kicks', 'fiat toro', 'jeep compass'];
    const marcaMencionada = marcas.find(m => p.includes(m));
  
    if (marcaMencionada) {
      return `Excelente escolha! O ${marcaMencionada.toUpperCase()} é um dos modelos mais procurados da nossa loja. 
        Posso verificar as versões disponíveis e valores. Deseja financiar ou comprar à vista?`;
    }
  
    if (p.includes('preço') || p.includes('valor')) {
      return 'Esse modelo está disponível a partir de R$ 120.000,00. Podemos negociar ou simular um financiamento agora mesmo.';
    }
  
    if (p.includes('financiamento') || p.includes('parcelar')) {
      return 'Sim, temos opções com e sem entrada, e parcelamentos em até 60x. Deseja simular com base em sua renda?';
    }
  
    if (p.includes('disponível') || p.includes('estoque')) {
      return 'Temos este veículo disponível no estoque com todas as revisões em dia. Você gostaria de ver fotos ou agendar uma visita?';
    }
  
    if (p.includes('entrada') || p.includes('parcelas')) {
      return 'Com entrada de 20%, conseguimos simular parcelas acessíveis. Me diga o valor da entrada desejada e já calculo pra você!';
    }
  
    if (p.includes('garantia')) {
      return 'Esse carro vem com garantia de fábrica e também oferecemos garantia estendida por 12 ou 24 meses. Deseja saber os detalhes?';
    }
  
    return 'Entendi. Só um instante, estou analisando sua pergunta para te dar a melhor resposta 😉';
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
