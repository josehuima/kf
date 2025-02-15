// runtime configurado para Node.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Rota DELETE para remover uma imagem associada a um imóvel.
 * O payload deve conter:
 * - projectId: ID do imóvel (temp_uuid)
 * - filePath: Caminho do arquivo no bucket (por exemplo, "imoveis/<projectId>/<safeFileName>")
 */
export async function DELETE(req: Request) {
  try {
    console.log("=== Início da requisição DELETE em /api/removeImage ===");
    
    // Recebe o payload
    const body = await req.json();
    console.log("Payload recebido:", JSON.stringify(body, null, 2));

    const { projectId, filePath } = body;

    if (!projectId || !filePath) {
      console.error("Erro: projectId e filePath são obrigatórios.");
      return NextResponse.json(
        { success: false, error: "projectId e filePath são obrigatórios." },
        { status: 400 }
      );
    }

    // 1. Remove o arquivo do Storage
    console.log(`Removendo arquivo do bucket. Caminho: ${filePath}`);
    const { error: removeError, data: removeData } = await supabase.storage
      .from("kubico-facil")
      .remove([filePath]);

    if (removeError) {
      console.error("Erro ao remover o arquivo do Storage:", removeError);
      return NextResponse.json(
        { success: false, error: removeError.message },
        { status: 500 }
      );
    }
    console.log("Arquivo removido do Storage:", removeData);

    // 2. Remove o registro da tabela property_photos
    console.log(`Removendo registro do banco para photo_path: ${filePath} e property_id: ${projectId}`);
    const { error: deleteError, data: deleteData } = await supabase
      .from("property_photos")
      .delete()
      .eq("photo_path", filePath)
      .eq("property_id", projectId);

    if (deleteError) {
      console.error("Erro ao remover registro na tabela property_photos:", deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }
    console.log("Registro removido da tabela property_photos:", deleteData);

    console.log("=== Fim da requisição DELETE em /api/removeImage ===");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro na rota DELETE:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}
