import { LangProvider } from "../contexts/LangContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <LangProvider>
      <Component {...pageProps} />
    </LangProvider>
  );
}
