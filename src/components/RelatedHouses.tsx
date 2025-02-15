"use client";

import React, { useMemo } from "react";
import { useNotes } from "@/app/context/NotesContext"; 
// ajuste o import para onde seu contexto ou lista de imóveis está
import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import Image from "next/image";
import { RealState } from "@/lib/db/schema";



interface RelatedHousesProps {
  currentImovel: RealState;
}

const customLoader = ({ src }: { src: string }) => src;

export default function RelatedHouses({ currentImovel }: RelatedHousesProps) {
  const { notes } = useNotes(); 
  // 'notes' é sua lista de todos os imóveis, assumindo que useNotes retorna { notes, loading, error }

  // Lógica de filtragem:
  // A ideia é encontrar imóveis com características parecidas (ex.: mesma tipologia, natureza, realStateType).
  // Ajuste conforme sua regra de negócio.
  const related = useMemo(() => {
    if (!notes || !currentImovel) return [];

    return notes.filter((imovel) => {
      // Não queremos o mesmo imóvel
      if (imovel.temp_uuid === currentImovel.temp_uuid) return false;

      // Defina sua lógica de "similaridade":
      // Por exemplo, se tipologia, natureza e realStateType forem iguais
      const sameTipologia =
        imovel.tipologia?.name === currentImovel.tipologia?.name;
      const sameNatureza =
        imovel.natureza?.name === currentImovel.natureza?.name;
      const sameType =
        imovel.realStateType?.name === currentImovel.realStateType?.name;

      // Exemplo: só retorna se pelo menos 2 dessas 3 baterem
      const matchCount = [sameTipologia, sameNatureza, sameType].filter(Boolean)
        .length;

      // Ajuste a "nota de corte" (por exemplo, >= 2)
      return matchCount >= 2;
    });
  }, [notes, currentImovel]);

  // Pegamos só alguns (ex.: 4) para exibir
  const topRelated = related.slice(0, 4);

  // Se não houver relacionados, pode exibir algo ou não
  if (topRelated.length === 0) return null;

  return (
    <div className="mt-8">
      <Text size="4" weight="bold" className="text-orange-600 mb-4">
        Você pode gostar também
      </Text>
      <Flex gap="4" wrap="wrap">
        {topRelated.map((imovel) => (
          <Link href={`/real-state/${imovel.temp_uuid}`} key={imovel.temp_uuid}>
            <Card className="hover:shadow-md transition-shadow w-64 cursor-pointer">
              {/* Se tiver imagens, exiba a primeira */}
              {imovel.images?.[0] && (
                <div className="relative w-full h-40">
                  <Image
                    loader={customLoader}
                    src={imovel.images[0]}
                    alt={`Foto do imóvel`}
                    fill
                    className="object-cover rounded-t"
                  />
                </div>
              )}
              <Flex direction="column" p="3" gap="2">
                <Text size="2" weight="bold" className="text-orange-600">
                  {imovel.preco
                    ? imovel.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "AOA",
                      })
                    : "Preço N/D"}
                </Text>
                <Text size="2" color="gray">
                  {imovel.tipologia?.name || "Tipologia N/D"} -{" "}
                  {imovel.natureza?.name || "Natureza N/D"}
                </Text>
              </Flex>
            </Card>
          </Link>
        ))}
      </Flex>
    </div>
  );
}
