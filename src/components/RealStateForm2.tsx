// components/RealStateForm.tsx
"use client";

import React, { useState } from "react";
import { RealState } from "@/lib/db/schema";

export type Option = {
  id: number;
  name: string;
};

interface RealStateFormProps {
  imovel: RealState;
  tipologias: Option[];
  localizacoes: Option[];
}

const RealStateForm: React.FC<RealStateFormProps> = ({ imovel, tipologias, localizacoes }) => {
  // Utiliza o id da opção como valor
  const [tipologiaId, setTipologiaId] = useState<number>(imovel.tipologia.id);
  const [localizacaoId, setLocalizacaoId] = useState<number>(imovel.localizacao.id);
  const [avaliable, setAvaliable] = useState(imovel.avaliable);
  const [preco, setPreco] = useState(imovel.preco);
  const [descricao, setDescricao] = useState(imovel.descricao);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica para salvar ou atualizar os dados
    console.log("Dados enviados:", {
      tipologiaId,
      localizacaoId,
      avaliable,
      preco,
      descricao,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo Tipologia */}
      <div>
        <label htmlFor="tipologia" className="block font-medium">
          Tipologia
        </label>
        <select
          id="tipologia"
          value={tipologiaId}
          onChange={(e) => setTipologiaId(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          {tipologias.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo Localização */}
      <div>
        <label htmlFor="localizacao" className="block font-medium">
          Localização
        </label>
        <select
          id="localizacao"
          value={localizacaoId}
          onChange={(e) => setLocalizacaoId(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          {localizacoes.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo Disponibilidade */}
      <div>
        <label htmlFor="avaliable" className="block font-medium">
          Disponibilidade
        </label>
        <input
          id="avaliable"
          type="text"
          value={avaliable}
          onChange={(e) => setAvaliable(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Campo Preço */}
      <div>
        <label htmlFor="preco" className="block font-medium">
          Preço
        </label>
        <input
          id="preco"
          type="number"
          value={preco}
          onChange={(e) => setPreco(Number(e.target.value))}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Campo Descrição */}
      <div>
        <label htmlFor="descricao" className="block font-medium">
          Descrição
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
        />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Salvar
      </button>
    </form>
  );
};

export default RealStateForm;
