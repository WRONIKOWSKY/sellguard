import formidable from "formidable";
import fs from "fs";
import crypto from "crypto";
import { withAuth } from "../../lib/withAuth";
import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { generateCertId, signHmac } from "../../lib/certUtils";

export const config = {
  api: {
    bodyParser: false, // formidable parse le multipart, pas Next.js
  },
};

// POST /api/upload (auth requis)
// Reçoit en multipart : video (Blob), article (string), order_ref (string),
// tracking_number (string), tracking_carrier (string), device_info (string)
// Réponses :
//   201 { cert_id, hash, timestamp, signature } — succès
//   400 — payload invalide
//   401 — pas authentifié (géré par withAuth)
//   500 — erreur serveur
async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const userId = req.user.id; // injecté par withAuth

  // 1. Parser le multipart
  const form = formidable({ maxFileSize: 50 * 1024 * 1024 }); // 50 MB max (cohérent avec le bucket)
  let fields, files;
  try {
    [fields, files] = await form.parse(req);
  } catch (e) {
    console.error("[upload] formidable parse error:", e);
    return res.status(400).json({ error: "Upload error" });
  }

  const file = files.video?.[0];
  if (!file) return res.status(400).json({ error: "Missing video file" });

  const article = (fields.article?.[0] || "").substring(0, 200);
  const orderRef = (fields.order_ref?.[0] || "").substring(0, 100);
  const trackingNumber = (fields.tracking_number?.[0] || "").substring(0, 100);
  const trackingCarrier = (fields.tracking_carrier?.[0] || "").substring(0, 50);
  const deviceInfo = (fields.device_info?.[0] || "").substring(0, 200);

  // 2. Lire le fichier en buffer + calculer hash
  let buffer;
  try {
    buffer = fs.readFileSync(file.filepath);
  } catch (e) {
    return res.status(500).json({ error: "Cannot read uploaded file" });
  }
  const hash = crypto.createHash("sha256").update(buffer).digest("hex");

  // 3. Générer cert_id, timestamp, signature HMAC
  const certId = generateCertId();
  const timestamp = new Date().toISOString();
  let signature;
  try {
    signature = signHmac(hash, timestamp);
  } catch (e) {
    console.error("[upload] HMAC error:", e);
    return res.status(500).json({ error: "Server signing error" });
  }

  // 4. Upload vidéo dans Supabase Storage
  //    Path = userId/certId.webm — RLS policies le permettent uniquement pour le user owner
  const supa = getSupabaseAdmin();
  const path = `${userId}/${certId}.webm`;
  const { error: uploadErr } = await supa.storage
    .from("protection-videos")
    .upload(path, buffer, {
      contentType: file.mimetype || "video/webm",
      upsert: false,
    });
  if (uploadErr) {
    console.error("[upload] Storage upload error:", uploadErr);
    return res.status(500).json({ error: "Storage upload failed" });
  }

  // 5. Insert DB
  const { error: dbErr } = await supa.from("certificats").insert({
    user_id: userId,
    cert_id: certId,
    article: article || null,
    order_ref: orderRef || null,
    tracking_number: trackingNumber || null,
    tracking_carrier: trackingCarrier || null,
    video_path: path,
    video_size_bytes: buffer.length,
    video_hash: hash,
    tsa_token: signature, // phase MVP : HMAC. Phase v1.1 : RFC 3161 token.
    tsa_provider: "sellcov-hmac-v1",
    device_info: deviceInfo || null,
  });
  if (dbErr) {
    console.error("[upload] DB insert error:", dbErr);
    // rollback : supprimer la vidéo qu'on vient d'uploader
    await supa.storage.from("protection-videos").remove([path]);
    return res.status(500).json({ error: "Database error" });
  }

  // 6. OK — on rend le cert au client
  return res.status(201).json({
    cert_id: certId,
    hash,
    timestamp,
    signature,
  });
}

export default withAuth(handler, { endpoint: "upload", dailyLimit: 50 });
