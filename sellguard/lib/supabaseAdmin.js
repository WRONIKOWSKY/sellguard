import { createClient } from "@supabase/supabase-js";

// Client Supabase serveur uniquement.
// Utilise SUPABASE_SERVICE_ROLE_KEY (clé secrète, jamais exposée au front).
// Permet de bypasser RLS et d'écrire dans des tables internes (ex: usage_anthropic).
// NE JAMAIS importer ce fichier depuis pages/ ou components/ (front bundle).

let cachedAdmin = null;

export function getSupabaseAdmin() {
  if (cachedAdmin) return cachedAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase server env vars (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)");
  }

  cachedAdmin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return cachedAdmin;
}
