import { useState, useRef } from "react";
import Head from "next/head";
import Layout from "../components/Layout";

const CONDITIONS = ["Neuf avec étiquette", "Neuf sans étiquette", "Très bon état", "Bon état", "Satisfaisant"];

const PLATFORM_STYLE = {
  "Vinted": { bg: "#E1F5EE", color: "#0F6E56" },
  "eBay": { bg: "#FEF3C7", color: "#92400E" },
  "Leboncoin": { bg: "#FFEDD5", color: "#9A3412" },
  "Facebook Marketplace": { bg: "#EFF6FF", color: "#1D4ED8" },
  "Rakuten": { bg: "#FEE2E2", color: "#991B1B" },
  "Vestiaire Collective": { bg: "#EDE9FE", color: "#5B21B6" },
  "Grailed": { bg: "#FEE2E2", color: "#7F1D1D" },
  "Depop": { bg: "#F3F4F6", color: "#111827" },
  "Etsy": { bg: "#FFFBEB", color: "#92400E" },
  "Vide Dressing": { bg: "#FCE7F3", color: "#9D174D" },
};

const MEASURE_FIELDS = {
  "Haut / T-shirt": ["Poitrine (cm)", "Épaules (cm)", "Longueur dos (cm)", "Manches (cm)"],
  "Veste / Manteau": ["Épaules (cm)", "Poitrine (cm)", "Taille (cm)", "Longueur dos (cm)", "Manches (cm)"],
  "Pantalon / Jean": ["Tour de taille (cm)", "Tour de hanches (cm)", "Longueur jambe (cm)", "Entrejambe (cm)"],
  "Robe / Jupe": ["Poitrine (cm)", "Taille (cm)", "Hanches (cm)", "Longueur (cm)"],
  "Chaussures": ["Pointure EU", "Longueur semelle (cm)"],
  "Accessoire / Sac": ["Longueur (cm)", "Hauteur (cm)", "Largeur (cm)"],
};

