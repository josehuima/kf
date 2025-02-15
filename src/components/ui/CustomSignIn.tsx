import { SignInButton } from '@clerk/nextjs'
import { Button } from '@radix-ui/themes'


export default function CustomSignIn() {
  return (
    <div>
    <SignInButton >
      <Button>Iniciar sessão</Button>
    </SignInButton>

<Button>Anunciar</Button>
</div>
  )
}