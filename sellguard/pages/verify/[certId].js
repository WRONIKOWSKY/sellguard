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
  const [showHash, setShowHash] = useState(false);

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
          --btc: #f7931a;
          --btc-soft: #fdf1df;
          --btc-deep: #b56500;
          --danger: #c0392b;
          --danger-soft: #fdecea;
          --radius: 16px;
          --radius-lg: 28px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; }
        body {
          font-family: var(--font-inter), -apple-system, system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }
        button { font-family: inherit; }
      `}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(248,247,243,0.92)", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <Link href="/">
            <span style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
              <img src="/logo-full.png" alt="SellCov" style={{ height: 80, width: "auto" }} />
            </span>
          </Link>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green-deep)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {v.header_kicker}
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ padding: "16px 0 28px", textAlign: "center" }}>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(26px, 5.5vw, 36px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            {v.title}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15, marginTop: 12, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            {v.sub}
          </p>
        </div>

        {loading && (
          <div style={{ ...cardStyle, textAlign: "center", color: "var(--muted)" }}>{v.checking}</div>
        )}

        {!loading && error && (
          <div style={{ padding: "20px 22px", borderRadius: 16, background: "var(--danger-soft)", border: "1.5px solid #f5c2bc", marginBottom: 16 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--danger)", margin: 0 }}>✗ {v.not_found}</p>
            <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 8 }}>
              {v.not_found_sub.split("{certId}")[0]}
              <span style={{ fontFamily: "var(--font-mono), monospace" }}>{certId}</span>
              {v.not_found_sub.split("{certId}")[1]}
            </p>
          </div>
        )}

        {!loading && cert && (
          <>
            {cert.signature_valid ? (
              <div style={{ padding: "20px 22px", borderRadius: 16, background: "var(--green-soft)", border: "1.5px solid var(--green)", marginBottom: 14 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--green-deep)", margin: 0 }}>✓ {v.ok_title}</p>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.55 }}>
                  {v.ok_sub}
                </p>
              </div>
            ) : (
              <div style={{ padding: "20px 22px", borderRadius: 16, background: "var(--danger-soft)", border: "1.5px solid var(--danger)", marginBottom: 14 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--danger)", margin: 0 }}>⚠ {v.bad_title}</p>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6, lineHeight: 1.55 }}>
                  {v.bad_sub}
                </p>
              </div>
            )}

            {cert.ots_status === "bitcoin_confirmed" && (
              <div style={{ padding: "20px 22px", borderRadius: 16, background: "var(--btc-soft)", border: "1.5px solid var(--btc)", marginBottom: 14 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--btc-deep)", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <BitcoinIcon />
                  {v.btc_title}
                </p>
                <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.6 }}>
                  {v.btc_sub}
                </p>
                {cert.ots_proof_url && (
                  <a href={cert.ots_proof_url} style={{ display: "inline-block", marginTop: 10, fontSize: 12.5, color: "var(--btc-deep)", textDecoration: "underline", fontWeight: 600 }}>
                    {v.btc_proof}
                  </a>
                )}
              </div>
            )}
            {cert.ots_status === "pending_bitcoin" && (
              <div style={{ padding: "20px 22px", borderRadius: 16, background: "#fff", border: "1.5px solid var(--line-strong)", marginBottom: 14 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", margin: 0 }}>{v.btc_pending_title}</p>
                <p style={{ fontSize: 13.5, color: "var(--muted)", marginTop: 6, lineHeight: 1.55 }}>
                  {v.btc_pending_sub}
                </p>
              </div>
            )}

            <div style={cardStyle}>
              <Field label={v.field_cert} value={cert.cert_id} mono large />
              <Field label={v.field_article} value={cert.article || v.empty} />
              {cert.order_ref && <Field label={v.field_ref} value={cert.order_ref} />}
              {cert.tracking_number && <Field label={v.field_tracking} value={cert.tracking_number} mono />}
              {cert.tracking_carrier && <Field label={v.field_carrier} value={CARRIER_LABELS[cert.tracking_carrier] || cert.tracking_carrier} />}
              <Field
                label={v.field_date}
                value={new Date(cert.timestamp).toLocaleString(lang === "en" ? "en-US" : "fr-FR", {
                  timeZone: "Europe/Paris",
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              />
              <div style={{ padding: "11px 0 4px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6b6b6b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
                  {v.field_hash}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#b56500", fontWeight: 600 }}>
                    <BitcoinIcon />
                    {v.hash_anchor_note}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHash((s) => !s)}
                  style={{
                    marginTop: 10,
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    color: "#167a48",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontFamily: "inherit",
                  }}
                >
                  {showHash ? v.hash_hide : v.hash_show}
                </button>
                {showHash && (
                  <div style={{
                    marginTop: 8,
                    fontSize: 11,
                    fontFamily: "var(--font-mono), monospace",
                    color: "#111",
                    wordBreak: "break-all",
                    background: "#f8f7f3",
                    border: "1.5px solid #e6e4dc",
                    borderRadius: 8,
                    padding: "10px 12px",
                  }}>
                    {cert.video_hash}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
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
                  style={btnPrimary}
                >
                  {v.download_video}
                </a>
              )}
              <a
                href={`/api/certificat?cert_id=${encodeURIComponent(cert.cert_id)}&lang=${lang || "fr"}`}
                style={btnGhost}
              >
                {v.download_pdf}
              </a>
            </div>

            <p style={{ fontSize: 12, color: "var(--dim)", marginTop: 18, textAlign: "center", lineHeight: 1.55 }}>
              {v.footer_note}
            </p>

            <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--line)", textAlign: "center" }}>
              <Link href="/">
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--green-deep)", cursor: "pointer" }}>
                  {v.discover}
                </span>
              </Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1.5px solid #e6e4dc",
  borderRadius: 28,
  padding: "22px 26px",
  marginBottom: 14,
};

const btnPrimary = {
  display: "block",
  width: "100%",
  padding: "15px 24px",
  borderRadius: 999,
  background: "#1f9f5f",
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  textAlign: "center",
  textDecoration: "none",
  boxSizing: "border-box",
  boxShadow: "0 6px 20px rgba(31,159,95,0.22)",
};

const btnGhost = {
  display: "block",
  width: "100%",
  padding: "14px 22px",
  borderRadius: 999,
  background: "transparent",
  color: "#111",
  border: "1.5px solid #d4d2c8",
  fontSize: 14.5,
  fontWeight: 600,
  textAlign: "center",
  textDecoration: "none",
  boxSizing: "border-box",
};

function Field({ label, value, mono, small, large, last }) {
  return (
    <div style={{ borderBottom: last ? "none" : "1px solid #f0eee5", padding: "11px 0" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#6b6b6b", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <div
        style={{
          fontSize: large ? 18 : small ? 11 : 14.5,
          fontWeight: large ? 800 : 500,
          fontFamily: mono ? "var(--font-mono), monospace" : "inherit",
          wordBreak: small ? "break-all" : "normal",
          color: "#111",
          letterSpacing: large ? "0.02em" : "normal",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function BitcoinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.36 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.328-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.974.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.18-.24.45-.614.35.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.236-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93zm-3.012 4.22c-.41 1.64-3.165.75-4.06.53l.72-2.91c.895.225 3.77.67 3.34 2.38zm.41-4.24c-.375 1.5-2.665.735-3.41.55l.66-2.64c.745.185 3.13.535 2.75 2.09z"/>
    </svg>
  );
}
