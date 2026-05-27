import Head from "next/head";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "../lib/supabaseClient";

const PLATFORM_OPTIONS = [
  { value: "vinted_pro", label: "Vinted Pro" },
  { value: "depop", label: "Depop" },
  { value: "grailed", label: "Grailed" },
  { value: "vestiaire", label: "Vestiaire Collective" },
  { value: "etsy", label: "Etsy" },
  { value: "autre", label: "Autre" },
];

const STATUS_LABELS = {
  todo: "À envoyer",
  sent_j0: "Envoyé J0",
  sent_j3: "Relancé J3",
  sent_j7: "Relancé J7",
  replied: "A répondu",
  visio_booked: "Visio prévue",
  founder: "Fondateur signé",
  lost: "Perdu",
};

const STATUS_ORDER = ["todo", "sent_j0", "sent_j3", "sent_j7", "replied", "visio_booked", "founder", "lost"];

const STATUS_COLORS = {
  todo: { bg: "#fff", border: "#d4d2c8", text: "#111" },
  sent_j0: { bg: "#fef9e7", border: "#f0d97d", text: "#6b5b14" },
  sent_j3: { bg: "#fdf1df", border: "#f7931a", text: "#b56500" },
  sent_j7: { bg: "#fde2cf", border: "#e07b00", text: "#8a4600" },
  replied: { bg: "#e7f3ec", border: "#1f9f5f", text: "#167a48" },
  visio_booked: { bg: "#d6ebe0", border: "#1f9f5f", text: "#0f5a32" },
  founder: { bg: "#1f9f5f", border: "#167a48", text: "#fff" },
  lost: { bg: "#f0eee5", border: "#a0a09a", text: "#6b6b6b" },
};

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setAuthChecked(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      const s = data.session;
      setSession(s);
      if (s) {
        const tier = s.user?.app_metadata?.tier;
        setIsAdmin(tier === "admin");
      }
      setAuthChecked(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) {
        const tier = s.user?.app_metadata?.tier;
        setIsAdmin(tier === "admin");
      } else {
        setIsAdmin(false);
      }
    });
    return () => sub?.subscription?.unsubscribe();
  }, []);

  const loadLeads = useCallback(async () => {
    if (!session) return;
    setLoadingLeads(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur chargement");
      setLeads(data.leads || []);
    } catch (e) {
      setError(e.message);
    }
    setLoadingLeads(false);
  }, [session]);

  useEffect(() => {
    if (isAdmin && session) loadLeads();
  }, [isAdmin, session, loadLeads]);

  const filteredLeads = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const statusCounts = STATUS_ORDER.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s).length;
    return acc;
  }, {});
  const dueToday = leads.filter((l) => {
    const due = l.followup_j3_due || l.followup_j7_due;
    if (!due) return false;
    return new Date(due) <= new Date();
  });

  if (!authChecked) {
    return <FullscreenMessage>Chargement…</FullscreenMessage>;
  }
  if (!session) {
    return (
      <FullscreenMessage>
        <p>Tu dois être connecté pour accéder à /admin.</p>
        <Link href="/compte">
          <span style={{ color: "#167a48", fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>
            Aller sur /compte
          </span>
        </Link>
      </FullscreenMessage>
    );
  }
  if (!isAdmin) {
    return <FullscreenMessage>Accès réservé aux comptes admin.</FullscreenMessage>;
  }

  return (
    <>
      <Head>
        <title>Admin — Growth Ops SellCov</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style jsx global>{`
        :root {
          --bg: #f8f7f3;
          --bg-card: #ffffff;
          --ink: #111111;
          --ink-soft: #2a2a2a;
          --muted: #6b6b6b;
          --dim: #a0a09a;
          --line: #e6e4dc;
          --line-strong: #d4d2c8;
          --green: #1f9f5f;
          --green-deep: #167a48;
          --green-soft: #e7f3ec;
          --danger: #c0392b;
          --danger-soft: #fdecea;
          --radius: 12px;
          --radius-lg: 20px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; }
        body {
          font-family: var(--font-inter), -apple-system, system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; cursor: pointer; }
        input, textarea, select {
          font-family: inherit;
          font-size: 14px;
          color: var(--ink);
        }
      `}</style>

      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/">
              <img src="/logo-full.png" alt="SellCov" style={{ height: 56, width: "auto", cursor: "pointer" }} />
            </Link>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green-deep)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 999, background: "var(--green-soft)" }}>
              ADMIN · GROWTH OPS
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>{session.user.email}</div>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 20px 80px" }}>
        {/* Stats bar */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 24 }}>
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(filter === s ? "all" : s)}
              style={{
                ...statBox,
                background: STATUS_COLORS[s].bg,
                border: `1.5px solid ${filter === s ? STATUS_COLORS[s].border : "var(--line)"}`,
                outline: filter === s ? `2px solid ${STATUS_COLORS[s].border}` : "none",
                outlineOffset: -2,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: STATUS_COLORS[s].text }}>{statusCounts[s] || 0}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{STATUS_LABELS[s]}</div>
            </button>
          ))}
        </section>

        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setFilter("all")}
              style={{ ...pillBtn, background: filter === "all" ? "var(--ink)" : "var(--bg-card)", color: filter === "all" ? "#fff" : "var(--ink)" }}
            >
              Tous ({leads.length})
            </button>
            {dueToday.length > 0 && (
              <span style={{ ...pillBtn, background: "#fef9e7", color: "#6b5b14", border: "1.5px solid #f0d97d", cursor: "default" }}>
                ⏰ Relances dues : {dueToday.length}
              </span>
            )}
          </div>
          <button onClick={() => setShowAddForm(true)} style={primaryBtn}>
            + Nouveau lead
          </button>
        </div>

        {error && (
          <div style={{ padding: "12px 16px", background: "var(--danger-soft)", border: "1.5px solid #f5c2bc", borderRadius: 12, color: "var(--danger)", marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        {loadingLeads && <div style={{ padding: 20, color: "var(--muted)", textAlign: "center" }}>Chargement…</div>}

        {!loadingLeads && filteredLeads.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", background: "var(--bg-card)", borderRadius: 16, border: "1.5px dashed var(--line-strong)" }}>
            {leads.length === 0 ? "Aucun lead. Clique sur '+ Nouveau lead' pour démarrer." : "Aucun lead dans ce filtre."}
          </div>
        )}

        {!loadingLeads && filteredLeads.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredLeads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
              />
            ))}
          </div>
        )}
      </main>

      {showAddForm && (
        <AddLeadModal
          onClose={() => setShowAddForm(false)}
          onAdded={() => { setShowAddForm(false); loadLeads(); }}
          session={session}
        />
      )}

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          session={session}
          onClose={() => setSelectedLead(null)}
          onChanged={() => { loadLeads(); }}
        />
      )}
    </>
  );
}

