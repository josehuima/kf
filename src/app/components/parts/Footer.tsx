"use client";

import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Portal. Todos os direitos reservados.
        </div>
        <nav className="mt-4 md:mt-0">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-gray-300">
                Início
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-300">
               Sobre
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-gray-300">
                Serviços
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-gray-300">
                Contato
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-gray-300">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
