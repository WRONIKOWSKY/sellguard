import { getSupabaseAdmin } from "./supabaseAdmin";

// Middleware HOF pour les endpoints qui call Anthropic.
// Wrap un handler API Next.js, valide le JWT Supabase, applique le quota journalier.
//
// Usage :
//   export default withAuth(handler, { endpoint: "analyze", dailyLimit: 10 });
//
// Le handler reçoit en plus req.user (objet user Supabase) après validation.
//
// Côtés erreurs renvoyées :
//   401 — pas de token / token invalide / expiré
//   429 — quota journalier dépassé
//   500 — erreur DB (Supabase indispo)

export function withAuth(handler, opts) {
  if (!opts || !opts.endpoint) {
    throw new Error("withAuth: opts.endpoint is required");
  }
  const endpoint = opts.endpoint;
  const dailyLimit = opts.dailyLimit || 10;

  return async function wrappedHandler(req, res) {
    // 1. Extraire le bearer token
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({ error: "Authorization Bearer token manquant" });
    }
    const jwt = match[1];

    // 2. Valider le JWT via Supabase admin
    const supa = getSupabaseAdmin();
    let userId;
    try {
      const { data, error } = await supa.auth.getUser(jwt);
      if (error || !data || !data.user) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
      }
      userId = data.user.id;
      req.user = data.user;
    } catch (e) {
      return res.status(401).json({ error: "Échec validation token" });
    }

    // 3. Quota : incrément atomique via fonction Postgres
    //    La fonction increment_anthropic_usage fait l'INSERT/UPDATE atomique
    //    et retourne (new_count, allowed).
    let allowed, newCount;
    try {
      const { data, error } = await supa.rpc("increment_anthropic_usage", {
        p_user_id: userId,
        p_endpoint: endpoint,
        p_limit: dailyLimit
      });
      if (error) {
        console.error("[withAuth] RPC error:", error);
        return res.status(500).json({ error: "Erreur quota DB" });
      }
      // rpc retourne un array de rows ; notre fonction renvoie 1 row
      const row = Array.isArray(data) ? data[0] : data;
      newCount = row?.new_count;
      allowed = row?.allowed;
    } catch (e) {
      console.error("[withAuth] RPC throw:", e);
      return res.status(500).json({ error: "Erreur quota DB" });
    }

    if (!allowed) {
      return res.status(429).json({
        error: "Quota journalier dépassé",
        endpoint,
        limit: dailyLimit,
        count: newCount,
        retryAfter: "Demain (reset à 00h UTC)"
      });
    }

    // 4. OK — on appelle le handler original
    return handler(req, res);
  };
}