function LeadRow({ lead, onClick }) {
  const color = STATUS_COLORS[lead.status] || STATUS_COLORS.todo;
  const platformLabel = PLATFORM_OPTIONS.find((p) => p.value === lead.platform)?.label || lead.platform || "—";
  const dueJ3 = lead.followup_j3_due && new Date(lead.followup_j3_due) <= new Date();
  const dueJ7 = lead.followup_j7_due && new Date(lead.followup_j7_due) <= new Date();

  return (
    <div onClick={onClick} style={leadRowStyle}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{lead.handle}</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{platformLabel}</span>
          {(dueJ3 || dueJ7) && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "#fef9e7", color: "#6b5b14", border: "1px solid #f0d97d" }}>
              ⏰ {dueJ3 ? "J3 due" : "J7 due"}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "var(--dim)", display: "flex", gap: 12, flexWrap: "wrap" }}>
          {lead.email && <span>{lead.email}</span>}
          {lead.first_name && <span>· {lead.first_name}</span>}
          {lead.sent_at && <span>· envoyé {new Date(lead.sent_at).toLocaleDateString("fr-FR")}</span>}
        </div>
      </div>
      <div style={{
        fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 999,
        background: color.bg, color: color.text, border: `1.5px solid ${color.border}`,
        whiteSpace: "nowrap",
      }}>
        {STATUS_LABELS[lead.status]}
      </div>
    </div>
  );
}

