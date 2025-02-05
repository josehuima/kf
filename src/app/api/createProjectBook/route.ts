import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
  );
}


    const supabase = createClient(supabaseUrl,supabaseAnonKey);
  
export const runtime = "edge";

export async function POST(req: Request) {
  
  try {
    const body = await req.json();
    const { descricao,tipologia, localizacao, userId } = body;

    const currentTimestamp = new Date().toISOString();


    // Inserir no Supabase
    const { data, error } = await supabase
      .from('imoveis')
      .insert({ 'descricao':descricao, 'tipologia':tipologia, 'localizacao':localizacao, 'userId': userId, 'created_at': currentTimestamp,'avaliable': true }).select();

    if (error) {
      console.error("Erro ao inserir no Supabase:", error);
      return new NextResponse("Erro interno", { status: 500 });
    }

    // Obter o ID do registro inserido
    const insertedId = data[0].temp_uuid;

    // Retorne uma resposta de sucesso com o ID
    return  NextResponse.json({project_id: insertedId});
  } catch (error) {
    console.error("Erro:", error);

    // Em caso de erro, retorne uma resposta de erro
    return new NextResponse("Erro interno", { status: 500 });
  }
}
