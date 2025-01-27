import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Table } from "@radix-ui/themes";

type Imobiliario = {
  id: string;
  descricao: string;
  fotos: string[] | null;
};

type Params = {
  params: { stateId: string };
};

async function Page({ params }: Params) {
  const { stateId } = await params;

  // Inicializar Supabase
  const supabase = createClient(
    "https://jqidnghoneocwhtcpbjn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaWRuZ2hvbmVvY3dodGNwYmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjcyOTUsImV4cCI6MjA1MTE0MzI5NX0.FWrf7O3VNr4RTo7KoeGAuwolsz7koWqEuwza48wsynM"
  );

  // Consultar os dados
  const { data: notes, error } = await supabase
    .from("imobiliarios")
    .select()
    .eq("temp_uuid", stateId);

 

  const imobiliario = notes[0];
  const fotos = Array.isArray(imobiliario.fotos) ? imobiliario.fotos : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Título */}
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">
          {imobiliario.descricao}
        </h1>

        {/* Galeria de Fotos */}
        {fotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {fotos.map((foto: string, index: number) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <Image
                  src={foto}
                  alt={`Foto ${index + 1}`}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Nenhuma fotografia disponível para este imóvel.
          </p>
        )}

        {/* Detalhes */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Detalhes do Imóvel</h2>
          <p className="text-gray-700 text-lg">{imobiliario.descricao}</p>
        </div>

        {/* Tabela de Informações */}
        <div className="overflow-x-auto">
          <Table.Root className="w-full">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-left text-indigo-600">
                  Descrição0
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-left text-indigo-600">
                  Fotos
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.RowHeaderCell>{imobiliario.descricao}</Table.RowHeaderCell>
                <Table.Cell>
                  {fotos.length > 0 ? (
                    <div className="flex gap-2">
                      {fotos.slice(0, 3).map((foto:string, index: number) => (
                        <div
                          key={index}
                          className="w-16 h-16 overflow-hidden rounded-lg shadow-md"
                        >
                          <Image
                            src={foto}
                            alt={`Thumbnail ${index + 1}`}
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
      </div>
    </div>
  );
}

export default Page;
