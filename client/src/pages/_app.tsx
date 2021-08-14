import type { AppProps } from 'next/app'
import "../styles/app.scss";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Theme builder for U.S. Web Design System (USWDS)</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
