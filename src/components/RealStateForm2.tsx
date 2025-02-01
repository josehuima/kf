// components/RealStateForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
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
  // Estados dos campos do formulário
  const [tipologiaId, setTipologiaId] = useState<number>(imovel.tipologia.id);
  const [localizacaoId, setLocalizacaoId] = useState<number>(imovel.localizacao.id);
  const [avaliable, setAvaliable] = useState(imovel.avaliable);
  const [preco, setPreco] = useState(imovel.preco);
  const [descricao, setDescricao] = useState(imovel.descricao);

  // Estado para armazenar os arquivos selecionados via drag and drop
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Estado para armazenar as URLs de pré-visualização dos arquivos
  const [previews, setPreviews] = useState<string[]>([]);

  // Configuração do react-dropzone
  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": []
    }
  });

  // Gerar URLs de preview e limpar quando os arquivos forem removidos
  useEffect(() => {
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Limpar URLs quando o componente for desmontado ou quando os arquivos mudarem
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica para salvar ou atualizar os dados, incluindo o upload das imagens
    console.log("Dados enviados:", {
      tipologiaId,
      localizacaoId,
      avaliable,
      preco,
      descricao,
      imagens: selectedFiles,
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

      {/* Área de Drag and Drop para Imagens */}
      <div>
        <label className="block font-medium mb-2">Imagens do Imóvel</label>
        <div
          {...getRootProps()}
          className={`border-dashed border-2 p-4 text-center cursor-pointer ${
            isDragActive ? "bg-gray-200" : "bg-white"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Solte os arquivos aqui...</p>
          ) : (
            <p>Arraste e solte algumas imagens aqui, ou clique para selecionar</p>
          )}
        </div>
        {/* Pré-visualização das Imagens */}
        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded" />
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Salvar
      </button>
    </form>
  );
};

export default RealStateForm;
