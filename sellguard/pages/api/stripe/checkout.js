import { getStripe } from "../../../lib/stripe";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { rateLimit } from "../../../lib/rateLimit";

// POST /api/stripe/checkout
// Crée une session Stripe Checkout pour l'abonnement Pro.
//
// Auth : Bearer JWT Supabase (l'utilisateur doit être connecté pour souscrire,
// on a besoin de son user.id pour rattacher l'abonnement au bon compte).
//
// Le supabase_user_id est attaché de 3 façons (ceinture + bretelles) :
//   - client_reference_id (lisible sur checkout.session.completed)
//   - metadata.supabase_user_id (sur la session)
//   - subscription_data.metadata.supabase_user_id (sur tous les events sub)
//
// Réponses :
//   200 { url }  -> rediriger le navigateur vers cette URL Stripe
//   401          -> non authentifié
//   429          -> rate limit
//   500          -> config ou erreur Stripe

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const rl = await rateLimit(req, { name: "stripe-checkout", limit: 10, windowSec: 60 });
  if (!rl.ok) {
    res.setHeader("Retry-After", rl.retryAfter);
    return res.status(429).json({ error: "Trop de tentatives, réessaie dans une minute." });
  }

  // Auth
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: "Bearer token manquant" });
  const jwt = match[1];

  const supa = getSupabaseAdmin();
  const { data: userData, error: authErr } = await supa.auth.getUser(jwt);
  if (authErr || !userData?.user) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
  const user = userData.user;

  const priceId = process.env.STRIPE_PRICE_ID_PRO;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.sellcov.com";
  if (!priceId) {
    console.error("[stripe/checkout] Missing STRIPE_PRICE_ID_PRO");
    return res.status(500).json({ error: "Configuration paiement incomplète" });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id },
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
      allow_promotion_codes: true,
      success_url: `${appUrl}/compte?upgraded=1`,
      cancel_url: `${appUrl}/compte`,
    });
    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("[stripe/checkout] error:", e.message);
    return res.status(500).json({ error: "Erreur création session de paiement" });
  }
}
