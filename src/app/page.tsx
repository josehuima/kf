"use client";

import React, { useState } from "react";
import { formatDateDistance } from "./lib/utils";
import { useNotes } from "./context/NotesContext";
import {
  Button,
  Box,
  Spinner,
  Flex,
  Select,
  Inset,
  Strong,
  Text,
  Card,
  Blockquote,
  Heading,
  Grid,
  TextField,
  Link as RadixLink,
} from "@radix-ui/themes";
import { Separator } from "@radix-ui/themes";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  HomeIcon,

  BackpackIcon,
  BackpackIcon as NatureIcon,
  LightningBoltIcon as EnergyIcon,
} from "@radix-ui/react-icons";
import { Droplet, HousePlusIcon, Locate, MapPinCheckInside } from "lucide-react";

import Link from "next/link";

const getProperty = (note: any, property: string) => note[property];

export default function DashboardPage() {
  const { notes, loading, error } = useNotes();
  const [sortOption, setSortOption] = useState<string>("created_at");
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const sortedNotes = notes
    ? notes.sort((a, b) => {
        const propA = getProperty(a, sortOption);
        const propB = getProperty(b, sortOption);

        if (typeof propA === "string" && typeof propB === "string") {
          return propA.localeCompare(propB);
        } else if (typeof propA === "number" && typeof propB === "number") {
          return propA - propB;
        }
        return 0;
      })
    : [];

// Substitua a parte do "filteredNotes" por algo como:
const filteredNotes = sortedNotes.filter((note) => {
  // Converte tudo para minúsculo
  const tipologiaName = note.tipologia?.name?.toLowerCase() || "";
  const descricao = note.descricao?.toLowerCase() || "";
  const localizacaoName = note.localizacao?.name?.toLowerCase() || "";
  const bairro = note.bairro?.toLowerCase() || "";

  // Se qualquer um desses campos contiver o `filterKeyword`, retorna true
  return (
    tipologiaName.includes(filterKeyword.toLowerCase()) ||
    descricao.includes(filterKeyword.toLowerCase()) ||
    localizacaoName.includes(filterKeyword.toLowerCase()) ||
    bairro.includes(filterKeyword.toLowerCase())
  );
});


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const customLoader = ({ src }: { src: string }) => src;

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="text-center mb-10">
          <Text size="5" weight="bold" color="orange">
            Explore Imóveis Disponíveis
          </Text>
        </header>

        {/* Filtros */}
        <Flex direction="column" gap="4" mb="9">
          <TextField.Root
            placeholder="Buscar por descrição ou local..."
            size="3"
            color="orange"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />
          <Select.Root
            size="3"
            value={sortOption}
            onValueChange={(value) => setSortOption(value)}
          >
            <Select.Trigger color="orange">
              
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>Ordenar por</Select.Label>
                <Select.Item value="created_at">Data de Criação</Select.Item>
                <Select.Item value="preco">Preço</Select.Item>
                <Select.Item value="tipologia">Tipologia</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>

        <Separator size="2" my="6" />

        {loading && (
          <Flex justify="center" align="center">
            <Spinner size="3" />
            <Text>Carregando imóveis...</Text>
          </Flex>
        )}

        {error && (
          <Text align="center" color="red">
            Erro: {error}
          </Text>
        )}

        {!loading && !error && (
          <Grid columns="repeat(auto-fit, minmax(250px, 1fr))" gap="6">
            {paginatedNotes.map((note) => (
              <React.Fragment key={note.temp_uuid}>
                <Link href={`/real-state/${note.temp_uuid}`} passHref>
                 
                    <Card className="hover:shadow-xl transition-shadow">
                      <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        loop
                      >
                        {note.images.map((image: string, index: number) => (
                        <SwiperSlide key={index}>
                          <div className="relative w-full h-48">
                            <Image
                              loader={customLoader}
                              src={image}
                              alt={`Imagem ${index + 1}`}
                              fill
                              className="rounded-lg object-cover"
                              quality={100}
                              priority={true}
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Preço e data de publicação */}
                    <Flex pt="3" direction="column" align="center">
                      <Text truncate size="3" weight="bold" className="text-orange-600">
                        {note.preco
                          ? note.preco.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "AOA",
                            })
                          : "Não definido"}
                      </Text>
                      
                    </Flex>

                    {/* Ícones com propriedades */}
                    <Flex
                      direction="row"
                      justify="center"
                      gap="4"
                      mt="3"
                      mb="2"
                    >
                      {/* Tipologia */}
                      <Flex align="center" gap="1">
                        <HomeIcon className="text-orange-600" />
                        <Text size="1" className="text-orange-600">
                        
                          {note.tipologia.name ? note.tipologia.name : "Tipologia não definida"}
                        </Text>
                      </Flex>

                      {/* Localização */}
                      <Flex align="center" gap="1">
                      <MapPinCheckInside className="text-orange-600" />
                      <Text size="1" className="text-orange-600">
                          {note.localizacao.name ? note.localizacao.name : "Localização não definida"} - {note.bairro ? note.bairro : "Bairro não definido"}
                        </Text>
                      </Flex>
                    </Flex>

                    <Flex
                      direction="row"
                      justify="center"
                      gap="4"
                      mb="3"
                    >
                      {/* Natureza */}
                      <Flex align="center" gap="1">
                        <HousePlusIcon className="text-orange-600" />
                        <Text size="1" className="text-orange-600">
                          {note.natureza && note.natureza.name
                            ? note.natureza.name
                            : "N/A."}
                        </Text>
                      </Flex>

                      {/* Energia */}
                      <Flex align="center" gap="1">
                        <EnergyIcon className="text-orange-600" />
                        <Text size="1" className="text-orange-600">
                          {note.energyCert && note.energyCert.name
                            ? note.energyCert.name
                            : "Sem Cert."}
                        </Text>
                      </Flex>

                      {/* Água */}
                      <Flex align="center" gap="1">
                      
                      <Droplet className="text-orange-600" />
                      <Text size="1" className="text-orange-600">
                          {note.waterCert && note.waterCert.name
                            ? note.waterCert.name
                            : "Sem Cert."}
                        </Text>
                        
                      </Flex>
                      
                    </Flex>
                    <Text color="gray" size="2">
                        Publicado {formatDateDistance(note.created_at)}
                      </Text>
                  </Card>
                </Link>
              </React.Fragment>
            ))}
          </Grid>
        )}

        <Flex align="center" pt="9" pl="4" pr="4" justify="center">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            color="orange"
          >
            Anterior
          </Button>
          <Text className="mx-1 text-gray-500 text-sm font-medium">
            Página {currentPage} de {totalPages}
          </Text>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            color="orange"
          >
            Próxima
          </Button>
        </Flex>
      </div>
    </div>
  );
}
