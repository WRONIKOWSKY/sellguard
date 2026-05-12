// SellCov · OpenTimestamps upgrade cron
//
// Tente d'upgrader tous les proofs "pending_bitcoin" >2h en proofs
// "bitcoin_confirmed" (avec attestation Bitcoin définitive). Idempotent.
//
// Configuré comme Vercel Cron Job dans vercel.json (1×/jour à 03:00 UTC).
// Vercel envoie automatiquement: Authorization: Bearer ${CRON_SECRET}
// quand l'env var CRON_SECRET est définie sur le projet.
//
// Deux méthodes d'auth acceptées (au choix) :
//   - Authorization: Bearer <CRON_SECRET>      (utilisé par Vercel Cron)
//   - x-cron-secret: <OTS_UPGRADE_SECRET>       (compat manuel / n8n)
//
// GET /api/ots-upgrade
//   Réponse: { processed: N, upgraded: M, errors: [...] }

import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { upgradeOtsProof, createOtsProof } from "../../lib/opentimestamps";

const MAX_CREATE_ATTEMPTS = 5;
const RETRY_BATCH_SIZE = 30;

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cronSecret = process.env.CRON_SECRET;
  const otsSecret = process.env.OTS_UPGRADE_SECRET;
  if (!cronSecret && !otsSecret) {
    return res.status(500).json({ error: "No cron secret configured (set CRON_SECRET or OTS_UPGRADE_SECRET)" });
  }

  const authHeader = req.headers.authorization || "";
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const bearerToken = bearerMatch ? bearerMatch[1] : null;
  const headerSecret = req.headers["x-cron-secret"];

  const isAuthorized =
    (cronSecret && bearerToken === cronSecret) ||
    (otsSecret && headerSecret === otsSecret) ||
    (otsSecret && bearerToken === otsSecret);

  if (!isAuthorized) return res.status(401).json({ error: "Unauthorized" });

  const supa = getSupabaseAdmin();
  const errors = [];

  // ───── Phase A : retry de création pour les proofs jamais créés ─────
  // Cible : certs avec ots_proof NULL et ots_attempts < MAX_CREATE_ATTEMPTS.
  // On utilise le video_hash déjà stocké en DB pour rappeler createOtsProof.
  const retryAttemptAt = new Date().toISOString();
  const { data: failedRows, error: failedSelErr } = await supa
    .from("certificats")
    .select("cert_id, video_hash, ots_attempts")
    .is("ots_proof", null)
    .lt("ots_attempts", MAX_CREATE_ATTEMPTS)
    .limit(RETRY_BATCH_SIZE);

  let createRetried = 0;
  let createRecovered = 0;
  let createAbandoned = 0;
  if (failedSelErr) {
    console.error("[ots-upgrade] failed-select error:", failedSelErr);
    errors.push({ phase: "retry-select", error: failedSelErr.message });
  } else {
    for (const row of failedRows || []) {
      createRetried++;
      const nextAttempts = (row.ots_attempts || 0) + 1;
      try {
        const otsProofBase64 = await createOtsProof(row.video_hash);
        const { error: updErr } = await supa
          .from("certificats")
          .update({
            ots_proof: otsProofBase64,
            ots_status: "pending_bitcoin",
            ots_attempts: nextAttempts,
            last_ots_attempt_at: retryAttemptAt,
          })
          .eq("cert_id", row.cert_id);
        if (updErr) {
          errors.push({ cert_id: row.cert_id, phase: "retry-update", error: updErr.message });
        } else {
          createRecovered++;
        }
      } catch (e) {
        // Échec persistant : on incrémente attempts, on marque abandoned si on a atteint MAX.
        const newStatus = nextAttempts >= MAX_CREATE_ATTEMPTS ? "create_abandoned" : "create_failed";
        if (newStatus === "create_abandoned") createAbandoned++;
        await supa
          .from("certificats")
          .update({
            ots_status: newStatus,
            ots_attempts: nextAttempts,
            last_ots_attempt_at: retryAttemptAt,
          })
          .eq("cert_id", row.cert_id);
        errors.push({ cert_id: row.cert_id, phase: "retry-create", error: e.message, attempts: nextAttempts });
      }
    }
  }

  // ───── Phase B : upgrade pending_bitcoin → bitcoin_confirmed ─────
  // Cible : proofs créés depuis >2h, le temps qu'un bloc Bitcoin soit miné
  // et que les Calendars OpenTimestamps aient propagé l'attestation.
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const { data: rows, error: selErr } = await supa
    .from("certificats")
    .select("cert_id, ots_proof")
    .eq("ots_status", "pending_bitcoin")
    .lte("created_at", twoHoursAgo)
    .limit(50);
  if (selErr) {
    console.error("[ots-upgrade] select error:", selErr);
    errors.push({ phase: "upgrade-select", error: selErr.message });
    return res.status(500).json({
      error: "DB select failed",
      retry: { retried: createRetried, recovered: createRecovered, abandoned: createAbandoned },
      errors,
    });
  }

  let upgraded = 0;
  for (const row of rows || []) {
    try {
      const { upgraded: ok, proofBase64 } = await upgradeOtsProof(row.ots_proof);
      if (ok) {
        const { error: updErr } = await supa
          .from("certificats")
          .update({ ots_proof: proofBase64, ots_status: "bitcoin_confirmed" })
          .eq("cert_id", row.cert_id);
        if (updErr) {
          errors.push({ cert_id: row.cert_id, phase: "upgrade-update", error: updErr.message });
        } else {
          upgraded++;
        }
      }
    } catch (e) {
      errors.push({ cert_id: row.cert_id, phase: "upgrade", error: e.message });
    }
  }

  return res.status(200).json({
    retry: {
      retried: createRetried,
      recovered: createRecovered,
      abandoned: createAbandoned,
    },
    upgrade: {
      processed: rows?.length || 0,
      upgraded,
    },
    errors,
  });
}
