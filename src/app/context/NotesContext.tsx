"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Note = {
  temp_uuid: string;
  tipologia: string;
  localizacao: string;
  avaliable: string;
  preco: number;
  descricao: string;
  created_at: string;
  images: string[]; // Campo para URLs das imagens
};

type NotesContextType = {
  notes: Note[] | null;
  loading: boolean;
  error: string | null;
  refreshNotes: () => Promise<void>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

type NotesProviderProps = {
  children: React.ReactNode;
};

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient(
        "https://jqidnghoneocwhtcpbjn.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaWRuZ2hvbmVvY3dodGNwYmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjcyOTUsImV4cCI6MjA1MTE0MzI5NX0.FWrf7O3VNr4RTo7KoeGAuwolsz7koWqEuwza48wsynM"
      );

      console.log("Buscando imóveis...");
      const { data: properties, error } = await supabase.from("imobiliarios").select();

      if (error) {
        throw new Error(`Erro ao buscar imóveis: ${error.message}`);
      }
      console.log("Imóveis encontrados:", properties);

      const propertiesWithImages = await Promise.all(
        properties.map(async (property: Note) => {
          console.log(`Buscando fotos para o imóvel ID: ${property.temp_uuid}`);
          const { data: photos, error: photoError } = await supabase
            .from("property_photos")
            .select("photo_path")
            .eq("property_id", property.temp_uuid.toString());

          if (photoError) {
            console.error(`Erro ao buscar fotos para o imóvel ${property.temp_uuid}:`, photoError);
            return { ...property, images: ["/default-placeholder.jpg"] };
          }

          console.log(`Fotos encontradas para o imóvel ${property.temp_uuid}:`, photos);

          const images = photos
            .map((photo) => {
              const { data } = supabase.storage
                .from("kubico-facil")
                .getPublicUrl(photo.photo_path);

              console.log(`URL gerada para a imagem:`, data?.publicUrl);
              
              return data?.publicUrl || null;
            })
            .filter((url) => url !== null);

          return { ...property, images: images.length > 0 ? images : ["/326547605_714729620344884_1344181896237920632_n.jpg"] };
        })
      );

      console.log("Imóveis com imagens:", propertiesWithImages);
      setNotes(propertiesWithImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Erro ao carregar imóveis:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        error,
        refreshNotes: fetchNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes deve ser usado dentro de um NotesProvider");
  }

  return context;
};
