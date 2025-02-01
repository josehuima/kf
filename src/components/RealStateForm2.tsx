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

const RealStateForm: React.FC<RealStateFormProps> = ({
  imovel,
  tipologias,
  localizacoes,
}) => {
  // Estados dos campos do formulário
  const [tipologiaId, setTipologiaId] = useState<number>(imovel.tipologia.id);
  const [localizacaoId, setLocalizacaoId] = useState<number>(
    imovel.localizacao.id
  );
  const [avaliable, setAvaliable] = useState(imovel.avaliable);
  const [preco, setPreco] = useState(imovel.preco);
  const [descricao, setDescricao] = useState(imovel.descricao);

  // Estados para imagens
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Configuração do react-dropzone
  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  useEffect(() => {
    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const removeImage = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Função para converter um arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // O resultado é algo como "data:image/jpeg;base64,....."
        // Retiramos o prefixo para enviar apenas a string base64
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Converter os arquivos selecionados para base64
    const images =
      selectedFiles.length > 0
        ? await Promise.all(
            selectedFiles.map(async (file) => {
              const base64 = await fileToBase64(file);
              return {
                fileName: file.name,
                base64,
              };
            })
          )
        : [];

    // Montar o objeto com os dados a serem enviados
    const payload = {
      projectId: imovel.temp_uuid,
      tipologiaId,
      localizacaoId,
      avaliable,
      preco,
      descricao,
      images,
    };

    try {
      const response = await fetch("/api/saveNote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Aqui você pode dar um feedback positivo ao usuário (ex: toast, redirecionamento, etc.)
        alert("Imóvel atualizado com sucesso!");
      } else {
        // Caso a resposta não seja OK, trate o erro
        alert("Erro ao atualizar o imóvel.");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      alert("Erro ao enviar os dados do imóvel.");
    }
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
        {/* Pré-visualização das Imagens com opção de remoção */}
        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Remover
                </button>
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
