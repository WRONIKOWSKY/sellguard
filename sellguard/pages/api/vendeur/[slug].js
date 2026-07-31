import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { rateLimit } from "../../../lib/rateLimit";

// GET /api/vendeur/[slug]
// PUBLIC — c'est l'endpoint derrière la page /vendeur/[slug] et le QR du
// badge. Renvoie uniquement des agrégats (pseudo, plateforme, nombre d'envois
// certifiés, date du premier certificat) : jamais la liste des certificats,
// dont les URLs restent non devinables.

export default async function handler(req, res) {
  const rl = await rateLimit(req, { name: "vendeur-public", limit: 30, windowSec: 60 });
  if (!rl.ok) {
    res.setHeader("Retry-After", rl.retryAfter);
    return res.status(429).json({ error: "Too many requests, retry in a minute" });
  }

  const { slug } = req.query;
  if (!slug || typeof slug !== "string" || !/^[a-z0-9._-]{3,30}$/.test(slug)) {
    return res.status(400).json({ error: "Slug invalide" });
  }

  const supa = getSupabaseAdmin();

  const { data: profile, error } = await supa
    .from("profiles")
    .select("id, public_handle, handle_platform, handle_claimed_at")
    .eq("handle_slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[vendeur-public] lookup error:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
  if (!profile) {
    return res.status(404).json({ error: "Vendeur introuvable" });
  }

  const { count, error: countErr } = await supa
    .from("certificats")
    .select("cert_id", { count: "exact", head: true })
    .eq("user_id", profile.id);
  if (countErr) {
    console.error("[vendeur-public] count error:", countErr);
  }

  let firstCertAt = null;
  const { data: firstCert } = await supa
    .from("certificats")
    .select("created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (firstCert) firstCertAt = firstCert.created_at;

  return res.status(200).json({
    handle: profile.public_handle,
    platform: profile.handle_platform,
    slug,
    cert_count: count || 0,
    member_since: firstCertAt || profile.handle_claimed_at,
  });
}
