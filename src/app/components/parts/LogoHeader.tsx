import React from "react";
import Image from "next/image";
import Link from "next/link";

type LogoHeaderProps = {
  altText?: string; // Texto alternativo para acessibilidade
  href?: string; // Link para onde o logo redireciona, caso aplicável
};

const LogoHeader: React.FC<LogoHeaderProps> = ({
  altText = "Logo",
  href = "/",
}) => {
  return (
    <header className="flex p-4 bg-orange-200 ml-10">
      <Link href={href} passHref>
        
          <Image src="/logo-kubico-facil.jpg" alt={altText} width={80} height={80} />
       
      </Link>
    </header>
  );
};

export default LogoHeader;
