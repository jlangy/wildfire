import { Container, Button, Typography } from '@mui/material'
import { useSession, signIn } from "next-auth/react"
import Link from 'next/link'

export default function Home() {
    const session = useSession();
    return (
        <main>
            <Container maxWidth='md'>
                <Typography variant='h3' sx={{ mt: 4 }}>Wildfire BC</Typography>
                <Typography sx={{ py: 4 }}>Welcome to Wildfire. This application is made to help display data about wildfires in the province of B.C by their status, location, and cause.
                </Typography>
                {session.status === 'authenticated' ? (
                    <Button href='/map' component={Link} variant='contained' size='large'>Continue to Map</Button>
                ) : (
                    <Button
                        variant='contained'
                        size='large'
                        onClick={() => signIn(undefined, { callbackUrl: `${window.location.origin}/map` })}
                    >
                        Login
                    </Button>
                )}
            </Container>
        </main>
    )
}
