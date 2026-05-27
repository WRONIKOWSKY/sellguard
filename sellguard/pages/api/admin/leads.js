import { requireAdmin } from "../../../lib/adminAuth";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";

const VALID_PLATFORMS = ["vinted_pro", "depop", "grailed", "vestiaire", "etsy", "autre"];
const VALID_STATUS = ["todo", "sent_j0", "sent_j3", "sent_j7", "replied", "visio_booked", "founder", "lost"];

export default async function handler(req, res) {
  const user = await requireAdmin(req, res);
  if (!user) return;

  const supa = getSupabaseAdmin();

  if (req.method === "GET") {
    const { data, error } = await supa
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[admin/leads] list error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ leads: data || [] });
  }

  if (req.method === "POST") {
    const body = req.body || {};
    const handle = typeof body.handle === "string" ? body.handle.trim() : "";
    const platform = typeof body.platform === "string" ? body.platform.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const first_name = typeof body.first_name === "string" ? body.first_name.trim() : "";
    const raw_notes = typeof body.raw_notes === "string" ? body.raw_notes.trim() : "";

    if (!handle) return res.status(400).json({ error: "handle requis" });
    if (platform && !VALID_PLATFORMS.includes(platform)) {
      return res.status(400).json({ error: "platform invalide" });
    }

    const { data, error } = await supa
      .from("leads")
      .insert({
        handle,
        platform: platform || null,
        email: email || null,
        first_name: first_name || null,
        raw_notes: raw_notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("[admin/leads] insert error:", error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ lead: data });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}

export { VALID_PLATFORMS, VALID_STATUS };
