import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

const CARRIER_LABELS = {
  colissimo: "Colissimo (La Poste)",
  mondialrelay: "Mondial Relay",
  chronopost: "Chronopost",
  dpd: "DPD",
  ups: "UPS",
  dhl: "DHL",
  laposte: "La Poste (lettre suivie)",
  autre: "Autre",
};

// Page publique de vérification d'un certificat SellCov.
// URL : /verify/SC-XXXXXXXX
// Pas d'auth requise — n'importe qui (acheteur, plateforme, juge) peut
// consulter cette page pour vérifier qu'un certificat est authentique.

export default function Verify() {
  const router = useRouter();
  const { certId } = router.query;

  const [loading, setLoading] = useState(true);
  const [cert, setCert] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!certId) return;
    setLoading(true);
    fetch(`/api/verify/${encodeURIComponent(certId)}`)
      .then((r) => r.json().then((data) => ({ status: r.status, data })))
      .then(({ status, data }) => {
        if (status !== 200) {
          setError(data.error || "Certificat introuvable");
          setCert(null);
        } else {
          setCert(data);
          setError(null);
        }
      })
      .catch((e) => setError(e.message || "Erreur réseau"))
      .finally(() => setLoading(false));
  }, [certId]);

  return (
    <>
      <Head>
        <title>SellCov — Vérification certificat {certId || ""}</title>
      </Head>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
            <Link href="/">
              <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                <img src="/logo.png" alt="SellCov" style={{ height: 72, width: "auto" }} />
              </span>
            </Link>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>VÉRIFICATION</span>
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 8px 0", fontFamily: "'DM Serif Display', serif" }}>
            Authenticité du certificat
          </h1>
          <p style={{ color: "#888", margin: "0 0 28px 0", fontSize: 14 }}>
            Cette page valide qu'un certificat SellCov est authentique et n'a pas été altéré.
          </p>

          {loading && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>Vérification en cours…</div>
          )}

          {!loading && error && (
            <div style={{ padding: 24, borderRadius: 12, background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.3)" }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#FF3B30", margin: 0 }}>✗ Certificat introuvable</p>
              <p style={{ fontSize: 13, color: "#888", margin: "8px 0 0 0" }}>
                Le certificat <span style={{ fontFamily: "monospace" }}>{certId}</span> n'existe pas ou est invalide.
              </p>
            </div>
          )}

          {!loading && cert && (
            <>
              {/* Bandeau valide / invalide */}
              {cert.signature_valid ? (
                <div style={{ padding: 18, borderRadius: 12, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", marginBottom: 20 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#4ADE80", margin: 0 }}>✓ Certificat authentique</p>
                  <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0 0" }}>
                    Signature cryptographique vérifiée. Les données n'ont pas été altérées depuis la création.
                  </p>
                </div>
              ) : (
                <div style={{ padding: 18, borderRadius: 12, background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.3)", marginBottom: 20 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#FF3B30", margin: 0 }}>⚠ Signature invalide</p>
                  <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0 0" }}>
                    La signature ne correspond pas. Le certificat a peut-être été modifié.
                  </p>
                </div>
              )}

              {/* Métadonnées */}
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <Field label="Référence certificat" value={cert.cert_id} mono large />
                <Field label="Article" value={cert.article || "—"} />
                <Field label="Référence commande" value={cert.order_ref || "—"} />
                <Field label="Numéro de suivi" value={cert.tracking_number || "—"} mono />
                <Field label="Transporteur" value={CARRIER_LABELS[cert.tracking_carrier] || cert.tracking_carrier || "—"} />
                <Field
                  label="Date d'émission"
                  value={new Date(cert.timestamp).toLocaleString("fr-FR", {
                    timeZone: "Europe/Paris",
                    dateStyle: "long",
                    timeStyle: "medium",
                  })}
                />
                <Field label="Taille vidéo" value={cert.video_size_bytes ? Math.round(cert.video_size_bytes / 1024) + " KB" : "—"} />
                <Field label="Empreinte SHA-256" value={cert.video_hash} mono small last />
              </div>

              {/* Boutons d'action */}
              {cert.video_url && (
                <a
                  href={cert.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "14px",
                    borderRadius: 10,
                    background: "#fff",
                    color: "#000",
                    fontSize: 15,
                    fontWeight: 600,
                    textAlign: "center",
                    textDecoration: "none",
                    boxSizing: "border-box",
                    marginBottom: 10,
                  }}
                >
                  Télécharger la vidéo originale
                </a>
              )}
              <a
                href={`/api/certificat?cert_id=${encodeURIComponent(cert.cert_id)}&lang=fr`}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 500,
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                }}
              >
                Télécharger le certificat PDF
              </a>

              <p style={{ fontSize: 11, color: "#666", marginTop: 24, lineHeight: 1.5 }}>
                Signature : {cert.signature_provider} · La vidéo originale est conservée chiffrée par SellCov.
                URL de téléchargement valide 1h.
              </p>

              <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                <Link href="/">
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    Découvrir SellCov <span style={{ fontSize: 14 }}>→</span>
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, value, mono, small, large, last }) {
  return (
    <div style={{ borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)", padding: "10px 0" }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 4, letterSpacing: "0.02em" }}>{label}</div>
      <div
        style={{
          fontSize: large ? 18 : small ? 11 : 14,
          fontWeight: large ? 700 : 400,
          fontFamily: mono ? "monospace" : "inherit",
          wordBreak: small ? "break-all" : "normal",
          color: "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}