function AddLeadModal({ onClose, onAdded, session }) {
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [rawNotes, setRawNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          handle,
          platform,
          email,
          first_name: firstName,
          raw_notes: rawNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      onAdded();
    } catch (e) {
      setErr(e.message);
      setSubmitting(false);
    }
  }

  return (
    <ModalShell onClose={onClose} title="Nouveau lead">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Handle *">
          <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@nomdurevendeur" required style={inputStyle} />
        </Field>
        <Field label="Plateforme principale">
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={inputStyle}>
            <option value="">—</option>
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@friperie.com" style={inputStyle} />
        </Field>
        <Field label="Prénom">
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Lucas" style={inputStyle} />
        </Field>
        <Field label="Hook perso (1 phrase sur leur compte)" hint="Sera inséré après 'Tombé sur @handle sur Plateforme.'">
          <textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Ex: Ta sélection archive Stüssy m'a tué."
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
          />
        </Field>
        {err && <div style={{ color: "var(--danger)", fontSize: 13 }}>{err}</div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
          <button type="button" onClick={onClose} style={ghostBtn} disabled={submitting}>Annuler</button>
          <button type="submit" style={primaryBtn} disabled={submitting}>
            {submitting ? "…" : "Ajouter"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function LeadDetailModal({ lead: initialLead, session, onClose, onChanged }) {
  const [lead, setLead] = useState(initialLead);
  const [preview, setPreview] = useState(null);
  const [previewKind, setPreviewKind] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState(null);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedBody, setEditedBody] = useState("");

  async function generatePreview(kind) {
    setLoadingPreview(true);
    setErr(null);
    setPreviewKind(kind);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ leadId: lead.id, kind, dryRun: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur preview");
      setPreview(data.preview);
      setEditedSubject(data.preview.subject);
      setEditedBody(data.preview.body);
    } catch (e) {
      setErr(e.message);
    }
    setLoadingPreview(false);
  }

  async function send() {
    if (!preview || !previewKind) return;
    if (!lead.email) {
      setErr("Pas d'email pour ce lead. Ajoute un email d'abord.");
      return;
    }
    setSending(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          leadId: lead.id,
          kind: previewKind,
          subject: editedSubject,
          body: editedBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur envoi");
      setPreview(null);
      setPreviewKind(null);
      onChanged();
      onClose();
    } catch (e) {
      setErr(e.message);
      setSending(false);
    }
  }

  async function updateStatus(newStatus) {
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setLead(data.lead);
      onChanged();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function deleteLead() {
    if (!confirm("Supprimer ce lead ? Action irréversible.")) return;
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error("Erreur suppression");
      onChanged();
      onClose();
    } catch (e) {
      setErr(e.message);
    }
  }

  const platformLabel = PLATFORM_OPTIONS.find((p) => p.value === lead.platform)?.label || "—";
  const color = STATUS_COLORS[lead.status] || STATUS_COLORS.todo;

  return (
    <ModalShell onClose={onClose} title={lead.handle} subtitle={platformLabel}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: color.bg, color: color.text, border: `1.5px solid ${color.border}` }}>
            {STATUS_LABELS[lead.status]}
          </span>
          {lead.email && <span style={{ fontSize: 13, color: "var(--muted)" }}>{lead.email}</span>}
        </div>

        {lead.raw_notes && (
          <div style={{ padding: "10px 12px", background: "#f8f7f3", borderRadius: 10, border: "1px solid var(--line)", fontSize: 13, color: "var(--ink-soft)" }}>
            <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Hook perso</strong>
            <div style={{ marginTop: 4 }}>{lead.raw_notes}</div>
          </div>
        )}

        {!preview && (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => generatePreview("initial")} style={primaryBtn} disabled={loadingPreview || !lead.email}>
                Préparer mail initial
              </button>
              <button onClick={() => generatePreview("j3")} style={ghostBtn} disabled={loadingPreview || !lead.email}>
                Relance J3
              </button>
              <button onClick={() => generatePreview("j7")} style={ghostBtn} disabled={loadingPreview || !lead.email}>
                Relance J7
              </button>
            </div>
            {!lead.email && (
              <div style={{ fontSize: 12, color: "var(--danger)" }}>
                Pas d'email — ajoute un email pour pouvoir envoyer.
              </div>
            )}

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 4 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                Statut
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    style={{
                      ...pillBtn,
                      fontSize: 12,
                      padding: "5px 10px",
                      background: lead.status === s ? STATUS_COLORS[s].bg : "var(--bg-card)",
                      color: lead.status === s ? STATUS_COLORS[s].text : "var(--ink-soft)",
                      border: `1.5px solid ${lead.status === s ? STATUS_COLORS[s].border : "var(--line-strong)"}`,
                    }}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14, marginTop: 4 }}>
              <button onClick={deleteLead} style={{ ...ghostBtn, color: "var(--danger)", borderColor: "#f5c2bc" }}>
                Supprimer ce lead
              </button>
            </div>
          </>
        )}

        {preview && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Preview ({previewKind}) — édite avant d'envoyer
            </div>
            <Field label="Objet">
              <input value={editedSubject} onChange={(e) => setEditedSubject(e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Corps">
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={16}
                style={{ ...inputStyle, fontFamily: "inherit", resize: "vertical", lineHeight: 1.5, fontSize: 13 }}
              />
            </Field>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Destinataire : {lead.email}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => { setPreview(null); setPreviewKind(null); }} style={ghostBtn} disabled={sending}>
                Annuler
              </button>
              <button onClick={send} style={primaryBtn} disabled={sending}>
                {sending ? "Envoi…" : "Envoyer"}
              </button>
            </div>
          </>
        )}

        {err && <div style={{ color: "var(--danger)", fontSize: 13 }}>{err}</div>}
      </div>
    </ModalShell>
  );
}

