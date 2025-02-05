import { SignOutButton } from '@clerk/nextjs'
import { Button } from '@radix-ui/themes'


export default function CustomSignOutButton() {
  return (
    
    <SignOutButton redirectUrl="/">
      Terminar Sessão
      </SignOutButton>
    
  )
}