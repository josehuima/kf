import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import { Table, Box, Flex, Text, Card, Button, Separator } from "@radix-ui/themes";
import Link from "next/link";
import {
  Home as HomeIcon,
  MapPin,
  CheckCircle2,
  Calendar,
  DollarSign,
} from "lucide-react";
import { RealState as Note } from "@/lib/db/schema";


export type paramsType = Promise<{ stateId: string }>;


async function Page(props: { params: paramsType }) {
  const { stateId } = await props.params; // Remova o `await` aqui

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;


  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
    );
  }
  // Inicializar Supabase
  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
  );

  // Consultar os dados
  const { data: notes, error } = await supabase
    .from("imobiliarios")
    .select()
    .eq("temp_uuid", stateId);
   
  if (error || !notes || notes.length === 0) {
    return (
      <Box className="min-h-screen p-8">
        <Text as="p" size="2" className="text-red-600">
          Não foi possível carregar os dados do imóvel.
        </Text>
      </Box>
    );
  }

  const propertiesWithImages = await Promise.all(
    notes.map(async (property: Note) => {
      const { data: photos, error: photoError } = await supabase
        .from("property_photos")
        .select("photo_path")
        .eq("property_id", property.temp_uuid);
  
      if (photoError) {
        return { ...property, images: ["/default-placeholder.jpg"] };
      }
  
      const images = photos
        .map((photo: any) => {
          const { data } = supabase.storage
            .from("kubico-facil")
            .getPublicUrl(photo.photo_path);
  
          return data?.publicUrl || null;
        })
        .filter((url: string | null) => url !== null);
  
      return {
        ...property,
        images: images.length > 0 ? images : ["/326547605_714729620344884_1344181896237920632_n.jpg"],
      };
    })
  );
  

  // Função simples para formatar a data (publicação)
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}





  const imobiliario = propertiesWithImages[0];;
  const fotos = imobiliario?.images || [];

    // Verifica disponibilidade (se "true", exibe "Disponível"; senão, "Indisponível")
    const disponibilidade =
    imobiliario.avaliable && imobiliario.avaliable.toString() === "true"
      ? "Disponível"
      : "Indisponível";
  return (
    <Box className="min-h-screen p-8 ">
      <Flex className="max-w-7xl mx-auto flex-col lg:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Seção de Informações do Imóvel */}
        <Box className="lg:w-3/4 p-6">
          {/* Título */}
          <Text size="4" weight="bold" className="text-orange-600 mb-6">
            {imobiliario.tipologia.name} - {imobiliario.localizacao.name} - {" "}
                  {imobiliario.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "AOA",
                  })}
          </Text>

           {/* Seção de ícones e informações */}
           <Box className="mb-6 space-y-3">
            {/* Tipologia */}
            <Flex align="center" gap="2">
              <HomeIcon className="text-orange-600" />
              <Text size="2" className="text-orange-600">
                Tipologia: {imobiliario.tipologia.name || "N/A"}
              </Text>
            </Flex>

            {/* Localização */}
            <Flex align="center" gap="2">
              <MapPin className="text-orange-600" />
              <Text size="2" className="text-orange-600">
                Localização: {imobiliario.localizacao.name || "N/A"} - Bairro: {imobiliario.bairro || "N/A"}
              </Text>
            </Flex>

            {/* Disponibilidade */}
            <Flex align="center" gap="2">
              <CheckCircle2
                className={`${
                  disponibilidade === "Disponível"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              />
              <Text
                size="2"
                className={`${
                  disponibilidade === "Disponível"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {disponibilidade}
              </Text>
            </Flex>

            {/* Preço */}
            <Flex align="center" gap="2">
              <DollarSign className="text-orange-600" />
              <Text size="2" className="text-orange-600">
                Preço:{" "}
                {imobiliario.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "AOA",
                })}
              </Text>
            </Flex>

            {/* Data de Publicação */}
            <Flex align="center" gap="2">
              <Calendar className="text-orange-600" />
              <Text size="2" className="text-orange-600">
                Publicado em: {formatDate(imobiliario.created_at)}
              </Text>
            </Flex>
          </Box>

          {/* Galeria de Fotos */}
          {fotos.length > 0 ? (
            <Flex className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {fotos.map((foto: string, index: number) => (
                <Card
                  key={index}
                  className="overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-lg"
                >
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
            <Text size="2" weight="light" className="mb-4">
              Detalhes do Imóvel
            </Text>
            <Text as="p" size="2" className="text-gray-700">
              {imobiliario.descricao}
            </Text>
          </Box>

          {/* Tabela de Informações */}
          <Box className="overflow-x-auto">
            <Table.Root className="w-full">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell className="text-left ">
                    Descrição
                  </Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="text-left">
                    Fotos
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.RowHeaderCell>
                    {imobiliario.descricao}
                  </Table.RowHeaderCell>
                  <Table.Cell>
                    {fotos.length > 0 ? (
                      <Flex className="gap-2">
                        {fotos.slice(0, 3).map((foto: string, index: number) => (
                          <Box
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
                          </Box>
                        ))}
                      </Flex>
                    ) : (
                      <Text as="span" className="text-gray-500">
                        Sem fotos
                      </Text>
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
          <Text size="2" weight="bold" className="text-orange-600 mb-4">
            Contacte-nos
          </Text>
          <Text as="p" size="2" className="text-gray-700 mb-4">
            Para arrendar ou comprar este imóvel, entre em contato conosco:
          </Text>
          <Box className="text-lg">
            <Text as="p" className="mb-2 text-orange-600">
              <strong>Telefone:</strong> +244 912 345 678
            </Text>
            <Text as="p" className="mb-2 text-orange-600">
              <strong>Email:</strong> info@kubico-facil.com
            </Text>
            <Text as="p" className="mb-2 text-orange-600">
              <strong>Localização:</strong> Av. Principal, 123, Lubango, Huíla,
              Angola
            </Text>
          </Box>
          <Link href={`/checkout/${stateId}`}>
                      <Button
                          className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded"
                            variant="solid"
                            
                            size="4"
                          >
                            Reservar
                          </Button>
                          </Link>
        </Box>
      </Flex>
    </Box>
  );
}

export default Page;
