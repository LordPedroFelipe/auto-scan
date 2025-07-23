export interface NotificacaoPreferencia {
  tipo: string;
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
  push: boolean;
  frequencia: 'imediato' | 'diario' | 'semanal' | 'mensal';
}
