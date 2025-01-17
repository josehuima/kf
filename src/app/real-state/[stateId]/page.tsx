import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import * as React from 'react';


type Params = Promise<{ stateId: string[] }>;

async function Page({ params }: { params: Params }) {
    const { stateId } = await params;

    // Inicializar Supabase
    const supabase = createClient(
        'https://jqidnghoneocwhtcpbjn.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxaWRuZ2hvbmVvY3dodGNwYmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjcyOTUsImV4cCI6MjA1MTE0MzI5NX0.FWrf7O3VNr4RTo7KoeGAuwolsz7koWqEuwza48wsynM'
    );

    // Consultar os dados
    const { data: notes } = await supabase
        .from("imobiliarios")
        .select()
        .eq('id', stateId);

    // Redirecionar se o item não existir ou for inválido
    if (!notes || notes.length !== 1) {
        redirect("/dashboard");
    }

    // Renderizar os detalhes
    return (
        <div>
            <h1>Real State Details for {stateId}</h1>
            <pre>{JSON.stringify(notes, null, 2)}</pre>
        </div>
    );
}

export default Page;
