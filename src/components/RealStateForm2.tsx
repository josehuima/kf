"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import * as RadixProgress from "@radix-ui/react-progress";
import { Button } from "@radix-ui/themes";
import { RealState } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



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
  // Campos do formulário
  const [tipologiaId, setTipologiaId] = useState<string>(
    imovel.tipologia?.id?.toString() ?? ""
  );
  const [localizacaoId, setLocalizacaoId] = useState<string>(
    imovel.localizacao?.id?.toString() ?? ""
  );
  const [avaliable, setAvaliable] = useState<string>(
    imovel.avaliable?.toString() ?? ""
  );
  const [preco, setPreco] = useState<string>(imovel.preco?.toString() ?? "");
  const [descricao, setDescricao] = useState<string>(imovel.descricao ?? "");
  const [bairro, setBairro] = useState<string>(imovel.bairro ?? "");
  const [pontoReferencia, setPontoReferencia] = useState<string>(
    imovel.pontoReferencia ?? ""
  );
  const [naturezaId, setNaturezaId] = useState<string>(
    imovel.natureza?.id?.toString() ?? ""
  );
  const [quintalId, setQuintalId] = useState<string>(
    imovel.quintal?.id?.toString() ?? ""
  );
  const [realStateTypeId, setRealStateTypeId] = useState<string>(
    imovel.realStateType?.id?.toString() ?? ""
  );
  const [energyCertId, setEnergyCertId] = useState<string>(
    imovel.energyCert?.id?.toString() ?? ""
  );
  const [waterCertId, setWaterCertId] = useState<string>(
    imovel.waterCert?.id?.toString() ?? ""
  );

  const router = useRouter();

  // Estados para upload de novas imagens
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Estados para as imagens já salvas
  const [existingImages, setExistingImages] = useState<string[]>(
    imovel.images || []
  );
  const [removedExistingImages, setRemovedExistingImages] = useState<string[]>([]);

  // Configuração do Dropzone
  const onDrop = (acceptedFiles: File[]) => {
    console.log("Arquivos recebidos:", acceptedFiles);
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    setUploadProgress((prev) => [...prev, ...acceptedFiles.map(() => 0)]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  useEffect(() => {
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedFiles]);

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadProgress((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Função para remover imagem já salva (chama a rota DELETE)
  const handleRemoveExistingImage = async (fullUrl: string, index: number) => {
    try {
      // Extraia o caminho relativo a partir do URL completo.
      // Supondo que o URL contenha a parte "/kubico-facil/", a parte após essa string é o caminho relativo.
      const parts = fullUrl.split("/kubico-facil/");
      if (parts.length < 2) {
        throw new Error("Formato do URL inválido");
      }
      const relativePath = parts[1];
      console.log("Caminho relativo extraído:", relativePath);
      
      const response = await fetch("/api/deletePhotos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: imovel.temp_uuid, filePath: relativePath }),
      });
      const data = await response.json();
     
      if (response.ok) {
        toast.success("Imagem removida com sucesso!");
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast.error("Erro ao remover a imagem: " + data.error);
      }
    } catch (error) {
      console.error("Erro ao remover a imagem:", error);
      toast.error("Erro ao remover a imagem.");
    }
  };
  

  // Converte arquivo para Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        console.log(`Arquivo ${file.name} convertido para base64 (início):`, result.substring(0, 30));
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error(`Erro na conversão de ${file.name}:`, error);
        reject(error);
      };
    });
  };

  // Simula o upload com progressão aleatória
  const simulateUpload = (fileIndex: number): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress > 100) progress = 100;
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          newProgress[fileIndex] = progress;
          return newProgress;
        });
        console.log(`Progresso do arquivo ${selectedFiles[fileIndex].name}: ${progress}%`);
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 300);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const newImages =
      selectedFiles.length > 0
        ? await Promise.all(
            selectedFiles.map(async (file, index) => {
              console.log(`Iniciando upload do arquivo: ${file.name}`);
              await simulateUpload(index);
              const base64 = await fileToBase64(file);
              console.log(`Upload simulado finalizado para: ${file.name}`);
              return { fileName: file.name, base64 };
            })
          )
        : [];

    const payload = {
      projectId: imovel.temp_uuid,
      tipologiaId: tipologiaId === "" ? null : Number(tipologiaId),
      localizacaoId: localizacaoId === "" ? null : Number(localizacaoId),
      avaliable: avaliable === "" ? null : avaliable,
      preco: preco === "" ? null : Number(preco),
      descricao: descricao === "" ? null : descricao,
      bairro: bairro === "" ? null : bairro,
      naturezaId: naturezaId === "" ? null : Number(naturezaId),
      quintalId: quintalId === "" ? null : Number(quintalId),
      pontoReferencia: pontoReferencia === "" ? null : pontoReferencia,
      energyCertId: energyCertId === "" ? null : Number(energyCertId),
      waterCertId: waterCertId === "" ? null : Number(waterCertId),
      realStateTypeId: realStateTypeId === "" ? null : Number(realStateTypeId),
      newImages, // Novas imagens para salvar
    };


    try {
      const response = await fetch("/api/saveNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
     
      if (response.ok) {
        setShowSuccess(true);
        toast.success("Imóvel atualizado com sucesso!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } else {
        toast.error("Erro ao atualizar o imóvel.");
      }
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      toast.error("Erro ao enviar os dados do imóvel.");
    } finally {
      setIsUploading(false);
    }
  }
  
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
  <option value="" disabled>
    Selecione o tipo
  </option>
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
          onChange={(e) => setLocalizacaoId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="" disabled>
    Selecione o tipo
  </option>
          {localizacoes.map((l) => (
            <option key={l.id} value={l.id.toString()}>
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
          onChange={(e) => setPreco(e.target.value)}
          className="w-full border p-2 rounded"
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
          onChange={(e) => setNaturezaId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="" disabled>
    Selecione o tipo
  </option>
          {naturezas.map((n) => (
            <option key={n.id} value={n.id.toString()}>
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
          onChange={(e) => setQuintalId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="" disabled>
    Selecione o tipo
  </option>
          {quintalCerts.map((q) => (
            <option key={q.id} value={q.id.toString()}>
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
          onChange={(e) => setRealStateTypeId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="" disabled>
    Selecione o tipo
  </option>
          {realStateTypes.map((rt) => (
            <option key={rt.id} value={rt.id.toString()}>
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
          onChange={(e) => setEnergyCertId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="" disabled>
    Selecione o tipo
  </option>
          {energyCerts.map((ec) => (
            <option key={ec.id} value={ec.id.toString()}>
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
          onChange={(e) => setWaterCertId(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="" disabled>
    Selecione o tipo
  </option>
          {waterCerts.map((wc) => (
            <option key={wc.id} value={wc.id.toString()}>
              {wc.name}
            </option>
          ))}
        </select>
      </div>
      {/* Descrição */}
      <div>
        <label htmlFor="detalhes" className="block text-orange-600 font-medium">
          Mais detalhes
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border p-2 rounded"
          rows={4}
        />
      </div>

 {/* Seção de upload de novas imagens */}
 <div>
        <label className="block text-orange-600 font-medium mb-2">
          Imagens do Imóvel (novas)
        </label>
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
            <p>Arraste e solte ou clique para selecionar imagens</p>
          )}
        </div>
        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {previews.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded" />
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
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="space-y-1">
                <p className="text-sm font-medium text-orange-600">{file.name}</p>
                <RadixProgress.Root className="relative overflow-hidden h-4 rounded-full bg-gray-200 w-full">
                  <RadixProgress.Indicator
                    style={{ width: `${uploadProgress[index] || 0}%` }}
                    className="bg-orange-500 h-full transition-all duration-300 ease-out"
                  />
                </RadixProgress.Root>
                <p className="text-sm text-gray-600">{uploadProgress[index] || 0}%</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seção de imagens já salvas */}
      {existingImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg text-orange-600 font-medium">Imagens já salvas</h3>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Imagem ${index}`} className="w-full h-32 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(url, index)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded" disabled={isUploading}>
        {isUploading ? "Enviando..." : "Salvar"}
      </Button>

      <ToastContainer />
    </form>
  );
};

export default RealStateForm;