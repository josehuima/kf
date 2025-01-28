"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import axios from "axios";
import { Button } from "./ui/button";
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

import React, {useState} from 'react'

interface Props {
    
}



const CreateProjectDialog = (props: Props) => {
    const router = useRouter();
    const [input, setInput] = React.useState("");
    const {  userId } = useAuth();
    const [fieldType, setFieldType] = useState('')
   
    console.log("dados do from: ",fieldType)
  
    const createProject = useMutation({
      mutationFn: async () => {
        const response = await axios.post("/api/createProjectBook", {
          name: input,
          userId: userId,
          estado: fieldType
        });
        return response.data;
      },
    });
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (input === "") {
        window.alert("Por favor digite o nome ou numero do processo");
        return;
      }
      createProject.mutate(undefined, {
        onSuccess: ({ project_id }) => {
          console.log("projecto criado com sucesso!:", { project_id });
          // hit another endpoint to uplod the temp dalle url to permanent firebase url
         
          router.push(`/dashboard`);
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
        <div className="border-dashed border-2 flex border-blue-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-blue-600" strokeWidth={3} />
          <h2 className="font-semibold text-blue-600 sm:mt-2">
            Novo projecto
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo projecto</DialogTitle>
          <DialogDescription>
           Crie o seu projecto digitando os dados abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Dê um titulo ao seu projecto..."
          />
          <div className="h-4"></div>
          <Select onValueChange={(value) => setFieldType(value)} value={fieldType}>
    <SelectTrigger className="w-[460px]">
    <SelectValue placeholder="Visibilidade" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Publico</SelectItem>
    <SelectItem value="2">Privado</SelectItem>
   
  </SelectContent>
</Select>
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant={"secondary"}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-600"
              disabled={createProject.isLoading}
            >
              {createProject.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    )
}

export default CreateProjectDialog
