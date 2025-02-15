"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { RealState } from "@/lib/db/schema";

type NotesContextType = {
  notes: RealState[] | null;
  loading: boolean;
  error: string | null;
  refreshNotes: () => Promise<void>;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

type NotesProviderProps = {
  children: React.ReactNode;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<RealState[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
      );
    }

    try {
      const supabase = createClient(
        supabaseUrl,
    supabaseAnonKey
      );
      const { data: properties, error } = await supabase.from("imo").select().eq('avaliable', true);

      if (error) {
        throw new Error(`Erro ao buscar imóveis: ${error.message}`);
      }
      const propertiesWithImages = await Promise.all(
        properties.map(async (property: RealState) => {
          
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
          return { ...property, images: images.length > 0 ? images : ["/326547605_714729620344884_1344181896237920632_n.jpg"] };
        })
      );
      setNotes(propertiesWithImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
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
