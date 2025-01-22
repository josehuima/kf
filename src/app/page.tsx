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
  Link,
  TextField,
} from "@radix-ui/themes";
import { Separator } from "@radix-ui/themes";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

const getProperty = (note: any, property: string) => {
  return note[property];
};

export default function DashboardPage() {
  const { notes, loading, error } = useNotes();
  const [sortOption, setSortOption] = useState<string>("created_at");
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Número de itens por página

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

  const filteredNotes = sortedNotes.filter((note) => {
    const searchableFields = ["tipologia", "descricao", "localizacao"];
    return searchableFields.some((field) =>
      getProperty(note, field)
        .toString()
        .toLowerCase()
        .includes(filterKeyword.toLowerCase())
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const customLoader = ({ src }: { src: string }) => {
    return src;
  };

  return (
    <div className="bg-gradient-to-r min-h-screen grainy from-rose-100 to-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-gray-900 text-center md:text-left">
            Imóveis disponíveis
          </h3>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <Box maxWidth="500px">
            <TextField.Root
              color="orange"
              size="2"
              placeholder="Filtrar por descrição…"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
            />
          </Box>
          <Box pt="3" maxWidth="500px">
            <Select.Root
              size="2"
              value={sortOption}
              onValueChange={(value) => setSortOption(value)}
            >
              <Select.Trigger color="orange" variant="surface" />
              <Select.Content color="orange">
                <Select.Group>
                  <Select.Label>Ordenar por</Select.Label>
                  <Select.Item value="created_at">Data de criação</Select.Item>
                  <Select.Item value="preco">Preço</Select.Item>
                  <Select.Item value="tipologia">Tipologia</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Box>
        </div>

        <Separator my="3" size="4" />

        {loading && (
          <Flex align="center" gapX="9" justify="center" gap="3" className="text-center">
            <Spinner size="3" />
            <Text wrap="balance" align="center" color="orange">Buscando registros, por favor aguarde...</Text>
          </Flex>
        )}

        {error && !loading && (
          <div className="text-center">
            <h2 className="text-xl text-red-500">{error}</h2>
          </div>
        )}

        {filteredNotes.length === 0 && !loading && !error && (
          <div className="text-center">
            <h2 className="text-xl text-gray-500">Nenhum imóvel encontrado.</h2>
          </div>
        )}

        {!loading && (
          <Grid
            gap="3"
            columns={{
              initial: "1", // 1 coluna para dispositivos menores
              sm: "2", // 2 colunas para telas pequenas
              md: "3", // 3 colunas para telas médias
              lg: "4", // 4 colunas para telas grandes
              xl: "5", // 5 colunas para telas maiores
            }}
            width="auto"
            pb="6"
            className="transform transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
            {paginatedNotes.map((note) => (
              <Card key={note.id} size="1">
                <div className="overflow-hidden max-w-[400px]">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    loop
                    spaceBetween={10}
                  >
                    {note.images.map((image: string, index: number) => (
                      <SwiperSlide key={index}>
                        <Image
                          loader={customLoader}
                          priority={false}
                          quality={75}
                          style={{ borderRadius: "var(--radius-2)" }}
                          key={index}
                          src={image}
                          alt={`Foto ${index + 1}`}
                          width="300"
                          height="270"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <Box>
                    <Text align="center" as="div" color="orange" trim="start">
                      <Link
                        href={`/real-state/${note.id}`}
                        underline="hover"
                        highContrast
                        size="2"
                        weight="bold"
                      >
                        {note.tipologia} - {note.localizacao} -{" "}
                        {note.preco
                          .toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "AOA",
                          })
                          .replace("AOA", "")
                          .trim()}{" "}
                        Kz
                      </Link>
                    </Text>
                    <Text align="center" as="div" color="gray" size="1" trim="end">
                      {formatDateDistance(note.created_at)}
                    </Text>
                  </Box>
                </div>
              </Card>
            ))}
          </Grid>
        )}

        {/* Controles de Paginação */}
        
        <Flex justify="center" gap="9" >
          <Button
            color="orange"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Anterior
          </Button>
          <span className="px-4 py-2 p-8">{`Página ${currentPage} de ${totalPages}`}</span>
          <Button
            color="orange"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pl-8 p-8 bg-gray-300 rounded disabled:opacity-50"
            variant="solid"
          >
            Próxima
          </Button>
        </Flex >
       
      </div>
    </div>
  );
}
