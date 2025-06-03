import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IaChatService {

  constructor() {}

  gerarRespostaAutomatica(pergunta: string): string {
    const p = pergunta.toLowerCase();
  
    const marcas = [
      'corolla', 'gla', 'hb20', 'onix', 't-cross', 'hilux', 'civic', 'crv', 'tracker',
      'nissan kicks', 'fiat toro', 'jeep compass', 'jeep renegade', 'jeep wrangler',
      'ecosport', 'ranger', 'fiat strada', 'fiat mobi', 'polo', 'up', 'gol',
      'spin', 'prisma', 'etios', 'yaris', 'city', 'fit'
    ];
  
    const marcaMencionada = marcas.find(m => p.includes(m));
  
    if (marcaMencionada) {
      return `Excelente escolha! O ${marcaMencionada.toUpperCase()} é um dos carros mais desejados atualmente.
        ✅ Temos unidades no estoque, revisadas e com garantia, quer agendar um TestDrive?
        Quer simular um Financiamento ou seria á vista??`;
    }
  
    if (p.includes('preço') || p.includes('valor')) {
      return `Esse modelo está disponível a partir de R$ 120.000,00. 
        💬 Podemos montar propostas sob medida, seja à vista ou financiado.
        Como você pretende realizar a compra?`;
    }
  
    if (p.includes('a vista') || p.includes('à vista')) {
      return `Ótimo! Pagamentos à vista têm **condições especiais** e descontos exclusivos. 
        💰 Posso te enviar agora a melhor proposta com bônus para pagamento imediato. Deseja?`;
    }
  
    if (p.includes('financiamento') || p.includes('parcelar')) {
      return `Temos financiamento com entrada a partir de 20% e parcelamento em até 60x. 
        Trabalhamos com diversos bancos para garantir a melhor taxa. 
        Quer simular com ou sem entrada?`;
    }
  
    if (p.includes('troca')) {
      return `Sim, aceitamos seu veículo na troca! 
        📷 Me envie fotos do seu carro atual ou informe os dados (modelo, ano, km) que avaliamos em instantes.`;
    }
  
    if (p.includes('test drive')) {
      return `Excelente! Fazer um test drive é essencial. 
        🚗 Tenho horários disponíveis essa semana para você conhecer o carro de perto.
        Quando seria melhor pra você? Posso agendar agora mesmo.`;
    }
  
    if (p.includes('visita') || p.includes('agendar')) {
      return `Sim! Podemos agendar uma visita à loja ou uma videochamada para apresentar o veículo ao vivo.
        📅 Qual o melhor dia e horário pra você? Eu reservo o atendimento personalizado.`;
    }
  
    if (p.includes('disponível') || p.includes('estoque')) {
      return `Temos esse modelo disponível no estoque, com entrega rápida e documentação em dia. 
        Deseja reservar agora ou prefere agendar uma visita?`;
    }
  
    if (p.includes('entrada') || p.includes('parcelas')) {
      return `Com uma entrada de 20%, conseguimos montar planos bem acessíveis. 
        Me diga o valor da entrada que você pensa em dar e eu já te mostro simulações em até 60x.`;
    }
  
    if (p.includes('garantia')) {
      return `Esse veículo tem garantia de fábrica, e também oferecemos **garantia estendida** por até 24 meses.
        Quer saber o que está incluso na cobertura? Posso te enviar agora.`;
    }
  
    return `Ótima pergunta! 😊 Estou aqui pra te ajudar a encontrar o melhor carro e negócio. 
        Me diga mais detalhes e já te passo uma proposta completa.`;
  }

  gerarMensagemVendaFake(): string {
    const carro = {
      marca: 'Peugeot',
      modelo: '2008',
      ano: 2023,
      motor: '1.6 Flex AT',
      km: 31000,
      valor: '77.000,00',
      caracteristicas: [
        'Câmbio automático de 6 marchas',
        'Central multimídia com espelhamento',
        'Rodas de liga leve aro 16',
        'Faróis com luz diurna (DRL)',
        'Ar-condicionado digital',
        'Controle de tração e estabilidade',
        'Piloto automático com limitador de velocidade'
      ]
    };

    return `🚗 Esse veículo é um ${carro.marca} ${carro.modelo} ${carro.ano}, motor ${carro.motor}, com ${carro.km.toLocaleString()} km rodados.
    💰 Está disponível por R$ ${carro.valor}, com possibilidade de financiamento em até 60x!
    
    Características principais:
    👉 ${carro.caracteristicas.join('\n👉 ')}
    
    ✅ Garantia de fábrica  
    ✅ Revisões em dia  
    ✅ Transferência grátis
    
    Deseja simular uma proposta ou agendar um Test Drive?`;

  }

  gerarMensagemVendaFakeMercedes(): string {
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
        \n💰 Está disponível por R$ ${carro.valor}, com possibilidade de financiamento em até 60x!

        \nCaracterísticas principais:
        👉 ${carro.caracteristicas.join('\n👉 ')}

        \n✅ Garantia de fábrica  
        \n✅ Revisões em dia  
        \n✅ Transferência grátis

        \nDeseja simular uma proposta ou agendar uma visita?`;
  }
}
