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
        <Component {...pageProps} />
      </ToastProvider>
    </ContextProvider>
  );
}

export default MyApp;
