import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ContextProvider } from "../context";
import { initializeFirebase } from "../config/firebase";
import { ToastProvider } from "react-toast-notifications";

try {
  initializeFirebase();
} catch (err) {
  console.log(err.message);
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <ToastProvider>
        <Head>
          <meta name="title" content="DogeGram" />
          <meta
            name="description"
            content="shameless clone of Instagram, one feature at a time"
          />

          <meta name="robots" content="index, follow" />
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://dogegram.dityp.com" />
          <meta property="og:title" content="DogeGram" />
          <meta property="og:description" content='{{ .Scratch.Get "desc" }}' />
          <meta
            property="og:image"
            content="https://i.ibb.co/ftXkCs2/5777dac3a875c78bddc572eada99f64f.jpg"
            name="image"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://dogegram.dityp.com" />
          <meta property="twitter:title" content="DogeGram" />
          <meta
            property="twitter:description"
            content="shameless clone of Instagram, one feature at a time"
          />
          <meta
            property="twitter:image"
            content="https://i.ibb.co/ftXkCs2/5777dac3a875c78bddc572eada99f64f.jpg"
          />
        </Head>
        <Component {...pageProps} />
      </ToastProvider>
    </ContextProvider>
  );
}

export default MyApp;

("https://i.ibb.co/ftXkCs2/5777dac3a875c78bddc572eada99f64f.jpg");
