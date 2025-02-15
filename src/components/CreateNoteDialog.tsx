"use client";
import React, { useState, useEffect} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import {Button} from "./ui/button"
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@supabase/supabase-js";
type Props = {};


// 🔹 Tipagem para opções
type Option = {
  id: number;
  name: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "As variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não estão definidas."
  );
}

// 🔹 Inicializar Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);


const CreateNoteDialog = (props: Props) => {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  const {  userId } = useAuth();
  const [tipologias, setTipologias] = useState<Option[]>([]);
  const [localizacoes, setLocalizacoes] = useState<Option[]>([]);
  const [selectedTipologia, setSelectedTipologia] = useState<string | null>(null);
  const [selectedLocalizacao, setSelectedLocalizacao] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

   // 🔹 Buscar Tipologias e Localizações
   useEffect(() => {
    const fetchData = async () => {
      const { data: tipologiasData, error: tipologiaError } = await supabase
        .from("Natureza")
        .select("*");
      
      if (tipologiaError) {
        console.error("Erro ao carregar os dados");
        setLoading(false);
        return;
      }

      setTipologias(tipologiasData.map((t: any) => ({ id: t.id, name: t.name })));
      
      setLoading(false);
    };

    fetchData();
  }, []);


  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createProjectBook", {
        userId,
        natureza: selectedTipologia,
        
      });
      return response.data;
    },
  });

  // 🔹 Envio do formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedTipologia) {
      window.alert("Por favor selecione a tipologia e localização.");
      return;
    }

    createNotebook.mutate(undefined, {
      onSuccess: ({ project_id }) => {
        console.log("Processo criado com sucesso!:", { project_id });
        // hit another endpoint to uplod the temp dalle url to permanent firebase url
        router.push(`/notebook/${project_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Ocorreu um erro ao guardar o processo!");
      },
    });
  };

  return (
    <Dialog>
    <DialogTrigger>
      <div className="border-dashed border-2 flex border-orange-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
        <Plus className="w-6 h-6 text-orange-600" strokeWidth={3} />
        <h2 className="font-semibold text-orange-600 sm:mt-2">
          Novo anúncio
        </h2>
      </div>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Novo anúncio</DialogTitle>
        <DialogDescription>
          Anuncie um novo imóvel digitando os dados abaixo.
        </DialogDescription>
      </DialogHeader>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* 🔹 Seleção de Tipologia */}
          <Select onValueChange={setSelectedTipologia}>
            <SelectTrigger className="w-full">
            <SelectValue placeholder={selectedTipologia || "Selecione a tipologia"} />
            </SelectTrigger>
            <SelectContent>
              {tipologias.map((tipologia) => (
                <SelectItem key={tipologia.id} value={tipologia.id.toString()}>
                  {tipologia.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-4"></div>
       <div className="h-4"></div>
          <div className="flex items-center gap-2">
          <DialogClose asChild>
      <Button type="reset" variant="destructive">
        Cancelar
      </Button>
    </DialogClose>
            <Button
  type="submit"
  className="bg-orange-600"
  disabled={createNotebook.isPending}
>
  {createNotebook.isPending? (
    <Loader2 className="w-6 h-6 animate-spin" />
  ) : (
    "Criar"
  )}
</Button>
          </div>
        </form>
      )}
    </DialogContent>
  </Dialog>
  );
};

export default CreateNoteDialog;
