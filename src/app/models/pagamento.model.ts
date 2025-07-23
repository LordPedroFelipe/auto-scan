export interface Pagamento {
  id: number;
  plano: string;
  valor: number;
  metodo: 'pix' | 'cartao';
  data: string;
  status: 'Pago' | 'Pendente' | 'Cancelado';
}
