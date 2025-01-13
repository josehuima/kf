import { Theme } from  '@radix-ui/themes'
import "@radix-ui/themes/styles.css";
import LogoHeader from './components/parts/LogoHeader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body>
        <Theme accentColor="mint" grayColor="gray" panelBackground="solid" radius="full" scaling="95%" >
        <LogoHeader />
          {children}
          </Theme>
        </body>
      </html>
  
  )
}