export interface Veiculo {
  id: number;
  modelo: string;
  marca: string;
  ano: number;
  preco: number;
  status: 'disponível' | 'vendido';
}