function ModalShell({ children, title, subtitle, onClose }) {
  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalCard} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.01em" }}>{title}</h2>
            {subtitle && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 22, color: "var(--muted)", padding: 0, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, color: "var(--muted)", marginBottom: 5, fontWeight: 600, letterSpacing: "0.02em" }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: "var(--dim)", marginLeft: 6 }}>· {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function FullscreenMessage({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f3", display: "grid", placeItems: "center", padding: 24, textAlign: "center", color: "#6b6b6b", fontSize: 15, fontFamily: "var(--font-inter), -apple-system, system-ui, sans-serif" }}>
      <div>{children}</div>
    </div>
  );
}

const headerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "rgba(248,247,243,0.92)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid var(--line)",
};

const statBox = {
  padding: "10px 12px",
  borderRadius: 12,
  textAlign: "left",
  cursor: "pointer",
  background: "var(--bg-card)",
  transition: "transform .15s",
};

const leadRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  padding: "12px 16px",
  background: "var(--bg-card)",
  border: "1.5px solid var(--line)",
  borderRadius: 12,
  cursor: "pointer",
  transition: "border-color .15s",
};

const primaryBtn = {
  background: "var(--green)",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 14,
};

const ghostBtn = {
  background: "transparent",
  color: "var(--ink)",
  border: "1.5px solid var(--line-strong)",
  padding: "10px 18px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 14,
};

const pillBtn = {
  background: "var(--bg-card)",
  border: "1.5px solid var(--line)",
  padding: "6px 14px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 13,
  color: "var(--ink)",
};

const inputStyle = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid var(--line-strong)",
  borderRadius: 10,
  padding: "10px 12px",
  display: "block",
  outline: "none",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(17,17,17,0.45)",
  display: "grid",
  placeItems: "center",
  padding: 20,
  zIndex: 100,
};

const modalCard = {
  background: "#fff",
  borderRadius: 20,
  padding: "24px 24px 22px",
  maxWidth: 560,
  width: "100%",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
};
