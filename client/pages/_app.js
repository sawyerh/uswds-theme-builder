import "../styles/app.scss";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
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
