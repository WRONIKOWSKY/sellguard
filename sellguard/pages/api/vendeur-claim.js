import { withAuth } from "../../lib/withAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { rateLimit } from "../../lib/rateLimit";

// POST /api/vendeur-claim — revendique un pseudo de plateforme (auth requise)
//
// Body JSON : { handle, platform }
// Le slug est dérivé du handle (minuscules, @ et espaces retirés) et doit être
// unique : premier arrivé, premier servi. Un utilisateur peut re-claimer pour
// changer de pseudo (son ancien slug est libéré de fait, la colonne est
// écrasée).
//
// Réponses :
//   200 { handle, platform, slug } — succès
//   400 — handle/platform invalide
//   409 — slug déjà pris par un autre compte
//   401/429/500 — gérés par withAuth / rateLimit

const PLATFORMS = ["vinted", "depop", "grailed", "vestiaire", "etsy", "autre"];

export function slugify(handle) {
  return String(handle || "")
    .trim()
    .replace(/^@+/, "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._-]/g, "");
}

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rl = await rateLimit(req, { name: "vendeur-claim", limit: 10, windowSec: 60 });
  if (!rl.ok) {
    res.setHeader("Retry-After", rl.retryAfter);
    return res.status(429).json({ error: "Trop de requêtes, réessaie dans une minute" });
  }

  const body = req.body || {};
  const handle = String(body.handle || "").trim().substring(0, 40);
  const platform = String(body.platform || "vinted");

  if (!PLATFORMS.includes(platform)) {
    return res.status(400).json({ error: "Plateforme invalide" });
  }
  const slug = slugify(handle);
  if (slug.length < 3 || slug.length > 30) {
    return res.status(400).json({ error: "Pseudo invalide (3 à 30 caractères, lettres/chiffres/._-)" });
  }

  const supa = getSupabaseAdmin();

  // Slug déjà pris par un autre compte ?
  const { data: existing, error: lookupErr } = await supa
    .from("profiles")
    .select("id")
    .eq("handle_slug", slug)
    .neq("id", req.user.id)
    .maybeSingle();
  if (lookupErr) {
    console.error("[vendeur-claim] lookup error:", lookupErr);
    return res.status(500).json({ error: "Erreur serveur" });
  }
  if (existing) {
    return res.status(409).json({ error: "Ce pseudo est déjà revendiqué par un autre compte" });
  }

  const { error: updateErr } = await supa
    .from("profiles")
    .update({
      public_handle: handle.replace(/^@+/, ""),
      handle_platform: platform,
      handle_slug: slug,
      handle_claimed_at: new Date().toISOString(),
    })
    .eq("id", req.user.id);
  if (updateErr) {
    console.error("[vendeur-claim] update error:", updateErr);
    return res.status(500).json({ error: "Erreur serveur (migration vendeur-badge appliquée ?)" });
  }

  return res.status(200).json({ handle: handle.replace(/^@+/, ""), platform, slug });
}

export default withAuth(handler, { endpoint: "vendeur-claim", dailyLimit: 20 });
