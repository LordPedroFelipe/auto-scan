export interface Loja {
    id?: number;
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    qtde_carros_estoque: number;
    data_cadastro?: Date;
    data_atualizacao?: Date;
}
  