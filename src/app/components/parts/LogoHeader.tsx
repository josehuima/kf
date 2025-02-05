"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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

  return (
    <header className="flex items-center justify-between p-4 bg-orange-600">
      {/* Logotipo */}
      <Link href={href} passHref>
        <Image src="/logo-kubico-facil.jpg" alt={altText} width={80} height={80} />
      </Link>

      {/* Ícone do menu hambúrguer - visível apenas em telas pequenas */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menu (responsivo) */}
      <nav
        className={`absolute top-16 right-4 bg-white shadow-lg rounded-lg p-4 md:p-0 md:static md:flex md:items-center transition-transform ${
          menuOpen ? "block" : "hidden"
        } md:block`}
      >
        <SignedOut>
          <CustomSignIn />
        </SignedOut>
        <SignedIn>
          <Link
            href="/dashboard"
            className="block px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700 md:inline"
          >
            Dashboard
          </Link>
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
};

export default LogoHeader;
