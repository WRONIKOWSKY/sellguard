import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useLang } from '../contexts/LangContext';
import { getSupabase } from '../lib/supabaseClient';
import { compressImage } from '../lib/imageUtils';

export default function Litige() {
  const { t, lang } = useLang();
  const l = t.litige;

  const [type, setType] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [certRef, setCertRef] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (!file) return;
      compressImage(file, 1200, 0.75, (dataUrl) => {
        setImagePreviews(p => [...p, dataUrl]);
        setImages(i => [...i, { base64: dataUrl.split(',')[1], mime: 'image/jpeg' }]);
      });
    });
  }

  async function analyze() {
    if (!buyerMessage.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const sb = getSupabase();
      const sessRes = await sb.auth.getSession();
      const session = sessRes?.data?.session;
      if (!session) {
        setError('Tu dois être connecté pour gérer un litige. Va sur /compte.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/litige', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session.access_token
        },
        body: JSON.stringify({ type, buyerMessage, certRef, images })
      });
      const data = await res.json();
      if (res.status === 429) throw new Error('Quota journalier atteint (10 litiges / jour). Reset à minuit UTC.');
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setResult(data);
    } catch (e) {
      const msg = e.message || '';
      if (msg.includes('Quota')) {
        setError(msg);
      } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError('Erreur de connexion. Vérifie ta connexion internet et réessaie.');
      } else if (msg.includes('503') || msg.includes('overloaded')) {
        setError('Le serveur est occupé. Attends quelques secondes et réessaie.');
      } else {
        setError('Une erreur est survenue. Réessaie.');
      }
    }
    setLoading(false);
  }

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function reset() {
    setResult(null); setImages([]); setImagePreviews([]); setBuyerMessage(''); setCertRef(''); setError(null);
  }

  const fraudLevel = result?.fraud_score >= 7
    ? 'high'
    : result?.fraud_score >= 4
    ? 'mid'
    : 'low';

  const fraudLabel = result?.fraud_score >= 7
    ? (lang === 'en' ? 'Likely fraud' : lang === 'es' ? 'Fraude probable' : lang === 'it' ? 'Frode probabile' : 'Fraude probable')
    : result?.fraud_score >= 4
    ? (lang === 'en' ? 'Suspicious' : lang === 'es' ? 'Sospechoso' : lang === 'it' ? 'Sospetto' : 'Suspect')
    : (lang === 'en' ? 'Seems legitimate' : lang === 'es' ? 'Parece legítimo' : lang === 'it' ? 'Sembra legittimo' : 'Semble légitime');

  const selectPlaceholder = lang === 'en' ? 'Select type' : lang === 'es' ? 'Seleccionar tipo' : lang === 'it' ? 'Seleziona tipo' : 'Sélectionne le type';

  const fraudColors = {
    low:  { bg: '#e7f3ec', border: '#1f9f5f', text: '#167a48' },
    mid:  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    high: { bg: '#fee2e2', border: '#c0392b', text: '#991b1b' },
  };
  const fc = fraudColors[fraudLevel];

  return (
    <>
      <Head>
        <title>SellCov — {l.title}</title>
        <meta name="description" content="Génère une défense automatique pour répondre aux litiges acheteurs." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style jsx global>{`
        :root {
          --bg: #f8f7f3;
          --bg-soft: #ffffff;
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
          <Link href="/">
            <span style={{ color: "#6b6b6b", fontSize: 14, fontWeight: 500, padding: "8px 14px", borderRadius: 999, cursor: "pointer" }}>
              Retour
            </span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ padding: "48px 0 24px", textAlign: "center" }}>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(28px, 6vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            {l.title}
          </h1>
          <p style={{ color: "#6b6b6b", fontSize: 16, marginTop: 14, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
            {l.subtitle}
          </p>
        </div>

        {!result ? (
          <>
            <div style={cardStyle}>
              <Field label={l.type_label}>
                <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
                  <option value="">{selectPlaceholder}</option>
                  {l.types.map(ty => <option key={ty}>{ty}</option>)}
                </select>
              </Field>

              <Field label={l.msg_label}>
                <textarea
                  value={buyerMessage}
                  onChange={e => setBuyerMessage(e.target.value)}
                  rows={5}
                  placeholder={l.msg_ph}
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.55 }}
                />
              </Field>

              <Field label={l.photos_label} hint={l.photos_hint}>
                <div
                  onClick={() => fileRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                  style={{
                    border: "1.5px dashed #d4d2c8",
                    borderRadius: 14,
                    padding: 20,
                    cursor: "pointer",
                    background: "#f8f7f3",
                    textAlign: "center",
                    minHeight: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {imagePreviews.length > 0 ? (
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                      {imagePreviews.map((src, i) => (
                        <img key={i} src={src} alt="" style={{ width: 90, height: 90, borderRadius: 10, objectFit: "cover" }} />
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 14, color: "#6b6b6b" }}>{l.photos_add}</p>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={e => handleFiles(e.target.files)}
                />
              </Field>

              <Field label={l.cert_label} hint={l.cert_hint}>
                <input
                  type="text"
                  value={certRef}
                  onChange={e => setCertRef(e.target.value)}
                  placeholder={l.cert_ph}
                  style={inputStyle}
                />
              </Field>

              <button
                onClick={analyze}
                disabled={loading || !buyerMessage.trim()}
                style={{ ...btnPrimary, opacity: (loading || !buyerMessage.trim()) ? 0.5 : 1, cursor: (loading || !buyerMessage.trim()) ? "not-allowed" : "pointer" }}
              >
                {loading ? l.analyzing : l.analyze_btn}
              </button>

              {error && (
                <div style={{ marginTop: 14, padding: "12px 16px", background: "#fdecea", border: "1.5px solid #f5c2bc", borderRadius: 12, color: "#c0392b", fontSize: 14, fontWeight: 500 }}>
                  {error}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>{l.title}</h2>
              <button onClick={reset} style={btnGhostSmall}>
                {l.back}
              </button>
            </div>

            {result.fraud_score !== undefined && (
              <div style={{ background: fc.bg, border: `1.5px solid ${fc.border}`, borderRadius: 28, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 16, flexWrap: "wrap" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: fc.text }}>
                    {l.fraud_label} {fraudLabel}
                  </p>
                  <span style={{ fontSize: 26, fontWeight: 800, color: fc.text, letterSpacing: "-0.02em" }}>
                    {result.fraud_score}/10
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "#2a2a2a", lineHeight: 1.55 }}>{result.fraud_analysis}</p>
              </div>
            )}

            <div style={cardStyle}>
              <p style={labelStyle}>{l.verdict_l}</p>
              <p style={{ fontSize: 15, color: "#111", lineHeight: 1.7 }}>{result.verdict}</p>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>{l.args_l}</p>
              {result.arguments?.map((arg, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", background: "#f8f7f3", border: "1.5px solid #e6e4dc", borderRadius: 12, marginBottom: 10 }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: "#e7f3ec", color: "#167a48", fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                    ✓
                  </span>
                  <p style={{ fontSize: 14, color: "#2a2a2a", lineHeight: 1.6 }}>{arg}</p>
                </div>
              ))}
            </div>

            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 16 }}>
                <p style={{ ...labelStyle, marginBottom: 0 }}>{l.response_l}</p>
                <button onClick={() => copy(result.response)} style={btnCopy}>
                  {copied ? l.copied : l.copy}
                </button>
              </div>
              <p style={{ fontSize: 14.5, color: "#111", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{result.response}</p>
            </div>

            <div style={{ background: "#f8f7f3", border: "1.5px solid #d4d2c8", borderRadius: 28, padding: "22px 26px" }}>
              <p style={labelStyle}>{l.steps_l}</p>
              {result.next_steps?.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: "#e7f3ec", color: "#167a48", fontWeight: 700, fontSize: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 14, color: "#2a2a2a", lineHeight: 1.6 }}>{step}</p>
                </div>
              ))}
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
  padding: "28px 26px",
  marginBottom: 16,
};

const inputStyle = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid #d4d2c8",
  borderRadius: 12,
  padding: "13px 14px",
  color: "#111",
  fontSize: 15.5,
  fontFamily: "inherit",
  display: "block",
  outline: "none",
};

const btnPrimary = {
  width: "100%",
  background: "#1f9f5f",
  color: "#fff",
  border: "none",
  padding: "16px 24px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 15,
  boxShadow: "0 6px 20px rgba(31,159,95,0.22)",
  fontFamily: "inherit",
};

const btnGhostSmall = {
  background: "transparent",
  color: "#111",
  border: "1.5px solid #d4d2c8",
  padding: "8px 16px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
};

const btnCopy = {
  background: "#e7f3ec",
  color: "#167a48",
  border: "none",
  padding: "6px 14px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "inherit",
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#167a48",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  marginBottom: 14,
};

function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, color: "#6b6b6b", marginBottom: 8, fontWeight: 600, letterSpacing: "0.02em" }}>
        {label}
        {hint && <span style={{ fontWeight: 400, color: "#a0a09a", marginLeft: 6 }}>({hint})</span>}
      </label>
      {children}
    </div>
  );
}
