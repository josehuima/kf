// Força o runtime Node para garantir que Buffer esteja disponível
export const runtime = "node";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sanitizeFileName } from "@/lib/utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getContentType = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};

export async function POST(req: Request) {
  try {
    console.log("Início da requisição POST em /api/saveNote");

    // Recebe e loga o payload
    const body = await req.json();
    console.log("Payload recebido:", JSON.stringify(body, null, 2));

    const {
      projectId,
      tipologiaId,
      localizacaoId,
      avaliable,
      preco,
      descricao,
      bairro,
      naturezaId,
      quintalId,
      pontoReferencia,
      energyCertId,
      waterCertId,
      realStateTypeId,
      images, // array de objetos: { fileName: string, base64: string }
    } = body;

    if (!projectId) {
      console.error("Erro: projectId ausente no payload.");
      return new NextResponse("O projectId é obrigatório", { status: 400 });
    }

    // Busca o imóvel no banco
    console.log(`Buscando imóvel com temp_uuid: ${projectId}`);
    const { data: imoveis, error: selectError } = await supabase
      .from("imoveis")
      .select("*")
      .eq("temp_uuid", projectId);
    if (selectError || !imoveis || imoveis.length !== 1) {
      console.error("Erro na consulta de imóvel:", selectError, "Imóveis encontrados:", imoveis);
      return new NextResponse("Imóvel não encontrado ou múltiplos registros encontrados", { status: 404 });
    }
    console.log("Imóvel encontrado:", imoveis[0]);

    // Atualiza os dados do imóvel
    console.log("Atualizando dados do imóvel no banco de dados");
    const { error: updateError } = await supabase
      .from("imoveis")
      .update({
        tipologia: tipologiaId,
        localizacao: localizacaoId,
        avaliable: avaliable,
        preco: preco,
        descricao: descricao,
        bairro: bairro,
        natureza: naturezaId,
        quintal: quintalId,
        pontoReferencia: pontoReferencia,
        energyCert: energyCertId,
        waterCert: waterCertId,
        realStateType: realStateTypeId,
      })
      .eq("temp_uuid", projectId);
    if (updateError) {
      console.error("Erro na atualização do imóvel:", updateError);
      return new NextResponse("Falha ao atualizar os dados do imóvel", { status: 500 });
    }
    console.log("Dados do imóvel atualizados com sucesso.");

    // Processa o upload de imagens, se houver
    if (images && Array.isArray(images) && images.length > 0) {
      console.log(`Processando ${images.length} imagem(ns)...`);
      for (const image of images) {
        const { fileName, base64 } = image;
        if (!fileName || !base64) {
          console.warn("Imagem ignorada por falta de fileName ou base64:", image);
          continue;
        }

        const safeFileName = sanitizeFileName(fileName);
        console.log(`Arquivo "${fileName}" convertido para safeFileName: "${safeFileName}"`);

        // Define o caminho de upload
        const filePath = `imoveis/${projectId}/${safeFileName}`;
        console.log("Caminho de upload definido:", filePath);

        // Converte a string base64 para um Buffer
        const buffer = Buffer.from(base64, "base64");
        console.log(`Buffer criado para "${fileName}" - tamanho: ${buffer.length} bytes`);

        // Realiza o upload para o Storage
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("kubico-facil")
          .upload(filePath, buffer, { contentType: getContentType(fileName) });
        if (uploadError) {
          console.error(`Erro no upload de "${fileName}":`, uploadError);
          console.error("Dados do upload:", { photo_path: filePath, property_id: projectId });
          continue;
        }
        console.log(`Upload realizado com sucesso para "${fileName}". Dados do upload:`, uploadData);

        // Insere o registro na tabela property_photos
        const { error: photoInsertError, data: photoInsertData } = await supabase
          .from("property_photos")
          .insert([{ photo_path: filePath, property_id: projectId }]);
        if (photoInsertError) {
          console.error(`Erro ao inserir registro para "${fileName}" na tabela property_photos:`, photoInsertError);
          continue;
        }
        console.log(`Registro inserido na tabela property_photos para "${fileName}". Dados:`, photoInsertData);
      }
    } else {
      console.log("Nenhuma imagem para processar.");
    }

    console.log("Finalizando processamento e retornando resposta de sucesso.");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}