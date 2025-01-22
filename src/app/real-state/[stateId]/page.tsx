import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Table } from "@radix-ui/themes";

type Imobiliario = {
  id: string;
  descricao: string;
  fotos: string[] | null; // Permitir que seja null caso esteja vazio
};

type Params = {
  params: { stateId: string };
};

async function Page({ params }: Params) {
  const { stateId } = params;

  // Inicializar Supabase
  const supabase = createClient(
    "https://jqidnghoneocwhtcpbjn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaWRuZ2hvbmVvY3dodGNwYmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjcyOTUsImV4cCI6MjA1MTE0MzI5NX0.FWrf7O3VNr4RTo7KoeGAuwolsz7koWqEuwza48wsynM"
  );

  // Consultar os dados
  const { data: notes, error } = await supabase
    .from("imobiliarios")
    .select()
    .eq("id", stateId);

  // Redirecionar se o item não existir ou ocorrer erro
  if (!notes || notes.length !== 1 || error) {
    redirect("/dashboard");
  }

  const imobiliario = notes[0];

  // Garantir que `fotos` é um array válido
  const fotos = Array.isArray(imobiliario.fotos) ? imobiliario.fotos : [];

  // Renderizar os detalhes
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Imóvel - {imobiliario.descricao}</h1>

      {/* Galeria de Fotografias */}
      {fotos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {fotos.map((foto: string, index: number) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md">
              <Image
                src={foto}
                alt={`Fotografia ${index + 1}`}
                width={600}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Nenhuma fotografia disponível para este imóvel.</p>
      )}

      {/* Detalhes do Imóvel */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-2">Descrição</h2>
        <p className="text-gray-700 mb-4">{imobiliario.descricao}</p>
      </div>

      {/* Tabela de Informações */}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Descrição</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Fotos</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>{imobiliario.descricao}</Table.RowHeaderCell>
            <Table.Cell>
              {fotos.length > 0 ? (
                <div className="flex space-x-2">
                  {fotos.slice(0, 3).map((foto, index) => (
                    <div key={index} className="w-16 h-16 overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500">Sem fotos</span>
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>
  );
}

export default Page;
