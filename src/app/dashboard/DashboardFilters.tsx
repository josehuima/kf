export const runtime = "nodejs";


import React from "react";
import {
  Text as RadixLabel,
  Select as RadixSelect,
  Button,
  Box,
} from "@radix-ui/themes";
import {   Input as RadixInput} from "@/components/ui/input";

interface DashboardFiltersProps {
  searchParams: {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    nature?: string;
    location?: string;
    realStateType?: string;
    sort?: string;
  };
  natureOptions: string[];
  locationOptions: string[];
  realStateOptions: string[];
}

export default function DashboardFilters({
  searchParams,
  natureOptions,
  locationOptions,
  realStateOptions,
}: DashboardFiltersProps) {
  return (
    <form
      method="GET"
      action="/dashboard"
      className="flex flex-col gap-6 mb-8" // Tailwind classes
    >
      {/* Container para agrupar todos os campos */}
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo de busca livre */}
        <Box className="flex flex-col gap-1">
          <RadixLabel htmlFor="search" size="2">
            Texto livre
          </RadixLabel>
          <RadixInput
            id="search"
            name="search"
            defaultValue={searchParams.search || ""}
            placeholder="Buscar por descrição, local, bairro..."
          />
        </Box>

        {/* Faixa de preço (mínimo) */}
        <Box className="flex flex-col gap-1">
          <RadixLabel htmlFor="minPrice" size="2">
            Preço Mínimo
          </RadixLabel>
          <RadixInput
            id="minPrice"
            name="minPrice"
            type="number"
            defaultValue={searchParams.minPrice || "0"}
            placeholder="0"
          />
        </Box>

        {/* Faixa de preço (máximo) */}
        <Box className="flex flex-col gap-1">
          <RadixLabel htmlFor="maxPrice" size="2">
            Preço Máximo
          </RadixLabel>
          <RadixInput
            id="maxPrice"
            name="maxPrice"
            type="number"
            defaultValue={searchParams.maxPrice || "100000000"}
            placeholder="100000000"
          />
        </Box>

        {/* Natureza */}
        <Box className="flex flex-col gap-1">
          <RadixLabel htmlFor="nature" size="2">
            Natureza
          </RadixLabel>
          <RadixSelect.Root
            defaultValue={searchParams.nature || "all"}
            name="nature"
          >
            <RadixSelect.Trigger />
            <RadixSelect.Content>
              <RadixSelect.Group>
                <RadixSelect.Item value="all">Todas</RadixSelect.Item>
                {natureOptions.map((nat) => (
                  <RadixSelect.Item key={nat} value={nat}>
                    {nat}
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Group>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Box>

        {/* Localização */}
        <Box className="flex flex-col gap-1">
          <RadixLabel htmlFor="location" size="2">
            Localização
          </RadixLabel>
          <RadixSelect.Root
            defaultValue={searchParams.location || "all"}
            name="location"
          >
            <RadixSelect.Trigger />
            <RadixSelect.Content>
              <RadixSelect.Group>
                <RadixSelect.Item value="all">Todas</RadixSelect.Item>
                {locationOptions.map((loc) => (
                  <RadixSelect.Item key={loc} value={loc}>
                    {loc}
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Group>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Box>

        {/* Tipo de Imóvel */}
        <Box className="flex flex-col gap-1">
          <RadixLabel htmlFor="realStateType" size="2">
            Tipo de Imóvel
          </RadixLabel>
          <RadixSelect.Root
            defaultValue={searchParams.realStateType || "all"}
            name="realStateType"
          >
            <RadixSelect.Trigger />
            <RadixSelect.Content>
              <RadixSelect.Group>
                <RadixSelect.Item value="all">Todos</RadixSelect.Item>
                {realStateOptions.map((rst) => (
                  <RadixSelect.Item key={rst} value={rst}>
                    {rst}
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Group>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Box>

        {/* Ordenar por */}
        <Box className="flex flex-col gap-1">
          <RadixLabel htmlFor="sort" size="2">
            Ordenar por
          </RadixLabel>
          <RadixSelect.Root
            defaultValue={searchParams.sort || "created_at"}
            name="sort"
          >
            <RadixSelect.Trigger />
            <RadixSelect.Content>
              <RadixSelect.Group>
                <RadixSelect.Item value="created_at">
                  Data de Criação
                </RadixSelect.Item>
                <RadixSelect.Item value="preco">Preço</RadixSelect.Item>
                <RadixSelect.Item value="tipologia">Tipologia</RadixSelect.Item>
              </RadixSelect.Group>
            </RadixSelect.Content>
          </RadixSelect.Root>
        </Box>
      </Box>

      {/* Botão de Filtrar */}
      <Box className="mt-4">
        <Button type="submit" variant="solid" color="orange">
          Filtrar
        </Button>
      </Box>
    </form>
  );
}
