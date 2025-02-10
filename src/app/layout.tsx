import { Theme } from  '@radix-ui/themes'
import "@radix-ui/themes/styles.css";
import "./globals.css";
import LogoHeader from './components/parts/LogoHeader';
import { NotesProvider } from './context/NotesContext';
import { ClerkProvider } from '@clerk/nextjs';
import { ptBR } from "@clerk/localizations";
import type { Metadata } from "next";
import Provider from '@/components/Provider';

export const metadata: Metadata = {
  title: "Kubico Fácil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={ptBR}>
      <Provider>
      <html lang="en">
        <body>
        <Theme accentColor="orange" className="bg-neutral-100"   panelBackground="solid" radius="large" scaling="95%" >
        <LogoHeader />
        
        <NotesProvider>
        {children}
        </NotesProvider>
          </Theme>
        </body>
      </html>
      </Provider>
      </ClerkProvider>
  )
}