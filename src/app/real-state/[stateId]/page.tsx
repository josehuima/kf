import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Table, Box, Flex, Text, Card, Button, Separator } from "@radix-ui/themes";

type Imobiliario = {
  id: string;
  descricao: string;
  fotos: string[] | null;
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
    .eq("temp_uuid", stateId);

    if (error || !notes || notes.length === 0) {
      redirect("/");
      return null;
    }

  const imobiliario = notes[0];
  const fotos = Array.isArray(imobiliario.fotos) ? imobiliario.fotos : [];

  return (
    <Box className="min-h-screen p-8 ">
      <Flex className="max-w-7xl mx-auto flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        
        {/* Seção de Informações do Imóvel */}
        <Box className="lg:w-3/4 p-6">
          {/* Título */}
          <Text size="4" weight="bold" className="text-orange-600 mb-6">
            {imobiliario.descricao}
          </Text>

          {/* Galeria de Fotos */}
          {fotos.length > 0 ? (
            <Flex className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {fotos.map((foto: string, index: number) => (
                <Card key={index} className="overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg">
                  <Image
                    src={foto}
                    alt={`Foto ${index + 1}`}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </Card>
              ))}
            </Flex>
          ) : (
            <Text as="p" className="text-gray-500 text-center">
              Nenhuma fotografia disponível para este imóvel.
            </Text>
          )}

          {/* Detalhes */}
          <Box className="bg-orange-50 p-6 rounded-lg shadow-md mb-8">
            <Text  size="2" weight="light" className="mb-4">Detalhes do Imóvel</Text>
            <Text as="p" size="2" className="text-gray-700">{imobiliario.descricao}</Text>
          </Box>

          {/* Tabela de Informações */}
          <Box className="overflow-x-auto">
            <Table.Root className="w-full">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-left ">Descrição</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-left">Fotos</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.RowHeaderCell>{imobiliario.descricao}</Table.RowHeaderCell>
                  <Table.Cell>
                    {fotos.length > 0 ? (
                      <Flex className="gap-2">
                        {fotos.slice(0, 3).map((foto: string, index: number) => (
                          <Box key={index} className="w-16 h-16 overflow-hidden rounded-lg shadow-md">
                            <Image
                              src={foto}
                              alt={`Thumbnail ${index + 1}`}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </Box>
                        ))}
                      </Flex>
                    ) : (
                      <Text as="span" className="text-gray-500">Sem fotos</Text>
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Box>
        </Box>

        {/* Componente Lateral de Contato */}
        <Separator orientation="vertical" className="hidden lg:block" />
        <Box className="lg:w-1/4 p-6 bg-orange-50 rounded-lg shadow-md">
          <Text size="2" weight="bold" className="text-orange-600 mb-4">Contacte-nos</Text>
          <Text as="p" size="2" className="text-gray-700 mb-4">
            Para arrendar ou comprar este imóvel, entre em contato conosco:
          </Text>
          <Box className="text-lg">
            <Text as="p" className="mb-2"><strong>Telefone:</strong> +244 912 345 678</Text>
            <Text as="p" className="mb-2"><strong>Email:</strong> imobiliaria@example.com</Text>
            <Text as="p" className="mb-2"><strong>Localização:</strong> Av. Principal, 123, Lubango, Huíla, Angola</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default Page;
