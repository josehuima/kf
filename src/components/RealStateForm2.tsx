"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as RadixProgress from "@radix-ui/react-progress";
import { Button } from "@radix-ui/themes";
import { RealState } from "@/lib/db/schema";

export type Option = {
  id: number;
  name: string;
};

interface RealStateFormProps {
  imovel: RealState;
  tipologias: Option[];
  localizacoes: Option[];
  naturezas: Option[];
  quintalCerts: Option[];
  realStateTypes: Option[];
  energyCerts: Option[];
  waterCerts: Option[];
}

const RealStateForm: React.FC<RealStateFormProps> = ({
  imovel,
  tipologias,
  localizacoes,
  naturezas,
  quintalCerts,
  realStateTypes,
  energyCerts,
  waterCerts,
}) => {
  // Estados para os campos já existentes
  const [tipologiaId, setTipologiaId] = useState<string>(
    imovel.tipologia?.id?.toString() ?? ''
  );
  
  const [localizacaoId, setLocalizacaoId] = useState<number | string>(
    imovel.localizacao?.id
  );
  
  const [avaliable, setAvaliable] = useState(
    imovel.avaliable
  );
  
  const [preco, setPreco] = useState(
    imovel.preco
  );
  
  const [descricao, setDescricao] = useState<string>(
    imovel.descricao
  );
  
  const [bairro, setBairro] = useState<string>(
    imovel.bairro
  );
  
  const [pontoReferencia, setPontoReferencia] = useState<string>(
    imovel.pontoReferencia
  );
  
  const [naturezaId, setNaturezaId] = useState<number | string>(
    imovel.natureza?.id
  );
  
  const [quintalId, setQuintalId] = useState<number | string>(
    imovel.quintal?.id
  );
  
  const [realStateTypeId, setRealStateTypeId] = useState<number | string>(
    imovel.realStateType?.id
  );
  
  const [energyCertId, setEnergyCertId] = useState<number | string>(imovel.energyCert?.id
  );
  
const [waterCertId, setWaterCertId] = useState<number | string>(imovel.waterCert?.id);
  
  // Estados para upload de novas imagens
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Estados para as imagens já salvas
  const [existingImages, setExistingImages] = useState<string[]>(imovel.images || []);
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);

  // Configuração do dropzone
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
    setRemovedExistingImages((prev) => [...prev, existingImages[index]]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Converte arquivo para Base64
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

  // Simula upload atualizando o progresso
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

    // Upload e conversão para base64 de novas imagens, se houver
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

    // Monta o payload com os dados do formulário
    const payload = {
      projectId: imovel.temp_uuid,
      tipologiaId: tipologiaId === '' ? null : Number(tipologiaId),
      localizacaoId: localizacaoId === '' ? null : localizacaoId,
      avaliable: avaliable === '' ? null : avaliable,
      preco: preco,
      descricao: descricao === '' ? null : descricao,
      bairro: bairro === '' ? null : bairro,
      naturezaId: naturezaId === '' ? null : naturezaId,
      quintalId: quintalId === '' ? null : quintalId,
      pontoReferencia: pontoReferencia === '' ? null : pontoReferencia,
      energyCertId: energyCertId === '' ? null : energyCertId,
      waterCertId: waterCertId === '' ? null : waterCertId,
      realStateTypeId: realStateTypeId === '' ? null : realStateTypeId,
      newImages, // Novas imagens para salvar
      removedImages: removedExistingImages, // Imagens removidas para exclusão no backend
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

  console.log('Localizaçao id: ', localizacaoId);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Tipologia */}
      <div>
        <label htmlFor="tipologia" className="block text-orange-600 font-medium">
          Tipologia
        </label>
        <select
          id="tipologia"
          value={tipologiaId}
          onChange={(e) => setTipologiaId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          {tipologias.map((t) => (
            <option key={t.id} value={t.id.toString()}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Localização */}
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

      {/* Preço */}
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

      {/* Descrição */}
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

      {/* Data de Criação (apenas exibição) */}
      <div>
        <label htmlFor="created_at" className="block text-orange-600 font-medium">
          Data de Criação
        </label>
        <input
          id="created_at"
          type="text"
          value={imovel.created_at}
          disabled
          className="w-full border p-2 rounded bg-gray-100"
        />
      </div>

      {/* Bairro */}
      <div>
        <label htmlFor="bairro" className="block text-orange-600 font-medium">
          Bairro
        </label>
        <input
          id="bairro"
          type="text"
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Ponto de Referência */}
      <div>
        <label htmlFor="pontoReferencia" className="block text-orange-600 font-medium">
          Ponto de Referência
        </label>
        <input
          id="pontoReferencia"
          type="text"
          value={pontoReferencia}
          onChange={(e) => setPontoReferencia(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Natureza */}
      <div>
        <label htmlFor="natureza" className="block text-orange-600 font-medium">
          Natureza
        </label>
        <select
          id="natureza"
          value={naturezaId}
          onChange={(e) => setNaturezaId(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          {naturezas.map((n) => (
            <option key={n.id} value={n.id}>
              {n.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quintal */}
      <div>
        <label htmlFor="quintal" className="block text-orange-600 font-medium">
          Quintal
        </label>
        <select
          id="quintal"
          value={quintalId}
          onChange={(e) => setQuintalId(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          {quintalCerts.map((q) => (
            <option key={q.id} value={q.id}>
              {q.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de Imóvel */}
      <div>
        <label htmlFor="realStateType" className="block text-orange-600 font-medium">
          Tipo de Imóvel
        </label>
        <select
          id="realStateType"
          value={realStateTypeId}
          onChange={(e) => setRealStateTypeId(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          {realStateTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Certificação de Energia */}
      <div>
        <label htmlFor="energyCert" className="block text-orange-600 font-medium">
          Certificação de Energia
        </label>
        <select
          id="energyCert"
          value={energyCertId}
          onChange={(e) => setEnergyCertId(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          {energyCerts.map((ec) => (
            <option key={ec.id} value={ec.id}>
              {ec.name}
            </option>
          ))}
        </select>
      </div>

      {/* Certificação de Água */}
      <div>
        <label htmlFor="waterCert" className="block text-orange-600 font-medium">
          Certificação de Água
        </label>
        <select
          id="waterCert"
          value={waterCertId}
          onChange={(e) => setWaterCertId(Number(e.target.value))}
          className="w-full border p-2 rounded"
        >
          {waterCerts.map((wc) => (
            <option key={wc.id} value={wc.id}>
              {wc.name}
            </option>
          ))}
        </select>
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
