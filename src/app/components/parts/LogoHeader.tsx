"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CustomSignOutButton from "@/components/ui/CustomSignOutButton";
import CustomSignIn from "@/components/ui/CustomSignIn";
import { UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { Button } from "@radix-ui/themes";

type LogoHeaderProps = {
  altText?: string;
  href?: string;
};

const LogoHeader: React.FC<LogoHeaderProps> = ({
  altText = "Logo",
  href = "/",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Fecha o menu quando a sessão muda (opcional)
  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    // Definimos uma altura fixa (h-16) para o header
    <header className="flex items-center justify-between px-4 h-20 bg-orange-500 relative">
    {/* Container fixo para o logo (160px x 56px) */}
    <Link href={href} passHref>
      <div className="relative">
        <Image
          priority
          src="/logo2-removebg-preview.png"
          alt={altText}
          width={150}
          height={48}
          className="object-contain"
        />
      </div>
    </Link>

      {/* Ícone do menu hambúrguer - visível apenas em telas pequenas */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menu de navegação (itens centrais) */}
      <nav
        className={`absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 space-y-2 md:p-0 md:static md:flex md:items-center md:space-x-6 transition-transform ${
          menuOpen ? "block" : "hidden"
        } md:flex`}
      >
         <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
        <Link
          href="/"
          className="block px-4 py-2 text-orange-600 hover:text-orange-800"
        >
          Página Inicial
        </Link>

        <SignedIn>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-orange-600 hover:text-orange-800"
          >
            Dashboard
          </Link>

          {/* Botão "Terminar Sessão" apenas em telas pequenas */}
          <div className="block md:hidden">
            <CustomSignOutButton />
          </div>
          
        </SignedIn>
        </div>
        
      </nav>

      {/* Área à direita: Avatar se logado ou botão de "Iniciar Sessão" se não logado */}
      <div className="flex items-center">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <CustomSignIn />
        </SignedOut>
      </div>
    </header>
  );
};

export default LogoHeader;
