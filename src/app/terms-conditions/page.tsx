"use client";

import React from "react";

export default function TermsOfUsePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Termos e Condições de Uso</h1>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">1. Introdução</h2>
        <p className="text-gray-700">
          Bem-vindo(a) à [Nome da Empresa/Projeto]! Estes Termos e Condições de Uso
          regem o uso de nosso site e de quaisquer serviços fornecidos. Ao acessar
          ou usar nossos serviços, você concorda em cumprir estes Termos.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">2. Aceitação dos Termos</h2>
        <p className="text-gray-700">
          Ao utilizar este site, você declara ter lido, compreendido e aceitado
          estes Termos e Condições, bem como nossa Política de Privacidade.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">3. Elegibilidade</h2>
        <p className="text-gray-700">
          Você deve ter pelo menos 18 anos para usar nossos serviços ou ser
          autorizado por um responsável legal. Ao usar o site, você declara ter a
          idade mínima exigida ou permissão de um responsável.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">4. Uso Permitido</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>
            Você não deve utilizar nossos serviços para fins ilegais ou não
            autorizados.
          </li>
          <li>
            Você concorda em cumprir todas as leis locais, estaduais, nacionais e
            internacionais aplicáveis.
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">5. Direitos de Propriedade Intelectual</h2>
        <p className="text-gray-700">
          Todo o conteúdo presente neste site, incluindo textos, imagens, marcas e
          logotipos, é de propriedade exclusiva de [Nome da Empresa/Projeto] ou de
          terceiros licenciados. Qualquer uso, reprodução ou distribuição sem
          permissão é estritamente proibido.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">6. Limitação de Responsabilidade</h2>
        <p className="text-gray-700">
          Não nos responsabilizamos por danos diretos, indiretos, incidentais ou
          consequentes decorrentes do uso ou da incapacidade de uso de nossos
          serviços. Você concorda em usar o site por sua conta e risco.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">7. Modificações nos Termos</h2>
        <p className="text-gray-700">
          Podemos alterar estes Termos a qualquer momento. Quaisquer alterações
          serão publicadas nesta página, e seu uso contínuo do site após a
          publicação das alterações constitui sua aceitação dos novos Termos.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">8. Contato</h2>
        <p className="text-gray-700">
          Em caso de dúvidas sobre estes Termos, entre em contato conosco:
          <br />
          Email: <a className="text-blue-500" href="mailto:contato@seudominio.com">contato@seudominio.com</a>
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
