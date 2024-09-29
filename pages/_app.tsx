import { SessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '../styles/ThemeContext'; // Adjust the path if necessary
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;