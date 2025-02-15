export const runtime = "nodejs"; // Para usar APIs Node (Clerk) sem Edge

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@radix-ui/themes";
import { Separator } from "@/components/ui/separator";
import CreateNoteDialog from "@/components/CreateNoteDialog";
import DeleteNoteButton from "@/components/DeleteNoteButton";
import { formatDateDistance } from "../lib/utils";

// IDs de admin
const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
    );
  }

  // 1. Autenticação e verificação de admin
  const { userId } = await auth();
  const userIsAdmin = userId && adminIds.includes(userId);

  // 2. Paginação
  const page = parseInt(searchParams?.page || "1", 10) || 1;
  const pageSize = 8;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // 3. Inicializa Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 4. Monta query base
  let query = supabase
    .from("imo")
    .select("*", { count: "exact" })
    .range(start, end);

  // Se não for admin, filtra pelo userId
  if (!userIsAdmin) {
    query = query.eq("userId", userId);
  }

  // Executa query
  const { data: notes, count, error } = await query;
  if (error) {
    throw new Error("Erro ao buscar anúncios: " + error.message);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return (
    <div className="grainy min-h-screen p-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button className="bg-orange-600" size="3">
            <ArrowLeft className="mr-1 w-4 h-4" />
            Voltar
          </Button>
        </Link>
        <h4 className="font-bold text-orange-900">
          {userIsAdmin ? "Todos os anúncios" : "Meus anúncios"}
        </h4>
      </div>

      <Separator className="my-4" />

      {/* Grid de anúncios */}
      <div className="grid sm:grid-cols-9 md:grid-cols-5 grid-cols-1 gap-2">
        <CreateNoteDialog />

        {(!notes || notes.length === 0) ? (
          <div className="col-span-full text-center">
            <h2 className="text-xl text-gray-500">Nenhum anúncio encontrado.</h2>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.temp_uuid} className="flex flex-col gap-2">
              <Link href={`/notebook/${note.temp_uuid}`}>
                <div className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                  <Image
                    alt={note.natureza?.name}
                    width={100}
                    height={50}
                    src="notepad.svg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {note.natureza?.name || "N/A"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDateDistance(note.created_at)}
                    </p>
                  </div>
                </div>
              </Link>
              <DeleteNoteButton noteId={note.temp_uuid} />
            </div>
          ))
        )}
      </div>

      {/* Paginação */}
      <div className="mt-8 flex gap-4 items-center">
        {page > 1 && (
          <Link href={`?page=${page - 1}`}>
            <Button variant="solid" color="orange">
              Anterior
            </Button>
          </Link>
        )}
        <span className="text-gray-600">
          Página {page} de {totalPages}
        </span>
        {page < totalPages && (
          <Link href={`?page=${page + 1}`}>
            <Button variant="solid" color="orange">
              Próxima
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
