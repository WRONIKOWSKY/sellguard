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
// Notification :
// - envoi d'un email à NOTIFY_EMAIL via Resend après insert réussi
// - non bloquant : si Resend foire, la candidature reste enregistrée

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_PLATFORMS = ["depop", "etsy", "vinted_pro", "grailed", "vestiaire", "autre"];
const ALLOWED_VOLUMES = ["v30_50", "v50_100", "v100_plus"];
const MAX_HANDLE = 80;
const MAX_NOTE = 500;
const MAX_EMAIL = 200;

const VOLUME_LABELS = {
  v30_50: "30 à 50 ventes / mois",
  v50_100: "50 à 100 ventes / mois",
  v100_plus: "100 ventes et plus / mois",
};

const PLATFORM_LABELS = {
  depop: "Depop",
  etsy: "Etsy",
  vinted_pro: "Vinted Pro",
  grailed: "Grailed",
  vestiaire: "Vestiaire Collective",
  autre: "Autre",
};

async function notifyByEmail({ email, handle, platform, volume, note, ip }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[pro-application] RESEND_API_KEY non configurée, email non envoyé");
    return;
  }

  const to = process.env.NOTIFY_EMAIL || "neaume.contact@gmail.com";
  const from = process.env.NOTIFY_FROM_EMAIL || "SellCov <onboarding@resend.dev>";

  const subject = `Nouvelle candidature — ${handle}`;

  const lines = [
    `Nouvelle candidature reçue sur sellcov.fr.`,
    ``,
    `Email      : ${email}`,
    `Handle     : ${handle}`,
    `Plateforme : ${PLATFORM_LABELS[platform] || platform}`,
    `Volume     : ${VOLUME_LABELS[volume] || volume}`,
    `IP         : ${ip || "—"}`,
  ];
  if (note) {
    lines.push(``, `Note :`, note);
  }
  lines.push(``, `À retrouver dans la table Supabase pro_applications.`);
  const text = lines.join("\n");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#111;line-height:1.6;max-width:520px">
      <h2 style="margin:0 0 16px;font-size:18px">Nouvelle candidature SellCov</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:6px 0;color:#666;width:120px">Email</td><td style="padding:6px 0"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:6px 0;color:#666">Handle</td><td style="padding:6px 0;font-weight:600">${handle}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Plateforme</td><td style="padding:6px 0">${PLATFORM_LABELS[platform] || platform}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Volume</td><td style="padding:6px 0">${VOLUME_LABELS[volume] || volume}</td></tr>
        <tr><td style="padding:6px 0;color:#666;vertical-align:top">IP</td><td style="padding:6px 0;color:#999;font-family:monospace;font-size:12px">${ip || "—"}</td></tr>
      </table>
      ${note ? `<div style="margin-top:18px;padding:14px 16px;background:#f8f7f3;border-left:3px solid #1f9f5f;border-radius:4px"><div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:6px">Note du candidat</div><div style="font-size:14px;white-space:pre-wrap">${escapeHtml(note)}</div></div>` : ""}
    </div>
  `;

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    console.error("[pro-application] Resend failed:", resp.status, errText);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

  const ip = getClientIp(req);
  const supa = getSupabaseAdmin();
  const { error } = await supa.from("pro_applications").insert({
    email,
    handle,
    platform,
    monthly_volume: volume,
    note: note || null,
    ip_address: ip,
    user_agent: (req.headers["user-agent"] || "").substring(0, 300),
  });

  if (error) {
    console.error("[pro-application] insert error:", error);
    return res.status(500).json({ error: "Erreur enregistrement, réessaie." });
  }

  try {
    await notifyByEmail({ email, handle, platform, volume, note, ip });
  } catch (e) {
    console.error("[pro-application] notify error:", e);
  }

  return res.status(201).json({ ok: true });
}
