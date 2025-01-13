import { Theme } from  '@radix-ui/themes'
import "@radix-ui/themes/styles.css";
import LogoHeader from './components/parts/LogoHeader';
import { NotesProvider } from './context/NotesContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body>
        <Theme accentColor="mint" grayColor="gray" panelBackground="solid" radius="large" scaling="95%" >
        <LogoHeader />
        <NotesProvider>
        {children}
        </NotesProvider>
          </Theme>
        </body>
      </html>
  
  )
}