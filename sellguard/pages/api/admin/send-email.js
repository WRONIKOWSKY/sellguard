import { requireAdmin } from "../../../lib/adminAuth";
import { getSupabaseAdmin } from "../../../lib/supabaseAdmin";
import { TEMPLATES, renderTemplate } from "../../../lib/outreachTemplates";

// POST /api/admin/send-email
// Body : { leadId, kind (initial|j3|j7), subject?, body?, dryRun? }
//
// 1. Récupère le lead
// 2. Compose le mail depuis le template (ou utilise subject/body si fournis)
// 3. Envoie via Resend
// 4. Log dans lead_messages + maj status sur lead

const STATUS_BY_KIND = {
  initial: "sent_j0",
  j3: "sent_j3",
  j7: "sent_j7",
};

export default async function handler(req, res) {
  const user = await requireAdmin(req, res);
  if (!user) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const leadId = body.leadId;
  const kind = body.kind || "initial";
  const dryRun = !!body.dryRun;

  if (!leadId) return res.status(400).json({ error: "leadId requis" });
  if (!TEMPLATES[kind]) return res.status(400).json({ error: "kind invalide" });

  const supa = getSupabaseAdmin();
  const { data: lead, error: leadErr } = await supa
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (leadErr || !lead) {
    return res.status(404).json({ error: "Lead introuvable" });
  }
  if (!lead.email) {
    return res.status(400).json({ error: "Lead sans email — impossible d'envoyer" });
  }

  const platformLabels = {
    vinted_pro: "Vinted Pro",
    depop: "Depop",
    grailed: "Grailed",
    vestiaire: "Vestiaire Collective",
    etsy: "Etsy",
    autre: "ta plateforme",
  };

  const vars = {
    firstName: lead.first_name || "",
    handle: lead.handle.startsWith("@") ? lead.handle : "@" + lead.handle,
    platform: platformLabels[lead.platform] || "ta plateforme",
    personalHook: lead.raw_notes || "",
  };

  let subject = typeof body.subject === "string" && body.subject.trim()
    ? body.subject.trim()
    : null;
  let mailBody = typeof body.body === "string" && body.body.trim()
    ? body.body.trim()
    : null;

  if (!subject || !mailBody) {
    const rendered = renderTemplate(TEMPLATES[kind], vars);
    subject = subject || rendered.subject;
    mailBody = mailBody || rendered.body;
  }

  if (dryRun) {
    return res.status(200).json({ preview: { subject, body: mailBody }, lead });
  }

  // Envoi via Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "RESEND_API_KEY non configurée" });
  }
  const from = process.env.OUTREACH_FROM_EMAIL || process.env.NOTIFY_FROM_EMAIL || "Thomas (SellCov) <onboarding@resend.dev>";
  const replyTo = process.env.OUTREACH_REPLY_TO || "neaume.contact@gmail.com";

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: lead.email,
      reply_to: replyTo,
      subject,
      text: mailBody,
    }),
  });

  const resendJson = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    console.error("[admin/send-email] Resend failed:", resp.status, resendJson);
    return res.status(502).json({
      error: "Échec envoi Resend",
      detail: resendJson,
    });
  }

  const nowIso = new Date().toISOString();
  const j3Due = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const j7Due = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const patch = {
    last_subject: subject,
    last_body: mailBody,
    sent_at: nowIso,
    status: STATUS_BY_KIND[kind] || lead.status,
  };
  if (kind === "initial") {
    patch.followup_j3_due = j3Due;
    patch.followup_j7_due = j7Due;
  } else if (kind === "j3") {
    patch.followup_j3_due = null;
  } else if (kind === "j7") {
    patch.followup_j7_due = null;
  }

  const { error: updErr } = await supa.from("leads").update(patch).eq("id", leadId);
  if (updErr) {
    console.error("[admin/send-email] lead update error:", updErr);
  }

  await supa.from("lead_messages").insert({
    lead_id: leadId,
    kind,
    subject,
    body: mailBody,
    resend_id: resendJson.id || null,
  });

  return res.status(200).json({
    ok: true,
    resend_id: resendJson.id || null,
    lead_id: leadId,
    kind,
  });
}
