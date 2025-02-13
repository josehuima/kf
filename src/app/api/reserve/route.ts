import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use as variáveis de ambiente públicas ou adapte para as variáveis privadas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone,  property_id } = body;

    // Validação simples dos campos obrigatórios
    if (!name || !email || !phone  || !property_id) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios ausentes." },
        { status: 400 }
      );
    }

    // Insere os dados na tabela "reservations"
    // Ajuste os nomes dos campos conforme seu schema
    const { data, error } = await supabase.from("reserve").insert([
      {
        name,
        email,
        phone, 
        property_id: property_id,
      },
    ]);

    if (error) {
      console.error("Erro ao inserir a reserva:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("Erro na API de reserva:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
