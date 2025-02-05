import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sanitizeFileName } from "@/lib/utils"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função auxiliar para extrair o content type a partir do nome do arquivo
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
    const body = await req.json();
    const {
      projectId,
      tipologiaId,
      localizacaoId,
      avaliable,
      preco,
      descricao,
      images // array de objetos: { fileName: string, base64: string }
    } = body;

    // Validação simples
    if (!projectId) {
      return new NextResponse("O projectId é obrigatório", { status: 400 });
    }

    // Consulta para encontrar o imóvel utilizando o campo temp_uuid
    const { data: imoveis, error: selectError } = await supabase
      .from("imoveis")
      .select("*")
      .eq("temp_uuid", projectId);

    if (selectError || !imoveis || imoveis.length !== 1) {
      return new NextResponse("Imóvel não encontrado ou múltiplos registros encontrados", { status: 404 });
    }

    // Atualiza os dados do imóvel
    const { error: updateError } = await supabase
      .from("imoveis")
      .update({
        tipologia_id: tipologiaId,
        localizacao_id: localizacaoId,
        avaliable,
        preco,
        descricao
      })
      .eq("temp_uuid", projectId);

    if (updateError) {
      return new NextResponse("Falha ao atualizar os dados do imóvel", { status: 500 });
    }

    // Se houver imagens para processar, faça o upload para o Storage e registre na tabela property_photos
    if (images && Array.isArray(images) && images.length > 0) {
      // Para cada imagem, gere o caminho e realize o upload
      for (const image of images) {
        const { fileName, base64 } = image;
        if (!fileName || !base64) continue;

        const safeFileName = sanitizeFileName(fileName)

        // Define o caminho da pasta como "imoveis/<temp_uuid>/"
        const filePath = `imoveis/${projectId}/${safeFileName}`;

        // Converte a string base64 para um Buffer
        const buffer = Buffer.from(base64, "base64");

        // Realiza o upload para o bucket (substitua "kubico-facil" pelo nome do seu bucket, se necessário)
        const { error: uploadError } = await supabase.storage
          .from("kubico-facil")
          .upload(filePath, buffer, {
            contentType: getContentType(fileName)
          });

          if (uploadError) {
            console.error(`Erro ao inserir registro para ${fileName}:`, uploadError.message);
            console.error(`Dados que estão sendo inseridos:`, {
              photo_path: filePath,
              property_id: projectId
            });
            continue;
          }
          

        // Após o upload, registre o caminho na tabela property_photos
        const { error: photoInsertError } = await supabase
          .from("property_photos")
          .insert([
            {
              photo_path: filePath,
              property_id: projectId
            }
          ]);

        if (photoInsertError) {
          console.error(`Erro ao inserir registro para ${fileName}:`, photoInsertError.message);
          continue;
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
