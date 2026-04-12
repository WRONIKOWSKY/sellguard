import { useState, useRef } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";
import { saveToHistory } from "./historique";

const PLATFORM_STYLE = {
  "Vinted":               { bg: "#E6F9FA", color: "#09B1BA" },
  "Depop":                { bg: "#FFF0F0", color: "#FF0000" },
  "Grailed":              { bg: "#F5F5F5", color: "#000000" },
  "Vestiaire Collective": { bg: "#F5F0EB", color: "#1A1A1A" },
  "Etsy":                 { bg: "#FFF3EE", color: "#F1641E" },
};

const MEASURE_FIELDS_FR = {
  "Haut / T-shirt": ["Poitrine (cm)", "Épaules (cm)", "Longueur dos (cm)", "Manches (cm)"],
  "Veste / Manteau": ["Épaules (cm)", "Poitrine (cm)", "Taille (cm)", "Longueur dos (cm)", "Manches (cm)"],
  "Pantalon / Jean": ["Tour de taille (cm)", "Tour de hanches (cm)", "Longueur jambe (cm)", "Entrejambe (cm)"],
  "Robe / Jupe": ["Poitrine (cm)", "Taille (cm)", "Hanches (cm)", "Longueur (cm)"],
  "Chaussures": ["Pointure EU", "Longueur semelle (cm)"],
  "Accessoire / Sac": ["Longueur (cm)", "Hauteur (cm)", "Largeur (cm)"],
};

const MEASURE_FIELDS_EN = {
  "Top / T-shirt": ["Chest (cm)", "Shoulders (cm)", "Back length (cm)", "Sleeves (cm)"],
  "Jacket / Coat": ["Shoulders (cm)", "Chest (cm)", "Waist (cm)", "Back length (cm)", "Sleeves (cm)"],
  "Pants / Jeans": ["Waist (cm)", "Hips (cm)", "Leg length (cm)", "Inseam (cm)"],
  "Dress / Skirt": ["Chest (cm)", "Waist (cm)", "Hips (cm)", "Length (cm)"],
  "Shoes": ["EU Size", "Sole length (cm)"],
  "Accessory / Bag": ["Length (cm)", "Height (cm)", "Width (cm)"],
};

export default function Annonce() {
  const { lang, t } = useLang();
  const a = t.annonce;
  const MEASURE_FIELDS = lang === "en" ? MEASURE_FIELDS_EN : MEASURE_FIELDS_FR;

  const [condition, setCondition] = useState(a.conditions[2]);
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
    const prefix = lang === "en" ? "Measurements: " : "Mesures : ";
    return prefix + filled.map(f => `${f.replace(" (cm)", "").replace(" EU", "").replace(" (EU)", "")} ${measures[f]}${f.toLowerCase().includes("eu") || f.toLowerCase().includes("size") ? "" : "cm"}`).join(", ");
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
      saveToHistory(data, condition, lang);
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
    setCondition(a.conditions[2]);
  }

  const activePlatform = result?.platforms?.find(p => p.name === activeTab);
  const inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" };

  return (
    <>
      <Head><title>SellGuard — {a.title}</title></Head>
      <Layout>
        {!result ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>📦 {a.title}</h2>
              <p style={{ fontSize: 14, color: "#666" }}>{a.subtitle}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>{a.photo_label}</label>
              <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                style={{ border: "2px dashed #D1D5DB", borderRadius: 16, padding: 28, cursor: "pointer", background: "#fff", textAlign: "center", minHeight: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {imagePreview
                  ? <img src={imagePreview} style={{ maxHeight: 200, borderRadius: 10, objectFit: "contain" }} />
                  : <div><div style={{ fontSize: 36, marginBottom: 10 }}>📷</div><p style={{ fontSize: 14, color: "#888" }}>{a.photo_hint}</p><p style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{a.photo_sub}</p></div>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{a.condition_label}</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={inp}>
                {a.conditions.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{a.extra_label} <span style={{ fontWeight: 400, color: "#999" }}>(optionnel)</span></label>
              <textarea value={extra} onChange={e => setExtra(e.target.value)} rows={2} placeholder={a.extra_ph} style={{ ...inp, resize: "none", lineHeight: 1.6, padding: "10px 12px" }} />
            </div>

            <div style={{ marginBottom: 24, background: "#F8FAFF", border: "1px solid #DBEAFE", borderRadius: 14, padding: "14px 16px" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8", display: "block", marginBottom: 10 }}>📏 {a.measures_label} <span style={{ fontWeight: 400, color: "#64748B" }}>({a.measures_hint})</span></label>
              <select value={measureCategory} onChange={e => { setMeasureCategory(e.target.value); setMeasures({}); }} style={{ ...inp, background: "#fff", marginBottom: measureCategory ? 12 : 0 }}>
                <option value="">{a.measures_ph}</option>
                {Object.keys(MEASURE_FIELDS).map(cat => <option key={cat}>{cat}</option>)}
              </select>
              {measureCategory && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {MEASURE_FIELDS[measureCategory].map(field => (
                    <div key={field}>
                      <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 4 }}>{field}</label>
                      <input type="number" value={measures[field] || ""} onChange={e => setMeasure(field, e.target.value)} placeholder="—" style={{ ...inp, padding: "8px 12px" }} />
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
              {loading ? a.generating : a.generate_btn}
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
              <button onClick={reset} style={{ fontSize: 13, color: "#666", background: "#F3F4F6", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontFamily: "inherit" }}>{a.back}</button>
            </div>

            <div style={{ background: "#111", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🎯</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{a.ai_title}</p>
                <p style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>{a.ai_text}</p>
              </div>
            </div>

            {buildMeasuresText() && (
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 13, color: "#1D4ED8", margin: 0 }}>📏 {buildMeasuresText()}</p>
                <button onClick={() => copy("measures", buildMeasuresText())} style={{ fontSize: 11, color: "#1D4ED8", background: "transparent", border: "1px solid #BFDBFE", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 10 }}>
                  {copied["measures"] ? a.copied : a.copy}
                </button>
              </div>
            )}

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

                {[[a.title_l, "title", result.title], [a.desc_l, "desc", result.description]].map(([label, key, value]) => (
                  <div key={key} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>{label}</span>
                      <button onClick={() => copy(key, value)} style={{ fontSize: 12, color: "#555", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                        {copied[key] ? a.copied : a.copy}
                      </button>
                    </div>
                    <p style={{ fontSize: key === "title" ? 15 : 13, fontWeight: key === "title" ? 700 : 400, color: "#111", lineHeight: 1.7 }}>{value}</p>
                  </div>
                ))}

                <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 10 }}>{a.kw_l}</p>
                  <div>{result.keywords?.map(k => (
                    <span key={k} style={{ display: "inline-block", fontSize: 12, padding: "4px 10px", background: "#F3F4F6", borderRadius: 20, margin: "0 4px 6px 0", color: "#444" }}>#{k}</span>
                  ))}</div>
                </div>

                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#92400E", letterSpacing: 0.5, marginBottom: 10 }}>{a.tips_l}</p>
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
