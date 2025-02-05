import CreateNoteDialog from "@/components/CreateNoteDialog";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { createClient } from "@supabase/supabase-js";
import { truncateText, formatDateDistance } from "../lib/utils";
import DeleteNoteButton from "@/components/DeleteNoteButton"
import { Button } from "@radix-ui/themes";

type Props = {};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const DashboardPage = async (props: Props) => {
  const { userId } = await auth();

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: notes } = await supabase
    .from("imobiliarios")
    .select()
    .eq("userId", userId);

  return (
    <>
      <div className="grainy min-h-screen">
        <div className="max-w-7xl mx-auto p-10">
          <div className="h-14"></div>
          <div className="flex justify-between items-center md:flex-row flex-col">
            <div className="flex items-center">
              <Link href="/">
                <Button className="bg-orange-600" size="3">
                  <ArrowLeft className="mr-1 w-4 h-4" />
                  Voltar
                </Button>
              </Link>
              <div className="w-4"></div>
              <h4 className="font-bold text-orange-900">Meus anúncios</h4>
            </div>
            
          </div>

          <div className="h-8"></div>
          <Separator />
          <div className="h-8"></div>
          {notes?.length === 0 && (
            <div className="text-center">
              <h2 className="text-xl text-gray-500">Nenhum anúncio encontrado.</h2>
            </div>
          )}

          <div className="grid sm:grid-cols-9 md:grid-cols-5 grid-cols-1 gap-2">
            <CreateNoteDialog />

            {notes?.map((note) => {
              return (
                <div key={note.temp_uuid} className="flex flex-col gap-2">
                  <a href={`/notebook/${note.temp_uuid}`}>
                    <div className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                      <Image
                        width={100}
                        height={50}
                        alt={note.descricao}
                        src="notepad.svg"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {truncateText(note.descricao, 10)}
                        </h3>
                        <div className="h-1"></div>
                        <p className="text-sm text-gray-500">
                          {formatDateDistance(note.created_at)}
                        </p>
                      </div>
                    </div>
                  </a>
                  <DeleteNoteButton noteId={note.temp_uuid} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
