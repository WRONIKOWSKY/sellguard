import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useLang } from "../../contexts/LangContext";

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

export default function Verify() {
  const router = useRouter();
  const { certId } = router.query;
  const { t, lang } = useLang();
  const v = t.verify;

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
          setError(data.error || v.not_found);
          setCert(null);
        } else {
          setCert(data);
          setError(null);
        }
      })
      .catch((e) => setError(e.message || v.err_network))
      .finally(() => setLoading(false));
  }, [certId, v.not_found, v.err_network]);

  return (
    <>
      <Head>
        <title>{v.meta_title_prefix} {certId || ""}</title>
      </Head>
      <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", boxSizing: "border-box" }}>
            <Link href="/">
              <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                <img src="/logo.png" alt="SellCov" style={{ height: 72, width: "auto" }} />
              </span>
            </Link>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>{v.header_kicker}</span>
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 20px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 8px 0", fontFamily: "'DM Serif Display', serif" }}>
            {v.title}
          </h1>
          <p style={{ color: "#888", margin: "0 0 28px 0", fontSize: 14 }}>
            {v.sub}
          </p>

          {loading && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#888" }}>{v.checking}</div>
          )}

          {!loading && error && (
            <div style={{ padding: 24, borderRadius: 12, background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.3)" }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#FF3B30", margin: 0 }}>✗ {v.not_found}</p>
              <p style={{ fontSize: 13, color: "#888", margin: "8px 0 0 0" }}>
                {v.not_found_sub.split("{certId}")[0]}
                <span style={{ fontFamily: "monospace" }}>{certId}</span>
                {v.not_found_sub.split("{certId}")[1]}
              </p>
            </div>
          )}

          {!loading && cert && (
            <>
              {cert.signature_valid ? (
                <div style={{ padding: 18, borderRadius: 12, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.3)", marginBottom: 20 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#4ADE80", margin: 0 }}>✓ {v.ok_title}</p>
                  <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0 0" }}>
                    {v.ok_sub}
                  </p>
                </div>
              ) : (
                <div style={{ padding: 18, borderRadius: 12, background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.3)", marginBottom: 20 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#FF3B30", margin: 0 }}>⚠ {v.bad_title}</p>
                  <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0 0" }}>
                    {v.bad_sub}
                  </p>
                </div>
              )}

              {cert.ots_status === "bitcoin_confirmed" && (
                <div style={{ padding: 18, borderRadius: 12, background: "rgba(247,147,26,0.08)", border: "1px solid rgba(247,147,26,0.3)", marginBottom: 20 }}>
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#F7931A", margin: 0 }}>✓ {v.btc_title}</p>
                  <p style={{ fontSize: 12, color: "#888", margin: "6px 0 10px 0" }}>
                    {v.btc_sub}
                  </p>
                  {cert.ots_proof_url && (
                    <a href={cert.ots_proof_url} style={{ fontSize: 12, color: "#F7931A", textDecoration: "underline" }}>
                      {v.btc_proof}
                    </a>
                  )}
                </div>
              )}
              {cert.ots_status === "pending_bitcoin" && (
                <div style={{ padding: 18, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 20 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{v.btc_pending_title}</p>
                  <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0 0" }}>
                    {v.btc_pending_sub}
                  </p>
                </div>
              )}

              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <Field label={v.field_cert} value={cert.cert_id} mono large />
                <Field label={v.field_article} value={cert.article || v.empty} />
                <Field label={v.field_ref} value={cert.order_ref || v.empty} />
                <Field label={v.field_tracking} value={cert.tracking_number || v.empty} mono />
                <Field label={v.field_carrier} value={CARRIER_LABELS[cert.tracking_carrier] || cert.tracking_carrier || v.empty} />
                <Field
                  label={v.field_date}
                  value={new Date(cert.timestamp).toLocaleString(lang === "en" ? "en-US" : "fr-FR", {
                    timeZone: "Europe/Paris",
                    dateStyle: "long",
                    timeStyle: "medium",
                  })}
                />
                <Field label={v.field_size} value={cert.video_size_bytes ? Math.round(cert.video_size_bytes / 1024) + " KB" : v.empty} />
                <Field label={v.field_hash} value={cert.video_hash} mono small last />
              </div>

              {cert.video_url && (
                <a
                  href={cert.video_url}
                  download={`${cert.cert_id}.${
                    (cert.video_mimetype || "").includes("mp4") ? "mp4"
                    : (cert.video_mimetype || "").includes("quicktime") ? "mov"
                    : "webm"
                  }`}
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
                  {v.download_video}
                </a>
              )}
              <a
                href={`/api/certificat?cert_id=${encodeURIComponent(cert.cert_id)}&lang=${lang || "fr"}`}
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
                {v.download_pdf}
              </a>

              <p style={{ fontSize: 11, color: "#666", marginTop: 24, lineHeight: 1.5 }}>
                {cert.signature_provider ? `${cert.signature_provider} · ` : ""}{v.footer_note}
              </p>

              <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
                <Link href="/">
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {v.discover} <span style={{ fontSize: 14 }}>→</span>
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
