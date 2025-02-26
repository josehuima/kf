"use client";

import React, { useState, useMemo } from "react";
import { formatDateDistance } from "./lib/utils";
import { useNotes } from "./context/NotesContext";
import {
  Button,
  Flex,
  Select,
  Text,
  Card,
  Grid,
  Separator,
  Spinner, TextField,
  Slider
} from "@radix-ui/themes";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Ícones
import {
  HomeIcon,
  LightningBoltIcon as EnergyIcon,
} from "@radix-ui/react-icons";
import { Droplet, HousePlusIcon, MapPinCheck } from "lucide-react";

import Link from "next/link";

// Loader do Next/Image
const customLoader = ({ src }: { src: string }) => src;

export default function DashboardPage() {
  const { notes, loading, error } = useNotes();

  // Estados para filtros
  const [sortOption, setSortOption] = useState("created_at");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("100000000"); // Exemplo: 10 milhões AOA
  const [selectedNature, setSelectedNature] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedRealStateType, setSelectedRealStateType] = useState("");

  // 2. Extrair localizações únicas
const locationOptions = useMemo(() => {
  if (!notes) return [];
  const setValues = new Set<string>();
  notes.forEach((n) => {
    if (n.localizacao?.name) {
      setValues.add(n.localizacao.name);
    }
  });
  return Array.from(setValues);
}, [notes]);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Ordenação
  const sortedNotes = useMemo(() => {
    if (!notes) return [];
    return [...notes].sort((a, b) => {
      const propA = a[sortOption];
      const propB = b[sortOption];

      if (typeof propA === "string" && typeof propB === "string") {
        return propA.localeCompare(propB);
      } else if (typeof propA === "number" && typeof propB === "number") {
        return propA - propB;
      }
      return 0;
    });
  }, [notes, sortOption]);

  // Filtros
  const filteredNotes = useMemo(() => {
    const lowerKeyword = filterKeyword.toLowerCase();

    return sortedNotes.filter((note) => {
      // Texto
      const tipologiaName = note.tipologia?.name?.toLowerCase() || "";
      const descricao = note.descricao?.toLowerCase() || "";
      const localizacaoName = note.localizacao?.name?.toLowerCase() || "";
      const bairro = note.bairro?.toLowerCase() || "";
      const textMatch =
        tipologiaName.includes(lowerKeyword) ||
        descricao.includes(lowerKeyword) ||
        localizacaoName.includes(lowerKeyword) ||
        bairro.includes(lowerKeyword);

      // Faixa de preço (convertemos minPrice e maxPrice para number)
      const preco = note.preco || 0;
      const minP = Number(minPrice);
      const maxP = Number(maxPrice);
      const priceMatch = preco >= minP && preco <= maxP;

      // Natureza
      const natureName = note.natureza?.name || "";
      const natureMatch =
        !selectedNature || selectedNature === "all" || natureName === selectedNature;

      // Tipo de Imóvel
      const realStateName = note.realStateType?.name || "";
      const realStateMatch =
        !selectedRealStateType ||
        selectedRealStateType === "all" ||
        realStateName === selectedRealStateType;

         // 5. Localização
    const locName = note.localizacao?.name || "";
    const locationMatch =
      selectedLocation === "all" || locName === selectedLocation;


      return textMatch && priceMatch && natureMatch && realStateMatch && locationMatch;
    });
  }, [
    sortedNotes,
    filterKeyword,
    minPrice,
    maxPrice,
    selectedNature,
    selectedRealStateType,
    selectedLocation
  ]);

  // Paginação
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Opções para selects
  const natureOptions = useMemo(() => {
    if (!notes) return [];
    const setValues = new Set<string>();
    notes.forEach((n) => {
      if (n.natureza?.name) setValues.add(n.natureza.name);
    });
    return Array.from(setValues);
  }, [notes]);

  const realStateOptions = useMemo(() => {
    if (!notes) return [];
    const setValues = new Set<string>();
    notes.forEach((n) => {
      if (n.realStateType?.name) setValues.add(n.realStateType.name);
    });
    return Array.from(setValues);
  }, [notes]);

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="text-center mb-10">
          <Text size="5" weight="bold" color="orange">
            Explore Imóveis Disponíveis
          </Text>
        </header>

        {/* Seção de Filtros */}
        <Flex direction="column" gap="4" mb="9">
          {/* Filtro de texto */}
          <TextField.Root
            placeholder="Buscar por descrição, local ou bairro..."
            size="3"
            color="orange"
            value={filterKeyword}
            onChange={(e) => {
              setFilterKeyword(e.target.value);
              setCurrentPage(1);
            }}
          />

          {/* Sliders de Preço */}
          

          

          {/* Filtro de Natureza */}
          <Select.Root
            size="3"
            value={selectedNature}
            onValueChange={(val) => {
              setSelectedNature(val);
              setCurrentPage(1);
            }}
          >
            <Select.Trigger color="orange" placeholder="Selecione Natureza" />
            <Select.Content>
              <Select.Group>
                <Select.Item value="all">Todas as Naturezas</Select.Item>
                {natureOptions.map((nat) => (
                  <Select.Item key={nat} value={nat}>
                    {nat}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>

          {/* Filtro de Tipo de Imóvel */}
          <Select.Root
            size="3"
            value={selectedRealStateType}
            onValueChange={(val) => {
              setSelectedRealStateType(val);
              setCurrentPage(1);
            }}
          >
            <Select.Trigger color="orange" placeholder="Tipo de Imóvel" />
            <Select.Content>
              <Select.Group>
                <Select.Item value="all">Todos os Tipos</Select.Item>
                {realStateOptions.map((rst) => (
                  <Select.Item key={rst} value={rst}>
                    {rst}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>

          {/* Filtro de Localização */}
<Select.Root
  size="3"
  value={selectedLocation}
  onValueChange={(val) => {
    setSelectedLocation(val);
    setCurrentPage(1);
  }}
>
  <Select.Trigger color="orange" placeholder="Localização" />
  <Select.Content>
    <Select.Group>
      <Select.Item value="all">Todas as Localizações</Select.Item>
      {locationOptions.map((loc) => (
        <Select.Item key={loc} value={loc}>
          {loc}
        </Select.Item>
      ))}
    </Select.Group>
  </Select.Content>
</Select.Root>


          {/* Ordenar por */}
          <Select.Root
            size="3"
            value={sortOption}
            onValueChange={(value) => {
              setSortOption(value);
              setCurrentPage(1);
            }}
          >
            <Select.Trigger color="orange" placeholder="Ordenar por" />
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

        {/* Loading / Erro */}
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

        {/* Lista de Imóveis */}
        {!loading && !error && (
          <Grid columns="repeat(auto-fit, minmax(250px, 1fr))" gap="6">
            {paginatedNotes.map((note: any) => (
              <React.Fragment key={note.temp_uuid}>
                <Link href={`/real-state/${note.temp_uuid}`} passHref>
                  <Card className="hover:shadow-xl transition-shadow cursor-pointer">
                    {/* Carrossel de imagens */}
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
                              priority
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Preço */}
                    <Flex pt="3" direction="column" align="center">
                      <Text
                        truncate
                        size="3"
                        weight="bold"
                        className="text-orange-600"
                      >
                        {note.preco
                          ? note.preco.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "AOA",
                            })
                          : "Não definido"}
                      </Text>
                    </Flex>

                    {/* Ícones com propriedades */}
                    <Flex direction="row" justify="center" gap="4" mt="3" mb="2">
                      {/* Tipologia */}
                      <Flex align="center" gap="1">
                        <HomeIcon className="text-orange-600" />
                        <Text size="1" className="text-orange-600">
                          {note.tipologia?.name || "Tipologia não definida"}
                        </Text>
                      </Flex>

                      {/* Localização + Bairro */}
                      <Flex align="center" gap="1">
                        <MapPinCheck className="text-orange-600" />
                        <Text size="1" className="text-orange-600">
                          {note.localizacao?.name || "Local N/D"} -{" "}
                          {note.bairro || "Bairro N/D"}
                        </Text>
                      </Flex>
                    </Flex>

                    <Flex direction="row" justify="center" gap="4" mb="3">
                      {/* Natureza */}
                      <Flex align="center" gap="1">
                        <HousePlusIcon className="text-orange-600" />
                        <Text size="1" className="text-orange-600">
                          {note.natureza?.name || "N/A"}
                        </Text>
                      </Flex>

                      {/* Energia */}
                      <Flex align="center" gap="1">
                        <EnergyIcon className="text-orange-600" />
                        <Text size="1" className="text-orange-600">
                          {note.energyCert?.name || "Sem Cert."}
                        </Text>
                      </Flex>

                      {/* Água */}
                      <Flex align="center" gap="1">
                        <Droplet className="text-orange-600" />
                        <Text size="1" className="text-orange-600">
                          {note.waterCert?.name || "Sem Cert."}
                        </Text>
                      </Flex>
                    </Flex>

                    {/* Data de publicação */}
                    <Text color="gray" size="2" align="center" mb="3">
                      Publicado {formatDateDistance(note.created_at)}
                    </Text>
                  </Card>
                </Link>
              </React.Fragment>
            ))}
          </Grid>
        )}

        {/* Paginação */}
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
