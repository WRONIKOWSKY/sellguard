// SellCov · OpenTimestamps upgrade cron
//
// Tente d'upgrader tous les proofs "pending_bitcoin" >2h en proofs
// "bitcoin_confirmed" (avec attestation Bitcoin définitive). Idempotent.
//
// Sécurité : protégé par un secret partagé OTS_UPGRADE_SECRET.
// Appelé par un Vercel Cron Job ou n8n / outil externe une fois par jour.
//
// GET /api/ots-upgrade
//   Header: x-cron-secret: <OTS_UPGRADE_SECRET>
//   Réponse: { processed: N, upgraded: M, errors: [...] }

import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { upgradeOtsProof } from "../../lib/opentimestamps";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const expected = process.env.OTS_UPGRADE_SECRET;
  if (!expected) return res.status(500).json({ error: "OTS_UPGRADE_SECRET not configured" });
  const provided = req.headers["x-cron-secret"];
  if (provided !== expected) return res.status(401).json({ error: "Unauthorized" });

  const supa = getSupabaseAdmin();

  // Récupérer les certificats pending depuis >2h (le temps qu'un bloc Bitcoin
  // soit miné et que les serveurs OpenTimestamps aient propagé l'attestation).
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const { data: rows, error: selErr } = await supa
    .from("certificats")
    .select("cert_id, ots_proof")
    .eq("ots_status", "pending_bitcoin")
    .lte("created_at", twoHoursAgo)
    .limit(50); // batch raisonnable pour rester sous les timeouts Vercel
  if (selErr) {
    console.error("[ots-upgrade] select error:", selErr);
    return res.status(500).json({ error: "DB select failed" });
  }

  let upgraded = 0;
  const errors = [];
  for (const row of rows || []) {
    try {
      const { upgraded: ok, proofBase64 } = await upgradeOtsProof(row.ots_proof);
      if (ok) {
        const { error: updErr } = await supa
          .from("certificats")
          .update({ ots_proof: proofBase64, ots_status: "bitcoin_confirmed" })
          .eq("cert_id", row.cert_id);
        if (updErr) {
          errors.push({ cert_id: row.cert_id, error: updErr.message });
        } else {
          upgraded++;
        }
      }
    } catch (e) {
      errors.push({ cert_id: row.cert_id, error: e.message });
    }
  }

  return res.status(200).json({
    processed: rows?.length || 0,
    upgraded,
    errors,
  });
}
