"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CustomSignOutButton from "@/components/ui/CustomSignOutButton";
import CustomSignIn from "@/components/ui/CustomSignIn";
import { UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

type LogoHeaderProps = {
  altText?: string;
  href?: string;
};

const LogoHeader: React.FC<LogoHeaderProps> = ({
  altText = "Logo",
  href = "/",
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Fechar menu automaticamente ao sair da sessão
  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-orange-600">
      {/* Logotipo */}
      <Link href={href} passHref>
        <Image src="/logo-kubico-facil.jpg" alt={altText} width={80} height={80} />
      </Link>

      {/* Ícone do menu hambúrguer - aparece apenas em telas pequenas */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menu (responsivo) */}
      <nav
        className={`absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 space-y-2 md:p-0 md:static md:flex md:items-center md:space-x-6 transition-transform ${
          menuOpen ? "block" : "hidden"
        } md:flex`}
      >
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

        <SignedOut>
          {/* O botão de login sempre aparecerá corretamente sem sobreposição */}
          <div className="block">
            <CustomSignIn />
          </div>
        </SignedOut>
      </nav>

      {/* Avatar do usuário (fixo à direita) */}
      <div className="hidden md:block">
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default LogoHeader;
