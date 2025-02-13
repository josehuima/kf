"use client";

import React from "react";
import Link from "next/link";

const ThankYouPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-orange-600 mb-4">Obrigado!</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Sua reserva foi realizada com sucesso. Em breve, você receberá um e-mail ou ligação de confirmação.
      </p>
      <Link href="/" className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-orange-500 transition">
        
          Voltar para a Página Inicial
        
      </Link>
    </div>
  );
};

export default ThankYouPage;
