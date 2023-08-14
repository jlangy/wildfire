import 'styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import Navigation from 'components/Navigation'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NextLink from 'next/link';
import { forwardRef } from 'react';

const LinkBehaviour = forwardRef(function LinkBehaviour(props: any, ref: any) {
    return <NextLink ref={ref} {...props} />;
});

const theme = createTheme({
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehaviour
            }
        },
    },
    palette: {
      primary: {
        main: '#003366',
        light: '#38598A',
      } ,
      background: {
          default: '#F2F2F2',
          paper: '#F2F2F2',
      },
      text: {
         primary: '#606060',
         secondary: '#606060', 
      }
    },
  });

export default function App({ Component, pageProps }: AppProps<{
    session: Session;
}>) {
    return (
        <ThemeProvider theme={theme}>
            <SessionProvider session={pageProps.session}>
                <CssBaseline />
                <Navigation />
                <Component {...pageProps} />
            </SessionProvider>
        </ThemeProvider>
    )
}
