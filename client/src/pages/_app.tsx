import type { AppProps } from "next/app";
import "../styles/app.scss";
import Head from "next/head";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {process.env.NODE_ENV !== "development" && (
          <>
            <Script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-98FWXPYRCH"
            ></Script>
            <Script>{`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-98FWXPYRCH');`}</Script>
          </>
        )}
        <title>Theme builder for U.S. Web Design System (USWDS)</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
