import { useState, useRef } from "react";
import Head from "next/head";
import Layout from "../components/Layout";

const LITIGE_TYPES = [
  "Article non conforme à la description",
  "Article prétendument endommagé",
  "Mauvaise couleur / taille",
  "Article prétendument non reçu",
  "Autre",
];

export default function Litige() {
  const [type, setType] = useState(LITIGE_TYPES[0]);
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
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        newPreviews.push(e.target.result);
        newImages.push({ base64: e.target.result.split(",")[1], mime: file.type });
        if (newImages.length === files.length) {
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
      setError(e.message);
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

  const fraudColor = result?.fraud_score >= 7 ? { bg: "#FEF2F2", border: "#FECACA", text: "#DC2626", label: "Fraude probable" } :
    result?.fraud_score >= 4 ? { bg: "#FFFBEB", border: "#FDE68A", text: "#D97706", label: "Suspect" } :
    { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", label: "Semble légitime" };

  return (
    <>
      <Head><title>SellGuard — Gérer un litige</title></Head>
      <Layout>
        {!result ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>⚖️ Gérer un litige</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>L'IA analyse la situation, détecte les fraudes et génère ta réponse de défense.</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Type de litige</label>
              <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" }}>
                {LITIGE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Message de l'acheteur *</label>
              <textarea value={buyerMessage} onChange={e => setBuyerMessage(e.target.value)} rows={4} placeholder="Colle ici le message exact de l'acheteur ou le motif du litige..." style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", resize: "none", lineHeight: 1.6, fontFamily: "inherit", color: "#111" }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Photos envoyées par l'acheteur <span style={{ fontWeight: 400, color: "#999" }}>(optionnel — détection fraude)</span></label>
              <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                style={{ border: "2px dashed #D1D5DB", borderRadius: 14, padding: 16, cursor: "pointer", background: "#fff", textAlign: "center", minHeight: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {imagePreviews.length > 0
                  ? <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                      {imagePreviews.map((src, i) => <img key={i} src={src} style={{ height: 70, borderRadius: 8, objectFit: "cover" }} />)}
                    </div>
                  : <p style={{ fontSize: 13, color: "#888" }}>+ Ajouter les photos de l'acheteur</p>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Référence certificat SellGuard <span style={{ fontWeight: 400, color: "#999" }}>(si tu as certifié l'envoi)</span></label>
              <input value={certRef} onChange={e => setCertRef(e.target.value)} placeholder="Ex: SG-ABC123XYZ" style={{ width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" }} />
            </div>

            <button onClick={analyze} disabled={loading || !buyerMessage.trim()}
              style={{ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: !buyerMessage.trim() ? "#E5E7EB" : "#111", color: !buyerMessage.trim() ? "#999" : "#fff", cursor: loading ? "default" : "pointer", fontFamily: "inherit" }}>
              {loading ? "Analyse en cours..." : "Analyser et défendre →"}
            </button>

            {error && <div style={{ marginTop: 12, padding: 12, background: "#FEF2F2", borderRadius: 10, fontSize: 13, color: "#DC2626" }}>{error}</div>}
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>Analyse du litige</h2>
              <button onClick={reset} style={{ fontSize: 13, color: "#666", background: "#F3F4F6", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontFamily: "inherit" }}>← Retour</button>
            </div>

            {/* Fraud score */}
            {result.fraud_score !== undefined && (
              <div style={{ background: fraudColor.bg, border: `1px solid ${fraudColor.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: fraudColor.text }}>
                    {result.fraud_score >= 7 ? "🚨" : result.fraud_score >= 4 ? "⚠️" : "✅"} Détection fraude — {fraudColor.label}
                  </p>
                  <span style={{ fontSize: 20, fontWeight: 800, color: fraudColor.text }}>{result.fraud_score}/10</span>
                </div>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{result.fraud_analysis}</p>
              </div>
            )}

            {/* Verdict */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 8 }}>ANALYSE DE LA SITUATION</p>
              <p style={{ fontSize: 14, color: "#111", lineHeight: 1.7 }}>{result.verdict}</p>
            </div>

            {/* Defense arguments */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 12 }}>TES ARGUMENTS DE DÉFENSE</p>
              {result.arguments?.map((arg, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < result.arguments.length - 1 ? 10 : 0, padding: "10px 14px", background: "#F9FAFB", borderRadius: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>🛡️</span>
                  <p style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>{arg}</p>
                </div>
              ))}
            </div>

            {/* Response */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>RÉPONSE À ENVOYER</p>
                <button onClick={() => copy(result.response)} style={{ fontSize: 12, color: "#555", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                  {copied ? "Copié ✓" : "Copier"}
                </button>
              </div>
              <p style={{ fontSize: 13, color: "#111", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{result.response}</p>
            </div>

            {/* Next steps */}
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 14, padding: "16px 20px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", letterSpacing: 0.5, marginBottom: 10 }}>PROCHAINES ÉTAPES</p>
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
