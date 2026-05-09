import Script from "next/script";
import { LangProvider } from "../contexts/LangContext";
import "../styles/globals.css";

// Variables d'environnement (à définir dans Vercel) :
//   NEXT_PUBLIC_PLAUSIBLE_DOMAIN  -> ex: sellcov.com  (compte sur plausible.io)
//   NEXT_PUBLIC_SENTRY_DSN        -> DSN Sentry (free tier sur sentry.io)
// Sans ces variables, les scripts ne sont pas chargés.

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || null;
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || null;

export default function App({ Component, pageProps }) {
  return (
    <LangProvider>
      {/* Plausible Analytics — privacy-friendly, sans cookies, RGPD-compliant */}
      {PLAUSIBLE_DOMAIN && (
        <Script
          defer
          data-domain={PLAUSIBLE_DOMAIN}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}

      {/* Sentry Browser SDK — tracking erreurs JS en prod */}
      {SENTRY_DSN && (
        <>
          <Script
            src="https://browser.sentry-cdn.com/7.119.0/bundle.min.js"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          <Script id="sentry-init" strategy="afterInteractive">
            {`
              if (typeof Sentry !== 'undefined') {
                Sentry.init({
                  dsn: '${SENTRY_DSN}',
                  tracesSampleRate: 0.1,
                  environment: '${process.env.NODE_ENV || "production"}',
                });
              }
            `}
          </Script>
        </>
      )}

      <Component {...pageProps} />
    </LangProvider>
  );
}
