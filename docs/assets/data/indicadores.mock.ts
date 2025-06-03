import { Indicador } from '../../app/models/indicador.model';

export const INDICADORES_MOCK: Indicador[] = [
  {
    titulo: 'Veículos no Estoque',
    valor: 47,
    icone: '🚗',
    cor: '#0A84FF'
  },
  {
    titulo: 'Leads Recebidos',
    valor: 132,
    icone: '👥',
    cor: '#009688'
  },
  {
    titulo: 'Test Drives Marcados',
    valor: 21,
    icone: '🗓️',
    cor: '#FF9800'
  },
  {
    titulo: 'Mensagens Não Lidas',
    valor: 7,
    icone: '💬',
    cor: '#F44336'
  },
  {
    titulo: 'Taxa de Conversão',
    valor: '12.4%',
    icone: '📈',
    cor: '#3F51B5'
  },
  {
    titulo: 'Último Acesso da Equipe',
    valor: '03/06/2025 14:42',
    icone: '🕒',
    cor: '#607D8B'
  }
];
