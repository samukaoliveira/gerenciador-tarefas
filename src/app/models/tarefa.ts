
export enum Classificacao {
  baixo = 1,
  medio = 2,
  alto = 3,
  urgente = 4
}

export interface Tarefa {
  id?: number;
  descricao: string;
  concluido: boolean;
  data: Date;
  classificacao: Classificacao;
}
