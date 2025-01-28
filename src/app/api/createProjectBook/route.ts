import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
    const supabase = createClient('https://iehsmuxjlrzfwordijiy.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHNtdXhqbHJ6ZndvcmRpaml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEzMzkzNjcsImV4cCI6MjAxNjkxNTM2N30.8hmf2igDjxqcd6WH0LgxLhhzp1z5ll4TZ1hTEiKYRYM');
  
export const runtime = "edge";

export async function POST(req: Request) {
  
  try {
    const body = await req.json();
    const { name, userId, estado } = body;

    const currentTimestamp = new Date().toISOString();


    // Inserir no Supabase
    const { data, error } = await supabase
      .from('folders')
      .insert({ 'name':name, 'userId': userId, 'criated': currentTimestamp,'statusType': estado }).select();

    if (error) {
      console.error("Erro ao inserir no Supabase:", error);
      return new NextResponse("Erro interno", { status: 500 });
    }

    // Obter o ID do registro inserido
    const insertedId = data[0].id;

    // Retorne uma resposta de sucesso com o ID
    return  NextResponse.json({project_id: insertedId});
  } catch (error) {
    console.error("Erro:", error);

    // Em caso de erro, retorne uma resposta de erro
    return new NextResponse("Erro interno", { status: 500 });
  }
}
