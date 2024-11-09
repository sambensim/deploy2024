// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import '../src/styles/globals.css';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
return (
    <SessionProvider session={session}>
    <Component {...pageProps} />
    </SessionProvider>
);
}