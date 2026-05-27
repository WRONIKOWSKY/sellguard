import { requireAdmin } from "../../../../lib/adminAuth";
import { getSupabaseAdmin } from "../../../../lib/supabaseAdmin";
import { VALID_PLATFORMS, VALID_STATUS } from "../leads";

const ALLOWED_FIELDS = [
  "handle",
  "platform",
  "email",
  "first_name",
  "raw_notes",
  "status",
  "notes",
];

export default async function handler(req, res) {
  const user = await requireAdmin(req, res);
  if (!user) return;

  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "id requis" });

  const supa = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supa
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === "PGRST116") return res.status(404).json({ error: "lead introuvable" });
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ lead: data });
  }

  if (req.method === "PATCH") {
    const body = req.body || {};
    const patch = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in body) {
        const v = body[key];
        patch[key] = typeof v === "string" ? v.trim() : v;
      }
    }
    if (patch.platform && !VALID_PLATFORMS.includes(patch.platform)) {
      return res.status(400).json({ error: "platform invalide" });
    }
    if (patch.status && !VALID_STATUS.includes(patch.status)) {
      return res.status(400).json({ error: "status invalide" });
    }
    if (Object.keys(patch).length === 0) {
      return res.status(400).json({ error: "aucun champ à mettre à jour" });
    }

    const { data, error } = await supa
      .from("leads")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("[admin/leads/id] update error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ lead: data });
  }

  if (req.method === "DELETE") {
    const { error } = await supa.from("leads").delete().eq("id", id);
    if (error) {
      console.error("[admin/leads/id] delete error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(204).end();
  }

  res.setHeader("Allow", "GET, PATCH, DELETE");
  return res.status(405).json({ error: "Method not allowed" });
}
