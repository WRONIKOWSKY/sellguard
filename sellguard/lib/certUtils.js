import crypto from "crypto";

// Helpers cryptographiques pour les certificats de protection.
// Phase MVP : signature HMAC SHA-256 du couple (hash + timestamp)
// Phase v1.1 : sera remplacé par RFC 3161 timestamping via FreeTSA

// Génère un cert_id public au format SC-XXXXXXXX (8 caractères alphanumériques)
// Probabilité de collision négligeable pour les volumes attendus
export function generateCertId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans 0, O, I, 1 pour éviter confusion
  const bytes = crypto.randomBytes(8);
  let id = "SC-";
  for (let i = 0; i < 8; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}

// Signe un couple (hash, timestamp) avec la clé HMAC serveur.
// Rend la combinaison non falsifiable côté client : seul le serveur peut
// produire une signature valide pour un (hash, timestamp) donné.
export function signHmac(hash, timestamp) {
  const secret = process.env.SELLCOV_HMAC_SECRET;
  if (!secret) {
    throw new Error("Missing env SELLCOV_HMAC_SECRET");
  }
  const payload = hash + "|" + timestamp;
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

// Vérifie qu'une signature HMAC correspond bien à un couple (hash, timestamp).
// Retourne true si la signature est authentique, false sinon.
// Utilise crypto.timingSafeEqual pour éviter les attaques timing.
export function verifyHmac(hash, timestamp, signature) {
  try {
    const expected = signHmac(hash, timestamp);
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch (e) {
    return false;
  }
}
