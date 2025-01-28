import CreateNoteDialog from "@/components/CreateNoteDialog";
import { Separator } from "@/components/ui/separator";
import { auth, currentUser } from '@clerk/nextjs/server'
import { UserButton  } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { createClient } from '@supabase/supabase-js'
import { truncateText } from '../lib/utils'
import { formatDateDistance } from "../lib/utils";
import { Button } from "@radix-ui/themes";

type Props = {};

const DashboardPage = async (props: Props) => {


  const { userId } = await auth();

    const supabase = createClient('https://iehsmuxjlrzfwordijiy.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllaHNtdXhqbHJ6ZndvcmRpaml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEzMzkzNjcsImV4cCI6MjAxNjkxNTM2N30.8hmf2igDjxqcd6WH0LgxLhhzp1z5ll4TZ1hTEiKYRYM');
  const { data: notes } = await supabase.from("notes").select().eq('userId', userId);


  return (
    <>
      <div className="grainy min-h-screen">
        <div className="max-w-7xl mx-auto p-10">
          <div className="h-14"></div>
          <div className="flex justify-between items-center md:flex-row flex-col">
            <div className="flex items-center">
              <Link href="/">
                <Button className="bg-green-600" size="3">
                  <ArrowLeft className="mr-1 w-4 h-4" />
                  Voltar 
                </Button>
              </Link>
              <div className="w-4"></div>
              <h3 className="text-3xl font-bold text-gray-900">Minhas notas</h3>
              <div className="w-4"></div>
              <UserButton />
            </div>
          </div>

          <div className="h-8"></div>
          <Separator />
          <div className="h-8"></div>
          {/* list all the notes */}
          {/* if no notes, display this */}
          {notes?.length === 0 && (
            <div className="text-center">
              <h2 className="text-xl text-gray-500">Nenhum apontamento encontrado.</h2>
            </div>
          )}

          {/* display all the notes */}
          <div className="grid sm:grid-cols-9 md:grid-cols-5 grid-cols-1 gap-2">
            <CreateNoteDialog />
           
            {notes?.map((note) => {
              return (
                <a href={`/notebook/${note.id}`} key={note.id}>
                  <div className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                  <Image
                      width={100}
                      height={50}
                      alt={note.name}
                      src="notepad.svg"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                      {truncateText(note.name, 10)} 
                      </h3>
                      <div className="h-1"></div>
                      <p className="text-sm text-gray-500">
                    
                       {formatDateDistance(note.criated)}
                      </p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
