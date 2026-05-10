// Rate limiter par IP basé sur Upstash Redis REST.
// Fixed window : INCR + EXPIRE atomiques via pipeline REST.
//
// Usage dans une route API :
//   import { rateLimit, getClientIp } from "../../lib/rateLimit";
//   ...
//   const rl = await rateLimit(req, { name: "verify", limit: 30, windowSec: 60 });
//   if (!rl.ok) {
//     res.setHeader("Retry-After", rl.retryAfter);
//     return res.status(429).json({ error: "Too many requests", retryAfter: rl.retryAfter });
//   }
//
// Comportement si UPSTASH_REDIS_REST_URL/_TOKEN absents :
//   warning console une fois, et on laisse passer (fail-open) pour ne pas
//   bloquer le dev local. En prod sur Vercel les env vars doivent être setées.

const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let warned = false;
function warnOnce() {
  if (warned) return;
  warned = true;
  console.warn("[rateLimit] UPSTASH_REDIS_REST_URL/_TOKEN absents — rate limiting désactivé (fail-open).");
}

export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    // Premier IP de la chaîne (le client réel ; Vercel ajoute son IP en bout)
    return xff.split(",")[0].trim();
  }
  const xri = req.headers["x-real-ip"];
  if (typeof xri === "string" && xri.length > 0) return xri.trim();
  return req.socket?.remoteAddress || "unknown";
}

export async function rateLimit(req, opts) {
  const name = opts?.name || "default";
  const limit = opts?.limit ?? 30;
  const windowSec = opts?.windowSec ?? 60;
  const ip = getClientIp(req);

  if (!URL || !TOKEN) {
    warnOnce();
    return { ok: true, count: 0, limit, retryAfter: 0, ip, disabled: true };
  }

  const key = `rl:${name}:${ip}`;

  try {
    // Pipeline REST : [INCR key], [EXPIRE key windowSec NX]
    // NX sur EXPIRE = ne pose le TTL que si la clé n'en a pas déjà un (= 1ʳᵉ requête de la fenêtre)
    const resp = await fetch(`${URL}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(windowSec), "NX"],
      ]),
    });

    if (!resp.ok) {
      console.error("[rateLimit] Upstash HTTP", resp.status);
      return { ok: true, count: 0, limit, retryAfter: 0, ip, disabled: true };
    }

    const data = await resp.json();
    // data = [ { result: <count> }, { result: 0|1 } ]
    const count = Number(data?.[0]?.result ?? 0);

    if (count > limit) {
      return { ok: false, count, limit, retryAfter: windowSec, ip, disabled: false };
    }
    return { ok: true, count, limit, retryAfter: 0, ip, disabled: false };
  } catch (e) {
    console.error("[rateLimit] error:", e?.message || e);
    // Fail-open : on ne bloque pas l'utilisateur si Redis est down
    return { ok: true, count: 0, limit, retryAfter: 0, ip, disabled: true };
  }
}
