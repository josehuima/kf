// ./src/context/NotesContext.tsx
"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Note = {
  id: string;
  tipologia: string;
  localizacao: string;
  avaliable: string;
  preco: number;
  descricao: string;
  created_at: string;
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
      //const supabase = createClient('https://iehsmuxjlrzfwordijiy.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHNtdXhqbHJ6ZndvcmRpaml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEzMzkzNjcsImV4cCI6MjAxNjkxNTM2N30.8hmf2igDjxqcd6WH0LgxLhhzp1z5ll4TZ1hTEiKYRYM');
      const supabase = createClient('https://jqidnghoneocwhtcpbjn.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaWRuZ2hvbmVvY3dodGNwYmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjcyOTUsImV4cCI6MjA1MTE0MzI5NX0.FWrf7O3VNr4RTo7KoeGAuwolsz7koWqEuwza48wsynM'); // Cria o cliente Supabase sem dependência de cookies diretamente

      const { data, error } = await supabase.from("imobiliarios").select(); // Busca as notas

      if (error) {
        throw new Error(error.message);
      }

      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(); // Carrega as notas ao montar o provedor
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
