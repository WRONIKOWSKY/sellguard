import Stripe from "stripe";

// Client Stripe serveur uniquement. Utilise STRIPE_SECRET_KEY (jamais exposée
// au front). NE JAMAIS importer ce fichier depuis pages/ ou components/.
//
// Env vars requises (à définir dans Vercel) :
//   STRIPE_SECRET_KEY      -> sk_test_... (mode test) puis sk_live_... (prod)
//   STRIPE_WEBHOOK_SECRET  -> whsec_... (signing secret de l'endpoint webhook)
//   STRIPE_PRICE_ID_PRO    -> price_... (le prix récurrent 49 EUR/mois du plan Pro)
//   NEXT_PUBLIC_APP_URL    -> https://www.sellcov.com (pour success/cancel URLs)

let cached = null;

export function getStripe() {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Missing env STRIPE_SECRET_KEY");
  }
  cached = new Stripe(key, { apiVersion: "2024-06-20" });
  return cached;
}
