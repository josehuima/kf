type Tipologia ={
  id: number;
  name: string;
}

type Localizacao ={
  id: number;
  name: string;
}


// vivenda ou apartamento
type Natureza ={
  id: number;
  name: string;
}

// RealState type

//isolada ou condominio
type RealStateType = {
id: number;
name: string
}

// rede publica ou gerador
type EnergyCert = {
  id: number;
  name: string;
}

type WaterCert = {
  id: number;
  name: string;
}

type QuintalCert = {
  id: number;
  name: string
}


export type RealState = {
  temp_uuid: string;
  tipologia: Tipologia;
  localizacao: Localizacao;
  avaliable: string;
  preco: number;
  descricao: string;
  created_at: string;
  bairro: string;
  natureza: Natureza;
  quintal: QuintalCert;
  pontoReferencia: string;
  energyCert: EnergyCert;
  waterCert: WaterCert;
  realStateType: RealStateType;
  images: string[]; // Campo para URLs das imagens
};



export type Reservation = {
  temp_uuid: string;
  name: string;
  email: string;
  phone: string;
  reservationDate: string;
  propertyId: string;
  created_at: string;
};