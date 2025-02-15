// app/dashboard/page.tsx (Server Component)
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

// Next.js 13: Recebemos `searchParams` no 1º parâmetro do componente
export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não definidas."
    );
  }

  // Pega o userId via Clerk
  const { userId } = await auth();
  // Verifica se é admin
  const userIsAdmin = userId && adminIds.includes(userId);

  // Lê a página atual da URL, default = 1
  const page = parseInt(searchParams?.page || "1", 10) || 1;
  const pageSize = 5; // quantos itens por página
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // Inicializa supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Busca com paginação
  let query = supabase
    .from("imo")
    .select("*", { count: "exact" }) // count: "exact" retorna contagem total
    .range(start, end);

  if (!userIsAdmin) {
    // se não for admin, filtra pelo userId
    query = query.eq("userId", userId);
  }

  const { data: notes, count, error } = await query;

  if (error) {
    throw new Error("Erro ao buscar anúncios: " + error.message);
  }

  // Calcula total de páginas
  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return (
    <div className="grainy min-h-screen">
      <div className="max-w-7xl mx-auto p-10">
        <div className="h-14"></div>
        <div className="flex justify-between items-center md:flex-row flex-col">
          <div className="flex items-center">
            <Link href="/">
              <Button className="bg-orange-600" size="3">
                <ArrowLeft className="mr-1 w-4 h-4" />
                Voltar
              </Button>
            </Link>
            <div className="w-4"></div>
            <h4 className="font-bold text-orange-900">
              {userIsAdmin ? "Todos os anúncios" : "Meus anúncios"}
            </h4>
          </div>
        </div>

        <div className="h-8"></div>
        <Separator />
        <div className="h-8"></div>

        {(!notes || notes.length === 0) && (
          <div className="text-center">
            <h2 className="text-xl text-gray-500">Nenhum anúncio encontrado.</h2>
          </div>
        )}

        <div className="grid sm:grid-cols-9 md:grid-cols-5 grid-cols-1 gap-2">
          {/* Botão para criar um novo anúncio */}
          <CreateNoteDialog />

          {notes?.map((note) => (
            <div key={note.temp_uuid} className="flex flex-col gap-2">
              <Link href={`/notebook/${note.temp_uuid}`}>
                <div className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                  <Image
                    alt={note.natureza.name}
                    width={100}
                    height={50}
                    src="notepad.svg"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {note.natureza.name}
                    </h3>
                    <div className="h-1"></div>
                    <p className="text-sm text-gray-500">
                      {formatDateDistance(note.created_at)}
                    </p>
                  </div>
                </div>
              </Link>
              <DeleteNoteButton noteId={note.temp_uuid} />
            </div>
          ))}
        </div>

        {/* Navegação de página */}
        <div className="mt-8 flex gap-4">
          {page > 1 && (
            <Link href={`?page=${page - 1}`}>
              <Button variant="solid" color="orange">
                Anterior
              </Button>
            </Link>
          )}
          <div className="text-gray-600 flex items-center">
            Página {page} de {totalPages}
          </div>
          {page < totalPages && (
            <Link href={`?page=${page + 1}`}>
              <Button variant="solid" color="orange">
                Próxima
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
