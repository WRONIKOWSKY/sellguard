import crypto from "crypto";
import { withAuth } from "../../lib/withAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { signHmac } from "../../lib/certUtils";
import { createOtsProof } from "../../lib/opentimestamps";

// POST /api/upload — finalisation d'un upload (auth + quota)
//
// Le binaire de la vidéo n'est PLUS envoyé via cet endpoint (la limite Vercel
// Hobby à 4.5 MB le rendait impossible pour les vidéos > quelques secondes).
// Nouveau flow :
//   1. Client appelle /api/upload-init → reçoit cert_id + signed upload URL
//   2. Client uploade la vidéo direct dans Supabase Storage via cette URL
//   3. Client appelle ce endpoint /api/upload avec le video_path + métadonnées
//   4. Ce endpoint fetch la vidéo depuis Storage, la hash, signe, insère en DB
//
// Body JSON: { video_path, article, order_ref, tracking_number,
//              tracking_carrier, device_info }
// Réponses :
//   201 { cert_id, hash, timestamp, signature } — succès
//   400 — payload invalide / vidéo introuvable
//   401 — pas authentifié (géré par withAuth)
//   429 — quota journalier dépassé (géré par withAuth)
//   500 — erreur serveur

export const config = {
  api: {
    // On ne reçoit que des métadonnées JSON, pas de binaire. 100kb suffit large.
    bodyParser: { sizeLimit: "100kb" },
  },
};

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const userId = req.user.id; // injecté par withAuth

  const body = req.body || {};
  const videoPath = body.video_path;

  // 1. Valider video_path : doit être ${userId}/SC-XXXXXXXX.{mp4|mov|webm}
  //    Empêche un user d'attribuer à son cert le path d'un autre user.
  if (typeof videoPath !== "string" || !videoPath.startsWith(userId + "/")) {
    return res.status(400).json({ error: "video_path invalide ou volé" });
  }
  const filename = videoPath.substring(userId.length + 1);
  const m = filename.match(/^(SC-[A-Z0-9]{8})\.(mp4|mov|webm)$/);
  if (!m) {
    return res.status(400).json({ error: "video_path malformé" });
  }
  const certId = m[1];
  const ext = m[2];
  const mimeType = ext === "mp4" ? "video/mp4"
    : ext === "mov" ? "video/quicktime"
    : "video/webm";

  // 2. Tronquer les métadonnées
  const article = String(body.article || "").substring(0, 200);
  const orderRef = String(body.order_ref || "").substring(0, 100);
  const trackingNumber = String(body.tracking_number || "").substring(0, 100);
  const trackingCarrier = String(body.tracking_carrier || "").substring(0, 50);
  const deviceInfo = String(body.device_info || "").substring(0, 200);

  const supa = getSupabaseAdmin();

  // 3. Fetch la vidéo depuis Supabase Storage
  let buffer;
  try {
    const { data: blob, error: dlErr } = await supa.storage
      .from("protection-videos")
      .download(videoPath);
    if (dlErr || !blob) {
      console.error("[upload] download error:", dlErr);
      return res.status(400).json({ error: "Vidéo introuvable. As-tu fini l'upload ?" });
    }
    const arrayBuffer = await blob.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } catch (e) {
    console.error("[upload] fetch error:", e);
    return res.status(500).json({ error: "Erreur lecture vidéo" });
  }

  // 4. Hash SHA-256
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");

  // 5. Timestamp + signature HMAC
  const timestamp = new Date().toISOString();
  let signature;
  try {
    signature = signHmac(hash, timestamp);
  } catch (e) {
    console.error("[upload] HMAC error:", e);
    return res.status(500).json({ error: "Server signing error" });
  }

  // 6. Insert DB
  //    On passe explicitement created_at = timestamp pour que la valeur stockée
  //    matche EXACTEMENT la valeur signée. Sinon Postgres remplirait avec now()
  //    qui peut différer de quelques ms du timestamp Node.
  const { error: dbErr } = await supa.from("certificats").insert({
    user_id: userId,
    cert_id: certId,
    article: article || null,
    order_ref: orderRef || null,
    tracking_number: trackingNumber || null,
    tracking_carrier: trackingCarrier || null,
    video_path: videoPath,
    video_size_bytes: buffer.length,
    video_hash: hash,
    video_mimetype: mimeType,
    tsa_token: signature, // phase MVP : HMAC. Phase v1.1 : RFC 3161 token.
    tsa_provider: "sellcov-hmac-v1",
    device_info: deviceInfo || null,
    created_at: timestamp,
  });
  if (dbErr) {
    console.error("[upload] DB insert error:", dbErr);
    // Rollback : supprimer la vidéo qu'on vient d'uploader
    await supa.storage.from("protection-videos").remove([videoPath]);
    return res.status(500).json({ error: "Database error" });
  }

  // 7. Ancrage OpenTimestamps Bitcoin (non-bloquant)
  createOtsProof(hash)
    .then(async (otsProofBase64) => {
      const { error } = await supa
        .from("certificats")
        .update({ ots_proof: otsProofBase64, ots_status: "pending_bitcoin" })
        .eq("cert_id", certId);
      if (error) console.error("[upload] OTS proof DB update error:", error);
    })
    .catch((e) => {
      console.error("[upload] OTS stamp failed (non-fatal):", e.message);
    });

  // 8. OK
  return res.status(201).json({
    cert_id: certId,
    hash,
    timestamp,
    signature,
  });
}

export default withAuth(handler, { endpoint: "upload", dailyLimit: 50 });
