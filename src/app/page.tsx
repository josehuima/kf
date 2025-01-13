"use client";
import React, { useState } from "react";
import { formatDateDistance } from "./lib/utils";
import { useNotes } from "./context/NotesContext";
import {
  Box,
  Flex,
  Select,
  Inset,
  Strong,
  Text,
  Card,
  Blockquote,
  Heading
} from "@radix-ui/themes";
import { Separator } from "@radix-ui/themes";
import Link from "next/link";

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

  return (
    <div className="grainy min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-gray-900 text-center md:text-left">
            Imóveis disponíveis
          </h3>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
          <input
            type="text"
            placeholder="Filtrar por descrição"
            className="border border-gray-300 rounded-lg p-2 w-full md:w-64"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
          />

          <Flex gap="3" align="center">
            <Select.Root
              value={sortOption}
              onValueChange={(value) => setSortOption(value)}
            >
              <Select.Trigger variant="surface" />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Ordenar por</Select.Label>
                  <Select.Item value="created_at">Data de criação</Select.Item>
                  <Select.Item value="preco">Preço</Select.Item>
                  <Select.Item value="tipologia">Tipologia</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Flex>
        </div>

        <Separator my="3" size="4" />

        {loading && (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
            <p className="ml-2">Buscando registros, por favor aguarde...</p>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedNotes.map((note) => (
              <Box key={note.id}>
                <Link href={`/notebook/${note.id}`} passHref>
                  <Card
                    size="2"
                    className="border border-stone-300 rounded-lg overflow-hidden flex flex-col transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                  >
                    <Inset clip="padding-box" side="top" pb="current">
                      <div>
                        <img
                          style={{
                            display: "block",
                            objectFit: "cover",
                            width: "100%",
                            height: 140,
                            backgroundColor: "var(--gray-5)",
                          }}
                          alt={getProperty(note, "descricao")}
                          src="/images.png"
                        />
                      </div>
                    </Inset>
                    <Text as="p" color="orange" align="center" size="3">
                      <Strong>
                        
                        <Heading as="h3" size="3">
                        {getProperty(note, "tipologia")} -{" "}
                        {getProperty(note, "localizacao")} -{" "}
                        {getProperty(note, "preco")}
							</Heading>
                      </Strong>
                    </Text>
                    <Blockquote>
                      {getProperty(note, "descricao")}
                    </Blockquote>
                    <Separator my="3" size="4" />
                    <Text as="p" align="center" size="3">
                      {formatDateDistance(getProperty(note, "created_at"))}.
                    </Text>
                  </Card>
                </Link>
              </Box>
            ))}
          </div>
        )}

        {/* Controles de Paginação */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-4 py-2">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
