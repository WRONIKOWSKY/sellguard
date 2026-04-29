import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { verifyHmac } from "../../../lib/certUtils";

// GET /api/verify/[certId]
// PUBLIC — pas d'authentification. C'est l'endpoint que n'importe qui peut
// consulter pour vérifier l'authenticité d'un certificat. C'est ce qui rend
// la preuve "vérifiable par un tiers" au lieu d'un PDF cosmétique.
//
// Retourne :
//   - les métadonnées du cert (article, tracking, hash, timestamp, ...)
//   - une signed URL temporaire (1h) pour télécharger la vidéo originale
//   - le résultat de la vérification HMAC (signature_valid: true/false)
//
// Erreurs :
//   400 — cert_id invalide
//   404 — cert introuvable
//   500 — erreur serveur

export default async function handler(req, res) {
  const { certId } = req.query;

  if (!certId || typeof certId !== "string" || !/^SC-[A-Z0-9]{8}$/.test(certId)) {
    return res.status(400).json({ error: "Invalid cert_id format" });
  }

  const supa = getSupabaseAdmin();

  // 1. Lookup cert dans la DB (service_role bypass RLS)
  const { data: cert, error } = await supa
    .from("certificats")
    .select("cert_id, article, order_ref, tracking_number, tracking_carrier, video_path, video_size_bytes, video_hash, tsa_token, tsa_provider, created_at")
    .eq("cert_id", certId)
    .single();

  if (error || !cert) {
    return res.status(404).json({ error: "Certificat introuvable" });
  }

  // 2. Re-vérifier la signature HMAC : prouve que le cert n'a pas été altéré en DB
  //    après création (ex: si quelqu'un avait accès direct à la DB et changeait le hash)
  const signatureValid = verifyHmac(cert.video_hash, cert.created_at, cert.tsa_token);

  // 3. Générer signed URL pour la vidéo (valide 1h)
  let videoUrl = null;
  try {
    const { data: signed, error: signedErr } = await supa.storage
      .from("protection-videos")
      .createSignedUrl(cert.video_path, 3600); // 1h
    if (!signedErr && signed) {
      videoUrl = signed.signedUrl;
    }
  } catch (e) {
    console.error("[verify] signed URL error:", e);
  }

  // 4. Renvoyer les métadonnées (sans exposer user_id, video_path interne)
  return res.status(200).json({
    cert_id: cert.cert_id,
    article: cert.article,
    order_ref: cert.order_ref,
    tracking_number: cert.tracking_number,
    tracking_carrier: cert.tracking_carrier,
    video_size_bytes: cert.video_size_bytes,
    video_hash: cert.video_hash,
    timestamp: cert.created_at,
    signature: cert.tsa_token,
    signature_provider: cert.tsa_provider,
    signature_valid: signatureValid,
    video_url: videoUrl, // null si erreur, sinon URL signée valide 1h
  });
}
