import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { rateLimit, getClientIp } from "../../lib/rateLimit";

// POST /api/pro-application
// Endpoint public (pas d'auth) pour collecter les candidatures à l'accès Pro
// pendant la bêta privée. Insert dans public.pro_applications (service_role).
//
// Sécu :
// - rate limit 5/min par IP (anti-spam basique)
// - validation stricte des champs (longueurs max, enum platform/volume)
// - validation email regex (pas full RFC mais suffisant)
// - on stocke l'IP et le user-agent pour audit
//
// Body JSON :
//   { email, handle, platform, monthly_volume, note? }
//
// Réponses :
//   201 { ok: true }       — candidature enregistrée
//   400                     — payload invalide
//   429                     — trop de requêtes
//   500                     — erreur DB

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_PLATFORMS = ["depop", "etsy", "vinted_pro", "grailed", "vestiaire", "autre"];
const ALLOWED_VOLUMES = ["50_100", "100_500", "500_plus"];
const MAX_HANDLE = 80;
const MAX_NOTE = 500;
const MAX_EMAIL = 200;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const rl = await rateLimit(req, { name: "pro-application", limit: 5, windowSec: 60 });
  if (!rl.ok) {
    res.setHeader("Retry-After", rl.retryAfter);
    return res.status(429).json({ error: "Trop de tentatives, réessaie dans une minute." });
  }

  const body = req.body || {};
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const handle = typeof body.handle === "string" ? body.handle.trim() : "";
  const platform = typeof body.platform === "string" ? body.platform.trim() : "";
  const volume = typeof body.monthly_volume === "string" ? body.monthly_volume.trim() : "";
  const note = typeof body.note === "string" ? body.note.trim().substring(0, MAX_NOTE) : "";

  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Email invalide." });
  }
  if (!handle || handle.length > MAX_HANDLE) {
    return res.status(400).json({ error: "Handle invalide (Instagram, Discord ou Twitter requis)." });
  }
  if (!ALLOWED_PLATFORMS.includes(platform)) {
    return res.status(400).json({ error: "Plateforme invalide." });
  }
  if (!ALLOWED_VOLUMES.includes(volume)) {
    return res.status(400).json({ error: "Volume invalide." });
  }

  const supa = getSupabaseAdmin();
  const { error } = await supa.from("pro_applications").insert({
    email,
    handle,
    platform,
    monthly_volume: volume,
    note: note || null,
    ip_address: getClientIp(req),
    user_agent: (req.headers["user-agent"] || "").substring(0, 300),
  });

  if (error) {
    console.error("[pro-application] insert error:", error);
    return res.status(500).json({ error: "Erreur enregistrement, réessaie." });
  }

  return res.status(201).json({ ok: true });
}
