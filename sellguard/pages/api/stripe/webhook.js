import { getStripe } from "../../../lib/stripe";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

// POST /api/stripe/webhook
// Reçoit les events Stripe et synchronise le tier de l'utilisateur.
//
// Events traités :
//   checkout.session.completed        -> tier = "seller" (plan Pro payé)
//   customer.subscription.deleted     -> tier = "discovery" (résiliation)
//   customer.subscription.updated     -> si status != active -> "discovery"
//
// Le supabase_user_id est lu depuis metadata.supabase_user_id (présent sur
// la session ET sur la subscription grâce à /api/stripe/checkout).
//
// Sécurité : la signature Stripe est vérifiée avec STRIPE_WEBHOOK_SECRET.
// Le bodyParser Next.js est désactivé (raw body requis pour la signature).

export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function setTier(userId, tier) {
  if (!userId) {
    console.error("[stripe/webhook] setTier appelé sans userId");
    return;
  }
  const supa = getSupabaseAdmin();
  const { error } = await supa.auth.admin.updateUserById(userId, {
    app_metadata: { tier },
  });
  if (error) {
    console.error(`[stripe/webhook] updateUserById(${userId}) error:`, error.message);
  } else {
    console.log(`[stripe/webhook] user ${userId} -> tier=${tier}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe/webhook] Missing STRIPE_WEBHOOK_SECRET");
    return res.status(500).json({ error: "Webhook non configuré" });
  }

  let event;
  try {
    const stripe = getStripe();
    const rawBody = await getRawBody(req);
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (e) {
    console.error("[stripe/webhook] signature verification failed:", e.message);
    return res.status(400).json({ error: "Signature invalide" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId =
          session.client_reference_id ||
          session.metadata?.supabase_user_id;
        await setTier(userId, "seller");
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId = sub.metadata?.supabase_user_id;
        await setTier(userId, "discovery");
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const userId = sub.metadata?.supabase_user_id;
        // active / trialing = accès Pro. Tout autre statut = downgrade.
        const tier = sub.status === "active" || sub.status === "trialing"
          ? "seller"
          : "discovery";
        await setTier(userId, tier);
        break;
      }
      default:
        // Event non traité, on l'acquitte quand même (200) pour éviter les retries Stripe.
        break;
    }
  } catch (e) {
    console.error("[stripe/webhook] handler error:", e.message);
    return res.status(500).json({ error: "Erreur traitement event" });
  }

  return res.status(200).json({ received: true });
}
