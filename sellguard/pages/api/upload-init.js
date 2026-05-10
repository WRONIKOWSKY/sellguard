import { getSupabaseAdmin } from "../../lib/supabaseAdmin";
import { generateCertId } from "../../lib/certUtils";
import { rateLimit } from "../../lib/rateLimit";

// POST /api/upload-init
//
// Première étape du nouveau flow d'upload (introduit pour bypass la limite
// Vercel Hobby de 4.5 MB sur le body des requêtes serverless).
//
// 1. Auth (sans quota — la quota s'applique sur /api/upload qui finalise)
// 2. Génère cert_id + path Supabase Storage
// 3. Crée un signed upload URL Supabase (token à usage unique, court délai)
// 4. Renvoie au client de quoi uploader direct dans Supabase
//
// Body: { mime: "video/mp4" | "video/webm" | "video/quicktime" }
// Returns 200: { cert_id, video_path, upload_token }
//         401: pas authentifié
//         400: mime non supporté
//         500: erreur Supabase

const ALLOWED_MIMES = ["video/mp4", "video/webm", "video/quicktime"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rl = await rateLimit(req, { name: "upload-init", limit: 30, windowSec: 60 });
  if (!rl.ok) {
    res.setHeader("Retry-After", rl.retryAfter);
    return res.status(429).json({ error: "Trop de requêtes, réessaie dans une minute" });
  }

  // 1. Auth
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: "Bearer token manquant" });
  }
  const jwt = match[1];

  const supa = getSupabaseAdmin();
  const { data: userData, error: authErr } = await supa.auth.getUser(jwt);
  if (authErr || !userData?.user) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
  const userId = userData.user.id;

  // 2. Validate mime
  const mime = (req.body?.mime || "video/webm").toLowerCase();
  if (!ALLOWED_MIMES.includes(mime)) {
    return res.status(400).json({ error: "Mime type non supporté" });
  }
  const ext = mime.includes("mp4") ? "mp4"
    : mime.includes("quicktime") ? "mov"
    : "webm";

  // 3. Generate cert_id + path
  const certId = generateCertId();
  const videoPath = `${userId}/${certId}.${ext}`;

  // 4. Get signed upload URL from Supabase Storage
  const { data: signed, error: signedErr } = await supa.storage
    .from("protection-videos")
    .createSignedUploadUrl(videoPath);

  if (signedErr || !signed) {
    console.error("[upload-init] signed URL error:", signedErr);
    return res.status(500).json({ error: "Erreur génération URL upload" });
  }

  return res.status(200).json({
    cert_id: certId,
    video_path: videoPath,
    upload_token: signed.token,
  });
}
