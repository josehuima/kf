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
import DashboardFilters from "./DashboardFilters"; // <-- nosso componente de filtros
import { formatDateDistance } from "../lib/utils";

const adminIds = process.env.NEXT_PUBLIC_ADMIN_IDS?.split(",") || [];
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    nature?: string;
    location?: string;
    realStateType?: string;
    sort?: string;
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

  // 2. Ler parâmetros de busca e paginação
  const page = parseInt(searchParams?.page || "1", 10) || 1;
  const pageSize = 8;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const search = searchParams?.search || "";
  const minPrice = parseInt(searchParams?.minPrice || "0", 10) || 0;
  const maxPrice = parseInt(searchParams?.maxPrice || "100000000", 10) || 100000000;
  const selectedNature = searchParams?.nature || "all";
  const selectedLocation = searchParams?.location || "all";
  const selectedRealStateType = searchParams?.realStateType || "all";
  const sortOption = searchParams?.sort || "created_at";

  // 3. Inicializa o Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 4. Buscar as **opções** (natureza, localização, realStateType) diretamente do banco
  //    Exemplo: distinct em "natureza->>name", "localizacao->>name", "realStateType->>name"
  //    Precisamos agrupar manualmente, pois supabase .distinct() é limitado.

  // Natureza
  const { data: naturezaRows } = await supabase
    .from("imo")
    .select("natureza"); // puxa só esse campo

    const natureSet = new Set<string>();
    naturezaRows?.forEach((row) => {
      if (row.natureza?.name) {
        natureSet.add(row.natureza.name);
      }
    });
  const natureOptions = Array.from(natureSet);

  // Localização
  const { data: locationRows } = await supabase
    .from("imo")
    .select("localizacao");

  const locationSet = new Set<string>();
  locationRows?.forEach((row) => {
    if (row.localizacao?.name) locationSet.add(row.localizacao.name);
  });
  const locationOptions = Array.from(locationSet);

  // Tipo de Imóvel
  const { data: typeRows } = await supabase
    .from("imo")
    .select("realStateType");

  const typeSet = new Set<string>();
  typeRows?.forEach((row) => {
    if (row.realStateType?.name) typeSet.add(row.realStateType.name);
  });
  const realStateOptions = Array.from(typeSet);

  // 5. Montar query de anúncios
  let query = supabase
    .from("imo")
    .select("*", { count: "exact" })
    .range(start, end);

  if (!userIsAdmin) {
    query = query.eq("userId", userId);
  }

  // Filtro de texto (natureza->>name, localizacao->>name, tipologia->>name, bairro, descricao)
  if (search) {
    query = query.or(
      `natureza->>name.ilike.%${search}%,localizacao->>name.ilike.%${search}%,tipologia->>name.ilike.%${search}%,bairro.ilike.%${search}%,detalhes.ilike.%${search}%`
    );
  }

  // Faixa de preço
  query = query.gte("preco", minPrice).lte("preco", maxPrice);

  // Natureza
  if (selectedNature !== "all") {
    query = query.eq("natureza->>name", selectedNature);
  }

  // Localização
  if (selectedLocation !== "all") {
    query = query.eq("localizacao->>name", selectedLocation);
  }

  // Tipo de Imóvel
  if (selectedRealStateType !== "all") {
    query = query.eq("realStateType->>name", selectedRealStateType);
  }

  // Ordenar
  if (sortOption === "preco") {
    query = query.order("preco", { ascending: true });
  } else if (sortOption === "tipologia") {
    query = query.order("tipologia->>name", { ascending: true });
  } else {
    query = query.order("created_at", { ascending: true });
  }

  // Executa
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

      {/* Form de Filtros */}
      <DashboardFilters
        searchParams={searchParams ?? {}}
        natureOptions={natureOptions}
        locationOptions={locationOptions}
        realStateOptions={realStateOptions}
      />

      <Separator className="my-4" />

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
          <Link
            href={`?page=${page - 1}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}&nature=${selectedNature}&location=${selectedLocation}&realStateType=${selectedRealStateType}&sort=${sortOption}`}
          >
            <Button variant="solid" color="orange">
              Anterior
            </Button>
          </Link>
        )}
        <span className="text-gray-600">
          Página {page} de {totalPages}
        </span>
        {page < totalPages && (
          <Link
            href={`?page=${page + 1}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}&nature=${selectedNature}&location=${selectedLocation}&realStateType=${selectedRealStateType}&sort=${sortOption}`}
          >
            <Button variant="solid" color="orange">
              Próxima
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
