// SellCov · Téléchargement public d'un proof OpenTimestamps
//
// GET /api/ots-proof/SC-XXXX
//   → renvoie le fichier .ots binaire avec Content-Type approprié
//   → permet à n'importe qui de vérifier indépendamment via :
//      - https://opentimestamps.org/ (vérifieur web)
//      - ots verify proof.ots (CLI)
//
// Pas d'auth requise : le proof est publique par nature (c'est une attestation
// de la blockchain Bitcoin). Connaître un cert_id ne donne aucun pouvoir
// d'attaque, juste la possibilité de vérifier l'authenticité.

import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const certId = (req.query.certId || "").toString().toUpperCase();
  if (!/^SC-[A-Z0-9-]{6,32}$/.test(certId)) {
    return res.status(400).json({ error: "Invalid cert_id format" });
  }

  const supa = getSupabaseAdmin();
  const { data, error } = await supa
    .from("certificats")
    .select("ots_proof, ots_status")
    .eq("cert_id", certId)
    .maybeSingle();

  if (error) {
    console.error("[ots-proof] DB error:", error);
    return res.status(500).json({ error: "Database error" });
  }
  if (!data || !data.ots_proof) {
    return res.status(404).json({ error: "Proof not available yet (still being anchored)" });
  }

  const proofBytes = Buffer.from(data.ots_proof, "base64");
  res.setHeader("Content-Type", "application/vnd.opentimestamps.ots");
  res.setHeader("Content-Disposition", `attachment; filename="${certId}.ots"`);
  res.setHeader("X-OTS-Status", data.ots_status || "unknown");
  return res.status(200).send(proofBytes);
}
