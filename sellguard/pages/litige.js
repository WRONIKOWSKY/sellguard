import { useState, useRef } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";

export default function Litige() {
  const { t, lang } = useLang();
  const l = t.litige;

  const [type, setType] = useState("");
  const [buyerMessage, setBuyerMessage] = useState("");
  const [certRef, setCertRef] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  function handleFiles(files) {
    const newPreviews = [];
    const newImages = [];
    let loaded = 0;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        newPreviews.push(e.target.result);
        newImages.push({ base64: e.target.result.split(",")[1], mime: file.type });
        loaded++;
        if (loaded === files.length) {
          setImagePreviews(p => [...p, ...newPreviews]);
          setImages(i => [...i, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  async function analyze() {
    if (!buyerMessage.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/litige", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, buyerMessage, certRef, images })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setResult(data);
    } catch (e) {
      const msg = e.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
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
    setResult(null); setImages([]); setImagePreviews([]); setBuyerMessage(""); setCertRef(""); setError(null);
  }

  const fraudColor = result?.fraud_score >= 7
    ? { bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.2)", text: "#DC2626", label: "Fraude probable" }
    : result?.fraud_score >= 4
    ? { bg: "rgba(251,146,60,0.06)", border: "rgba(251,146,60,0.2)", text: "#D97706", label: "Suspect" }
    : { bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.2)", text: "#15803D", label: "Semble légitime" };

  const inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#111", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#fff" };

  return (
    <>
      <Head><title>SellCov {l.title}</title></Head>
      <Layout>
        {!result ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{l.title}</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.6 }}>{l.subtitle}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>{l.type_label}</label>
              <select value={type} onChange={e => setType(e.target.value)} style={inp}>
                <option value="">{lang === "en" ? "Select type" : lang === "es" ? "Seleccionar tipo" : lang === "it" ? "Seleziona tipo" : "Sélectionner le type"}</option>
                {l.types.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>{l.msg_label}</label>
              <textarea value={buyerMessage} onChange={e => setBuyerMessage(e.target.value)} rows={4} placeholder={l.msg_ph}
                style={{ ...inp, resize: "none", lineHeight: 1.6, padding: "10px 12px" }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>
                {l.photos_label} <span style={{ fontWeight: 400, color: "#999" }}>({l.photos_hint})</span>
              </label>
              <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                style={{ border: "1.5px dashed rgba(255,255,255,0.14)", borderRadius: 14, padding: 16, cursor: "pointer", background: "#0A0A0A", textAlign: "center", minHeight: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {imagePreviews.length > 0
                  ? <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                      {imagePreviews.map((src, i) => <img key={i} src={src} style={{ height: 70, borderRadius: 8, objectFit: "cover" }} />)}
                    </div>
                  : <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{l.photos_add}</p>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>
                {l.cert_label} <span style={{ fontWeight: 400, color: "#999" }}>({l.cert_hint})</span>
              </label>
              <input value={certRef} onChange={e => setCertRef(e.target.value)} placeholder={l.cert_ph} style={inp} />
            </div>

            <button onClick={analyze} disabled={loading || !buyerMessage.trim()}
              style={{ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: !buyerMessage.trim() ? "rgba(255,255,255,0.06)" : "#fff", color: !buyerMessage.trim() ? "rgba(255,255,255,0.25)" : "#000", cursor: loading ? "default" : "pointer", fontFamily: "inherit" }}>
              {loading ? l.analyzing : l.analyze_btn}
            </button>

            {error && <div style={{ marginTop: 12, padding: 12, background: "rgba(220,38,38,0.08)", borderRadius: 10, fontSize: 13, color: "#DC2626" }}>{error}</div>}
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{l.title}</h2>
              <button onClick={reset} style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontFamily: "inherit" }}>{l.back}</button>
            </div>

            {result.fraud_score !== undefined && (
              <div style={{ background: fraudColor.bg, border: `0.5px solid ${fraudColor.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: fraudColor.text }}>
                    {l.fraud_label} {fraudColor.label}
                  </p>
                  <span style={{ fontSize: 20, fontWeight: 800, color: fraudColor.text }}>{result.fraud_score}/10</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{result.fraud_analysis}</p>
              </div>
            )}

            <div style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5, marginBottom: 8 }}>{l.verdict_l}</p>
              <p style={{ fontSize: 14, color: "#fff", lineHeight: 1.7 }}>{result.verdict}</p>
            </div>

            <div style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5, marginBottom: 12 }}>{l.args_l}</p>
              {result.arguments?.map((arg, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < result.arguments.length - 1 ? 10 : 0, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}></span>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{arg}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>{l.response_l}</p>
                <button onClick={() => copy(result.response)} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                  {copied ? l.copied : l.copy}
                </button>
              </div>
              <p style={{ fontSize: 13, color: "#fff", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{result.response}</p>
            </div>

            <div style={{ background: "rgba(99,102,241,0.08)", border: "0.5px solid rgba(99,102,241,0.2)", borderRadius: 14, padding: "16px 20px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", letterSpacing: 0.5, marginBottom: 10 }}>{l.steps_l}</p>
              {result.next_steps?.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < result.next_steps.length - 1 ? 8 : 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", flexShrink: 0 }}>{i + 1}.</span>
                  <p style={{ fontSize: 13, color: "#1E40AF", lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </Layout>
    </>
  );
}
