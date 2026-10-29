
export interface Navegacao {
  podePrimeiro: boolean;
  podePrev: boolean;
  podeNext: boolean;
  podeUltimo: boolean;
}

export interface Page {
  lista: Array<any>;
  offset: number;
  paginaAtual: number;
  navegacao: Navegacao;
}
