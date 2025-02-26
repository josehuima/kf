"use client";

import React from "react";

export default function TermsOfUsePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Termos e Condições de Uso</h1>




 {/* Link para baixar o PDF */}
 <section className="mt-6">
        <a
          href="/termo_condicoes_kubico_facil.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Baixar Termos e Condições (PDF)
        </a>
      </section>




      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">8. Contato</h2>
        <p className="text-gray-700">
          Em caso de dúvidas sobre estes Termos, entre em contato conosco:
          <br />
          E-mail:{" "}
          <a className="text-blue-500" href="mailto:geral@kubico.com">
            geral@kubico.com
          </a>
        </p>
      </section>

      <section className="mt-8">
        <p className="text-gray-600 text-sm">
          Última atualização: 15 de fevereiro de 2025
        </p>
      </section>
    </main>
  );
}
