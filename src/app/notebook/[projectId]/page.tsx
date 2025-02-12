// pages/NoteBookPage.tsx
import React from "react";
import { createClient } from "@supabase/supabase-js";
import { Box, Text } from "@radix-ui/themes";
import RealStateForm, { Option } from "@/components/RealStateForm2";
import { RealState } from "@/lib/db/schema";

export type paramsType = Promise<{ projectId: string }>;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const NoteBookPage = async (props: { params: paramsType }) => {
  const { projectId } = await props.params;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "As variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não estão definidas."
    );
  }
  // Inicializar Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Consulta dos dados do imóvel
  const { data: notes, error } = await supabase
    .from("imo")
    .select()
    .eq("temp_uuid", projectId);

  console.log("Erro encontrado: ", error);

  if (error || !notes || notes.length === 0) {
    return (
      <Box className="min-h-screen p-8">
        <Text as="p" size="2" className="text-red-600">
          Não foi possível carregar os dados do imóvel.
        </Text>
      </Box>
    );
  }

  // Buscar as imagens associadas a cada propriedade
  const propertiesWithImages = await Promise.all(
    notes.map(async (property: RealState) => {
      const { data: photos, error: photoError } = await supabase
        .from("property_photos")
        .select("photo_path")
        .eq("property_id", property.temp_uuid.toString());

      if (photoError) {
        return { ...property, images: ["/default-placeholder.jpg"] };
      }

      const images = photos
        .map((photo) => {
          const { data } = supabase.storage
            .from("kubico-facil")
            .getPublicUrl(photo.photo_path);
          return data?.publicUrl || null;
        })
        .filter((url) => url !== null);

      return {
        ...property,
        images:
          images.length > 0
            ? images
            : ["/326547605_714729620344884_1344181896237920632_n.jpg"],
      };
    })
  );

  const imovel = propertiesWithImages[0];

  // Buscar as tipologias e localizações do banco de dados
  const { data: tipologiasData, error: tipologiaError } = await supabase
    .from("tipologia")
    .select("*");
  const { data: localizacoesData, error: localizacaoError } = await supabase
    .from("localizacao")
    .select("*");

    const { data: naturezaData, error: naturezaError } = await supabase
    .from("Natureza")
    .select("*");

    const { data: quintalData, error: quintalError } = await supabase
    .from("QuintalCert")
    .select("*");
    const { data: realStateTypeData, error: realStateTypeError } = await supabase
    .from("RealStateType")
    .select("*");

    const { data: energyCertsData, error: energyCertsError } = await supabase
    .from("EnergyCert")
    .select("*");

    const { data: waterCertsData, error: waterCertsError } = await supabase
    .from("WaterCert")
    .select("*");


    

  if (tipologiaError || !tipologiasData || localizacaoError || !localizacoesData || naturezaError || !naturezaData || quintalError || !quintalData || realStateTypeError || !realStateTypeData || energyCertsError || !energyCertsData || waterCertsError || !waterCertsData) {
    return (
      <Box className="min-h-screen p-8">
        <Text as="p" size="2" className="text-red-600">
          Não foi possível carregar os dados de tipologias ou localizações.
        </Text>
      </Box>
    );
  }

  // Converter para o tipo Option esperado pelo formulário
  const tipologias: Option[] = tipologiasData.map((t: any) => ({
    id: t.id,
    name: t.name,
  }));

  const localizacoes: Option[] = localizacoesData.map((l: any) => ({
    id: l.id,
    name: l.name,
  }));
  const naturezas: Option[] = naturezaData.map((l: any) => ({
    id: l.id,
    name: l.name,
  }));

  const quintalCerts: Option[] = quintalData.map((l: any) => ({
    id: l.id,
    name: l.name,
  }));  

  const realStateTypes: Option[] = realStateTypeData.map((l: any) => ({
    id: l.id,
    name: l.name,
  }));

  const energyCerts: Option[] = energyCertsData.map((l: any) => ({
    id: l.id,
    name: l.name,
  }));

  const waterCerts: Option[] = waterCertsData.map((l: any) => ({
    id: l.id,
    name: l.name,
  }));


  console.log('Tipologias encontrado: ', tipologias)

  return (
    <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full">
      <h1 className="text-2xl text-orange-600 font-bold mb-6">Editar Imóvel</h1>
      <RealStateForm
        imovel={imovel}
        tipologias={tipologias}
        localizacoes={localizacoes}
        naturezas={naturezas}
        quintalCerts={quintalCerts}
        realStateTypes={realStateTypes} 
        energyCerts={energyCerts}
        waterCerts={waterCerts}
      />
    </div>
  );
};

export default NoteBookPage;