export default function Annonce() {
  const [condition, setCondition] = useState(CONDITIONS[2]);
  const [extra, setExtra] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMime, setImageMime] = useState("image/jpeg");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [copied, setCopied] = useState({});
  const [measureCategory, setMeasureCategory] = useState("");
  const [measures, setMeasures] = useState({});
  const fileRef = useRef();

  function handleFile(file) {
    if (!file) return;
    setImageMime(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = e => {
      setImagePreview(e.target.result);
      setImageBase64(e.target.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  }

  function setMeasure(field, value) {
    setMeasures(m => ({ ...m, [field]: value }));
  }

  function buildMeasuresText() {
    if (!measureCategory) return "";
    const fields = MEASURE_FIELDS[measureCategory] || [];
    const filled = fields.filter(f => measures[f]);
    if (!filled.length) return "";
    return "Mesures : " + filled.map(f => `${f.replace(" (cm)", "").replace(" EU", "")} ${measures[f]}${f.includes("EU") ? "" : "cm"}`).join(", ");
  }

  async function analyze() {
    if (!imageBase64 && !extra.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const measuresText = buildMeasuresText();
    const fullExtra = [extra, measuresText].filter(Boolean).join(" — ");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, imageMime, condition, extra: fullExtra })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setResult(data);
      setActiveTab(data.best_platform);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  function copy(key, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(c => ({ ...c, [key]: true }));
      setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 1500);
    });
  }

  function reset() {
    setResult(null); setImageBase64(null); setImagePreview(null);
    setExtra(""); setError(null); setActiveTab(null);
    setMeasureCategory(""); setMeasures({});
  }

  const activePlatform = result?.platforms?.find(p => p.name === activeTab);
  const inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" };

  return (
    <>
      <Head><title>SellGuard — Générer une annonce</title></Head>
      <Layout>
        {!result ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>📦 Générer une annonce</h2>
              <p style={{ fontSize: 14, color: "#666" }}>Photo → annonces optimisées pour toutes les plateformes en 10 secondes.</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>Photo de l'article</label>
              <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                style={{ border: "2px dashed #D1D5DB", borderRadius: 16, padding: 28, cursor: "pointer", background: "#fff", textAlign: "center", minHeight: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {imagePreview
                  ? <img src={imagePreview} style={{ maxHeight: 200, borderRadius: 10, objectFit: "contain" }} />
                  : <div><div style={{ fontSize: 36, marginBottom: 10 }}>📷</div><p style={{ fontSize: 14, color: "#888" }}>Clique ou glisse une photo</p><p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>L'IA identifie l'article automatiquement</p></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>État</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={inp}>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>Infos supplémentaires <span style={{ fontWeight: 400, color: "#999" }}>(optionnel)</span></label>
              <textarea value={extra} onChange={e => setExtra(e.target.value)} rows={2} placeholder="Marque, taille, couleur, défauts éventuels..." style={{ ...inp, resize: "none", lineHeight: 1.6, padding: "10px 12px" }} />
            </div>

            {/* MESURES */}
            <div style={{ marginBottom: 24, background: "#F8FAFF", border: "1px solid #DBEAFE", borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: measureCategory ? 12 : 0 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}>📏 Ajouter les mesures <span style={{ fontWeight: 400, color: "#64748B" }}>(recommandé)</span></label>
              </div>
              <select value={measureCategory} onChange={e => { setMeasureCategory(e.target.value); setMeasures({}); }}
                style={{ ...inp, marginBottom: measureCategory ? 12 : 0, background: "#fff" }}>
                <option value="">Choisir le type de vêtement...</option>
                {Object.keys(MEASURE_FIELDS).map(cat => <option key={cat}>{cat}</option>)}
              </select>

              {measureCategory && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {MEASURE_FIELDS[measureCategory].map(field => (
                    <div key={field}>
                      <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 4 }}>{field}</label>
                      <input
                        type="number"
                        value={measures[field] || ""}
                        onChange={e => setMeasure(field, e.target.value)}
                        placeholder="—"
                        style={{ ...inp, padding: "8px 12px", fontSize: 14 }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {measureCategory && buildMeasuresText() && (
                <div style={{ marginTop: 10, padding: "8px 12px", background: "#EFF6FF", borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: "#1D4ED8", margin: 0 }}>{buildMeasuresText()}</p>
                </div>
              )}
            </div>

            <button onClick={analyze} disabled={loading || (!imageBase64 && !extra.trim())}
              style={{ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: (!imageBase64 && !extra.trim()) ? "#E5E7EB" : "#111", color: (!imageBase64 && !extra.trim()) ? "#999" : "#fff", cursor: loading ? "default" : "pointer", fontFamily: "inherit" }}>
              {loading ? "Analyse en cours..." : "Générer les annonces →"}
            </button>

            {error && <div style={{ marginTop: 12, padding: 12, background: "#FEF2F2", borderRadius: 10, fontSize: 13, color: "#DC2626" }}>{error}</div>}
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>{result.item_name}</h2>
                <p style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{result.item_category} · {condition}</p>
              </div>
              <button onClick={reset} style={{ fontSize: 13, color: "#666", background: "#F3F4F6", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontFamily: "inherit" }}>← Retour</button>
            </div>

            {/* Mesures recap */}
            {buildMeasuresText() && (
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 13, color: "#1D4ED8", margin: 0 }}>📏 {buildMeasuresText()}</p>
                <button onClick={() => copy("measures", buildMeasuresText())} style={{ fontSize: 11, color: "#1D4ED8", background: "transparent", border: "1px solid #BFDBFE", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 10 }}>
                  {copied["measures"] ? "Copié ✓" : "Copier"}
                </button>
              </div>
            )}

            {/* Platform tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {result.platforms?.map(p => (
                <button key={p.name} onClick={() => setActiveTab(p.name)}
                  style={{ fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 20, border: activeTab === p.name ? "2px solid #111" : "1px solid #E5E7EB", background: activeTab === p.name ? "#111" : "#fff", color: activeTab === p.name ? "#fff" : "#555", cursor: "pointer", fontFamily: "inherit" }}>
                  {p.name === result.best_platform ? "⭐ " : ""}{p.name} · {p.price_min}-{p.price_max}€
                </button>
              ))}
            </div>

            {activePlatform && (
              <div>
                <div style={{ background: PLATFORM_STYLE[activePlatform.name]?.bg || "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: "#fff", color: PLATFORM_STYLE[activePlatform.name]?.color || "#333" }}>{activePlatform.name}</span>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>{activePlatform.price_min}–{activePlatform.price_max}€</p>
                      <p style={{ fontSize: 11, color: "#888" }}>Score {activePlatform.score}/10 · {result.time_to_sell}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#555", marginTop: 10, lineHeight: 1.5 }}>{activePlatform.reason}</p>
                </div>

                {[["TITRE", "title", result.title], ["DESCRIPTION", "desc", result.description]].map(([label, key, value]) => (
                  <div key={key} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>{label}</span>
                      <button onClick={() => copy(key, value)} style={{ fontSize: 12, color: "#555", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                        {copied[key] ? "Copié ✓" : "Copier"}
                      </button>
                    </div>
                    <p style={{ fontSize: key === "title" ? 15 : 13, fontWeight: key === "title" ? 700 : 400, color: "#111", lineHeight: 1.7 }}>{value}</p>
                  </div>
                ))}

                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 10 }}>HASHTAGS / MOTS-CLÉS</p>
                  <div>{result.keywords?.map(k => (
                    <span key={k} style={{ display: "inline-block", fontSize: 12, padding: "4px 10px", background: "#F3F4F6", borderRadius: 20, margin: "0 4px 6px 0", color: "#444" }}>#{k}</span>
                  ))}</div>
                </div>

                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#92400E", letterSpacing: 0.5, marginBottom: 10 }}>CONSEILS POUR CETTE PLATEFORME</p>
                  {result.selling_tips?.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < result.selling_tips.length - 1 ? 8 : 0 }}>
                      <span style={{ color: "#D97706", flexShrink: 0 }}>·</span>
                      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Layout>
    </>
  );
}
