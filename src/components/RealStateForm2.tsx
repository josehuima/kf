"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { RealState } from "@/lib/db/schema";
import * as RadixProgress from "@radix-ui/react-progress";
import { Button } from "@radix-ui/themes";

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

  // Estados para imagens novas
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Estados para imagens já salvas
  const [existingImages, setExistingImages] = useState<string[]>(imovel.images || []);
  // Se necessário, armazene as imagens removidas para enviar ao backend e deletar do Storage/DB
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);

  // Configuração do react-dropzone
  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setUploadProgress((prev) => [
      ...prev,
      ...acceptedFiles.map(() => 0),
    ]);
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
    setUploadProgress((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    // Armazena a URL (ou outra informação de identificação) da imagem removida
    setRemovedExistingImages((prev) => [...prev, existingImages[index]]);
    // Remove da lista de imagens já salvas
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Função para converter um arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1]; // remove o prefixo
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Função para simular o upload de um arquivo, atualizando o progresso
  const simulateUpload = (fileIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          newProgress[fileIndex] = progress;
          return newProgress;
        });
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 200);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    // Se houver arquivos novos, simula o upload e converte cada um para base64
    const newImages =
      selectedFiles.length > 0
        ? await Promise.all(
            selectedFiles.map(async (file, index) => {
              await simulateUpload(index);
              const base64 = await fileToBase64(file);
              return {
                fileName: file.name,
                base64,
              };
            })
          )
        : [];

    // Monta o objeto com os dados a serem enviados
    const payload = {
      projectId: imovel.temp_uuid,
      tipologiaId,
      localizacaoId,
      avaliable,
      preco,
      descricao,
      newImages, // imagens novas a serem salvas
      // Envia também as imagens removidas para que o backend possa removê-las do Storage/DB
      removedImages: removedExistingImages,
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
        alert("Imóvel atualizado com sucesso!");
      } else {
        alert("Erro ao atualizar o imóvel.");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      alert("Erro ao enviar os dados do imóvel.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campo Tipologia */}
      <div>
        <label htmlFor="tipologia" className="block text-orange-600 font-medium">
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
        <label htmlFor="localizacao" className="block text-orange-600 font-medium">
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



      {/* Campo Preço */}
      <div>
        <label htmlFor="preco" className="block text-orange-600 font-medium">
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
        <label htmlFor="descricao" className="block text-orange-600 font-medium">
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

      {/* Área de Drag and Drop para Imagens Novas */}
      <div>
        <label className="block text-orange-600 font-medium mb-2">Imagens do Imóvel (novas)</label>
        <div
          {...getRootProps()}
          className={`border-dashed border-2 border-orange-600 text-orange-600 p-4 text-center cursor-pointer ${
            isDragActive ? "bg-gray-200" : "bg-white"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Solte os arquivos aqui...</p>
          ) : (
            <p>
              Arraste e solte algumas imagens aqui, ou clique para selecionar
            </p>
          )}
        </div>

        {/* Pré-visualização das Imagens Novas com opção de remoção */}
        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Barras de Progresso para cada nova imagem */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index}>
                <p className="text-sm">
                  {file.name} - {uploadProgress[index] || 0}%
                </p>
                <RadixProgress.Root
                  value={uploadProgress[index] || 0}
                  max={100}
                  className="h-4 w-full overflow-hidden rounded bg-gray-200"
                >
                  <RadixProgress.Indicator
                    style={{ width: `${uploadProgress[index] || 0}%` }}
                    className="h-full bg-blue-500 transition-all"
                  />
                </RadixProgress.Root>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Área para exibir e remover as imagens já salvas */}
      {existingImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg text-orange-600 font-medium">Imagens já salvas</h3>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Imagem ${index}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded"
        disabled={isUploading}
      >
        {isUploading ? "Enviando..." : "Salvar"}
      </Button>
    </form>
  );
};

export default RealStateForm;
