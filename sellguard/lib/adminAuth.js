import { getSupabaseAdmin } from "./supabaseAdmin";

// Helper pour les endpoints /api/admin/* : valide qu'un Bearer JWT Supabase
// provient bien d'un user de tier `admin`. Sinon renvoie 401/403 directement
// et retourne null (le handler doit faire `if (!user) return;`).
export async function requireAdmin(req, res) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    res.status(401).json({ error: "Authorization Bearer token manquant" });
    return null;
  }
  const jwt = match[1];

  const supa = getSupabaseAdmin();
  let user;
  try {
    const { data, error } = await supa.auth.getUser(jwt);
    if (error || !data || !data.user) {
      res.status(401).json({ error: "Token invalide ou expiré" });
      return null;
    }
    user = data.user;
  } catch (e) {
    res.status(401).json({ error: "Échec validation token" });
    return null;
  }

  const tier = user.app_metadata?.tier;
  if (tier !== "admin") {
    res.status(403).json({ error: "Accès admin uniquement" });
    return null;
  }

  return user;
}
