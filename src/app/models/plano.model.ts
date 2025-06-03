export interface Plano {
    nome: string;
    preco: number;
    descricao: string;
    beneficios: string[];
    destaque?: boolean; // para destacar o Premium visualmente
  }
  