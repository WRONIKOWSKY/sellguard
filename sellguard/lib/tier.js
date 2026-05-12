// Système de tiers d'abonnement SellCov.
//
// Le tier est stocké dans Supabase auth.users.raw_app_meta_data.tier
// (= user.app_metadata.tier côté API). Ce champ n'est PAS modifiable par
// le user lui-même, contrairement à user_metadata — seul le service_role
// peut y écrire (via le webhook Stripe / un script admin / Supabase SQL).
//
// Pour upgrader un user manuellement (Supabase SQL Editor) :
//
//   update auth.users
//   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
//                         || '{"tier": "pro"}'::jsonb
//   where email = 'user@example.com';
//
// Tiers possibles :
//   - beta      : phase pré-lancement, tout le monde par défaut (généreux)
//   - discovery : plan gratuit ≈ "3 certificats/mois" (CGU)
//   - seller    : plan 14,90 €/mois ≈ "30 certificats/mois" (CGU)
//   - pro       : plan 29,90 €/mois ≈ "illimité" (CGU)
//   - admin     : compte interne, quasi-illimité

export const DEFAULT_TIER = "beta";

// Quotas journaliers par tier et par endpoint.
// Les valeurs "mensuelles" du CGU sont converties en daily avec marge
// pour absorber les burst d'usage (ex: 30 ventes/mois = ~1/jour mais on
// permet 30/jour pour gérer un user qui fait 30 ventes en une journée).
const TIER_LIMITS = {
  beta: {
    analyze: 20,
    litige: 10,
    upload: 10,
  },
  discovery: {
    analyze: 5,
    litige: 3,
    upload: 3,
  },
  seller: {
    analyze: 50,
    litige: 30,
    upload: 30,
  },
  pro: {
    analyze: 200,
    litige: 200,
    upload: 200,
  },
  admin: {
    analyze: 9999,
    litige: 9999,
    upload: 9999,
  },
};

// Retourne le tier d'un user à partir de l'objet user Supabase.
// Fallback DEFAULT_TIER si app_metadata.tier absent ou invalide.
export function getUserTier(user) {
  const raw = user?.app_metadata?.tier;
  if (typeof raw === "string" && TIER_LIMITS[raw]) return raw;
  return DEFAULT_TIER;
}

// Retourne la limite journalière pour un (tier, endpoint).
// Si l'endpoint est inconnu pour ce tier, retourne fallback (default 10).
export function getTierLimit(tier, endpoint, fallback = 10) {
  const t = TIER_LIMITS[tier] || TIER_LIMITS[DEFAULT_TIER];
  const limit = t?.[endpoint];
  return typeof limit === "number" ? limit : fallback;
}
