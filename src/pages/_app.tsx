import 'styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react'
import {Session} from 'next-auth'
import Navigation from 'components/Navigation'

export default function App({ Component, pageProps }: AppProps<{
    session: Session;
  }>) {
    return (
        <SessionProvider session={pageProps.session}>
            <CssBaseline />
            <Navigation />

            <Component {...pageProps} />
        </SessionProvider>
    )
}
