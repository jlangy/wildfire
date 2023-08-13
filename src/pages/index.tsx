import { Container, Grid, Paper, Backdrop, CircularProgress, Divider, Button, Typography } from '@mui/material'
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
    const session = useSession();
    return (
        <main>
            <Container maxWidth='md'>
                <Typography variant='h3' sx={{ mt: 4 }}>Wildfire BC</Typography>
                <Typography sx={{ py: 4 }}>Welcome to Wildfire. This application is made to help display data about wildfires in the province of B.C by their status, location, and cause.
                </Typography>
                {session.status === 'authenticated' ? (
                    <Button href='/map' variant='contained' size='large'>Continue to Map</Button>
                ) : (
                    <Button variant='contained' size='large' onClick={() => signIn(undefined, { callbackUrl: `${window.location.origin}/map` })}>Login</Button>
                )}
            </Container>
        </main>
    )
}
