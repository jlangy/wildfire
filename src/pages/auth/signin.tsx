import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import GitHubIcon from '@mui/icons-material/GitHub';
import styles from './navigation.module.css'

export default function SignIn({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <Container sx={{ mt: 4 }} maxWidth='md'>
            <Paper sx={{minHeight: '20rem', paddingX: 4}}>
                <Stack spacing={3} alignItems="center">
                    <Typography variant='h3'>Login</Typography>
                    <Typography>Select a provider below to authenticate with.</Typography>
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name}>
                            {/*TODO: Render optionally if more providers are added.*/}
                            <Button variant='contained' sx={{backgroundColor: '#27272a', ":hover": { backgroundColor: '#16171b' }}} onClick={() => signIn(provider.id)} endIcon={<GitHubIcon />}>
                                Continue with Github
                            </Button>
                        </div>
                    ))}
                </Stack>
            </Paper>
        </Container>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);

    // If the user is already logged in, redirect.
    // Note: Make sure not to redirect to the same page
    // To avoid an infinite loop!
    if (session) {
        return { redirect: { destination: "/" } };
    }

    const providers = await getProviders();

    return {
        props: { providers: providers ?? [] },
    }
}