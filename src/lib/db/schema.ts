type Tipologia ={
  id: number;
  name: string;
}

type Localizacao ={
  id: number;
  name: string;
}

export type RealState = {
  temp_uuid: string;
  tipologia: Tipologia;
  localizacao: Localizacao;
  avaliable: string;
  preco: number;
  descricao: string;
  created_at: string;
  images: string[]; // Campo para URLs das imagens
};