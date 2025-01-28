import React from "react";
import Image from "next/image";
import Link from "next/link";
import CustomSignIn from "@/components/ui/CustomSignIn";
import { UserButton, SignedOut, SignedIn } from "@clerk/nextjs";

type LogoHeaderProps = {
  altText?: string; // Texto alternativo para acessibilidade
  href?: string; // Link para onde o logo redireciona, caso aplicável
};

const LogoHeader: React.FC<LogoHeaderProps> = ({
  altText = "Logo",
  href = "/",
}) => {
  return (
    <header className="flex items-center justify-between p-4 bg-orange-1000">
      {/* Logotipo à esquerda */}
      <Link href={href} passHref>
        <Image src="/logo-kubico-facil.jpg" alt={altText} width={80} height={80} />
      </Link>

      {/* Botão de login à direita */}
      <div>
        <SignedOut>
          <CustomSignIn />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default LogoHeader;
