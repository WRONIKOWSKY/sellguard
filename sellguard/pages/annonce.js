import { useState, useRef } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";
import { saveToHistory } from "./historique";

var PLATFORM_STYLE = {
  "Vinted":               { bg: "rgba(9,177,186,0.1)", color: "#09B1BA", font: "'Georgia', cursive", weight: 700, transform: "none", spacing: "0px" },
  "Depop":                { bg: "rgba(255,0,0,0.08)", color: "#FF0000", font: "'Arial Black', sans-serif", weight: 800, transform: "none", spacing: "-0.5px" },
  "Grailed":              { bg: "rgba(255,255,255,0.06)", color: "#fff", font: "'Arial Narrow', 'Arial', sans-serif", weight: 700, transform: "uppercase", spacing: "2px" },
  "Vestiaire Collective": { bg: "rgba(255,255,255,0.05)", color: "#ccc", font: "'Georgia', 'Times New Roman', serif", weight: 700, transform: "none", spacing: "0.5px" },
  "Etsy":                 { bg: "rgba(241,100,30,0.08)", color: "#F1641E", font: "'Helvetica Neue', sans-serif", weight: 600, transform: "none", spacing: "0px" },
};

var MEASURE_FIELDS_FR = {
  "Haut / T-shirt": ["Poitrine (cm)", "Épaules (cm)", "Longueur dos (cm)", "Manches (cm)"],
  "Veste / Manteau": ["Épaules (cm)", "Poitrine (cm)", "Taille (cm)", "Longueur dos (cm)", "Manches (cm)"],
  "Pantalon / Jean": ["Tour de taille (cm)", "Tour de hanches (cm)", "Longueur jambe (cm)", "Entrejambe (cm)"],
  "Robe / Jupe": ["Poitrine (cm)", "Taille (cm)", "Hanches (cm)", "Longueur (cm)"],
  "Chaussures": ["Pointure EU", "Longueur semelle (cm)"],
  "Accessoire / Sac": ["Longueur (cm)", "Hauteur (cm)", "Largeur (cm)"],
};

var MEASURE_FIELDS_EN = {
  "Top / T-shirt": ["Chest (cm)", "Shoulders (cm)", "Back length (cm)", "Sleeves (cm)"],
  "Jacket / Coat": ["Shoulders (cm)", "Chest (cm)", "Waist (cm)", "Back length (cm)", "Sleeves (cm)"],
  "Pants / Jeans": ["Waist (cm)", "Hips (cm)", "Leg length (cm)", "Inseam (cm)"],
  "Dress / Skirt": ["Chest (cm)", "Waist (cm)", "Hips (cm)", "Length (cm)"],
  "Shoes": ["EU Size", "Sole length (cm)"],
  "Accessory / Bag": ["Length (cm)", "Height (cm)", "Width (cm)"],
};

export default function Annonce() {
  var ref = useLang(), lang = ref.lang, t = ref.t;
  var a = t.annonce;
  var MEASURE_FIELDS = lang === "en" ? MEASURE_FIELDS_EN : MEASURE_FIELDS_FR;

  var _condition = useState(a.conditions[2]), condition = _condition[0], setCondition = _condition[1];
  var _extra = useState(""), extra = _extra[0], setExtra = _extra[1];
  var _images = useState([]), images = _images[0], setImages = _images[1];
  var _loading = useState(false), loading = _loading[0], setLoading = _loading[1];
  var _result = useState(null), result = _result[0], setResult = _result[1];
  var _error = useState(null), error = _error[0], setError = _error[1];
  var _activeTab = useState(null), activeTab = _activeTab[0], setActiveTab = _activeTab[1];
  var _copied = useState({}), copied = _copied[0], setCopied = _copied[1];
  var _measureCategory = useState(""), measureCategory = _measureCategory[0], setMeasureCategory = _measureCategory[1];
  var _measures = useState({}), measures = _measures[0], setMeasures = _measures[1];
  var fileRef = useRef();

  function handleFiles(fileList) {
    Array.from(fileList).forEach(function(file) {
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        setImages(function(prev) {
          return prev.concat([{ preview: e.target.result, base64: e.target.result.split(",")[1], mime: file.type || "image/jpeg", name: file.name }]);
        });
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index) {
    setImages(function(prev) { return prev.filter(function(_, i) { return i !== index; }); });
  }

  function setMeasure(field, value) {
    setMeasures(function(m) { var n = Object.assign({}, m); n[field] = value; return n; });
  }

  function buildMeasuresText() {
    if (!measureCategory) return "";
    var fields = MEASURE_FIELDS[measureCategory] || [];
    var filled = fields.filter(function(f) { return measures[f]; });
    if (!filled.length) return "";
    var prefix = lang === "en" ? "Measurements: " : "Mesures : ";
    return prefix + filled.map(function(f) { return f.replace(" (cm)", "").replace(" EU", "").replace(" (EU)", "") + " " + measures[f] + (f.toLowerCase().includes("eu") || f.toLowerCase().includes("size") ? "" : "cm"); }).join(", ");
  }

  async function analyze() {
    if (!images.length && !extra.trim()) return;
    setLoading(true); setError(null); setResult(null);
    var measuresText = buildMeasuresText();
    var fullExtra = [extra, measuresText].filter(Boolean).join(" — ");
    var imageBase64 = images.length > 0 ? images[0].base64 : null;
    var imageMime = images.length > 0 ? images[0].mime : "image/jpeg";

    try {
      var res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imageBase64, imageMime: imageMime, condition: condition, extra: fullExtra, lang: lang })
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setResult(data);
      setActiveTab(data.best_platform);
      saveToHistory(data, condition, lang);
      var cat = (data.item_category || "").toLowerCase();
      var fields = lang === "en" ? MEASURE_FIELDS_EN : MEASURE_FIELDS_FR;
      var autoMatch = Object.keys(fields).find(function(k) {
        var kl = k.toLowerCase();
        if (cat.includes("vest") || cat.includes("jacket") || cat.includes("manteau") || cat.includes("coat")) return kl.includes("vest") || kl.includes("jack") || kl.includes("mant");
        if (cat.includes("pant") || cat.includes("jean") || cat.includes("trouser")) return kl.includes("pant") || kl.includes("jean");
        if (cat.includes("robe") || cat.includes("dress") || cat.includes("jupe") || cat.includes("skirt")) return kl.includes("robe") || kl.includes("dress") || kl.includes("jupe");
        if (cat.includes("chaussure") || cat.includes("shoe") || cat.includes("sneaker") || cat.includes("boot")) return kl.includes("chaussure") || kl.includes("shoe");
        if (cat.includes("sac") || cat.includes("bag") || cat.includes("accessoire") || cat.includes("accessory")) return kl.includes("sac") || kl.includes("bag") || kl.includes("access");
        if (cat.includes("t-shirt") || cat.includes("top") || cat.includes("sweat") || cat.includes("pull") || cat.includes("shirt")) return kl.includes("haut") || kl.includes("top");
        return false;
      });
      if (autoMatch && !measureCategory) setMeasureCategory(autoMatch);
    } catch (e) {
      var msg = e.message || "";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        setError(lang === "en" ? "Connection error. Check your internet and try again." : "Erreur de connexion. Vérifie ta connexion internet et réessaie.");
      } else if (msg.includes("503") || msg.includes("overloaded")) {
        setError(lang === "en" ? "Server is busy. Wait a few seconds and try again." : "Le serveur est occupé. Attends quelques secondes et réessaie.");
      } else if (msg.includes("413") || msg.includes("too large")) {
        setError(lang === "en" ? "Photo is too large. Try with a lighter image." : "La photo est trop grande. Essaie avec une image plus légère.");
      } else {
        setError(lang === "en" ? "An error occurred. Please try again." : "Une erreur est survenue. Réessaie ou contacte le support.");
      }
    }
    setLoading(false);
  }

  function copy(key, text) {
    navigator.clipboard.writeText(text).then(function() {
      setCopied(function(c) { var n = Object.assign({}, c); n[key] = true; return n; });
      setTimeout(function() { setCopied(function(c) { var n = Object.assign({}, c); n[key] = false; return n; }); }, 1500);
    });
  }

  function reset() {
    setResult(null); setImages([]); setExtra(""); setError(null); setActiveTab(null);
    setMeasureCategory(""); setMeasures({}); setCondition(a.conditions[2]);
  }

  var activePlatform = result && result.platforms ? result.platforms.find(function(p) { return p.name === activeTab; }) : null;
  var inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#111", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#fff", boxSizing: "border-box" };

  return (
    <>
      <Head><title>SellGuard — {a.title}</title></Head>
      <Layout>
        {!result ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{"📦"} {a.title}</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)" }}>{a.subtitle}</p>
            </div>

            {/* MULTI-PHOTO UPLOAD */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>{a.photo_label}</label>
              <div onClick={function() { fileRef.current.click(); }} onDragOver={function(e) { e.preventDefault(); }} onDrop={function(e) { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                style={{ border: "1.5px dashed rgba(255,255,255,0.14)", borderRadius: 16, padding: images.length > 0 ? 12 : 28, cursor: "pointer", background: "#0A0A0A", textAlign: "center", minHeight: images.length > 0 ? "auto" : 130, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                {images.length === 0 ? (
                  <div>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>{"📷"}</div>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)" }}>{a.photo_hint}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", marginTop: 4 }}>{a.photo_sub}</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, width: "100%" }}>
                      {images.map(function(img, i) {
                        return (
                          <div key={i} style={{ position: "relative" }}>
                            <img src={img.preview} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 8, border: i === 0 ? "2px solid #2563EB" : "1px solid #E5E7EB" }} />
                            {i === 0 && <span style={{ position: "absolute", top: 2, left: 2, fontSize: 9, background: "#818CF8", color: "#fff", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>IA</span>}
                            <button onClick={function(e) { e.stopPropagation(); removeImage(i); }}
                              style={{ position: "absolute", top: -6, right: -6, width: 22, height: 22, borderRadius: "50%", background: "#DC2626", color: "#fff", border: "2px solid #fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 1 }}>
                              {"×"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>+ {lang === "en" ? "Add more photos" : "Ajouter d’autres photos"}</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={function(e) { handleFiles(e.target.files); }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>{a.condition_label}</label>
              <select value={condition} onChange={function(e) { setCondition(e.target.value); }} style={inp}>
                {a.conditions.map(function(c) { return <option key={c}>{c}</option>; })}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>{a.extra_label} <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.25)" }}>(optionnel)</span></label>
              <textarea value={extra} onChange={function(e) { setExtra(e.target.value); }} rows={2} placeholder={a.extra_ph} style={Object.assign({}, inp, { resize: "none", lineHeight: 1.6 })} />
            </div>

            <div style={{ marginBottom: 16, background: "rgba(99,102,241,0.05)", border: "0.5px solid rgba(99,102,241,0.15)", borderRadius: 14, padding: "14px 16px" }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8", display: "block", marginBottom: 10 }}>{"📏"} {a.measures_label} <span style={{ fontWeight: 400, color: "#64748B" }}>({a.measures_hint})</span></label>
              <select value={measureCategory} onChange={function(e) { setMeasureCategory(e.target.value); setMeasures({}); }} style={Object.assign({}, inp, { background: "#0A0A0A", marginBottom: measureCategory ? 12 : 0 })}>
                <option value="">{a.measures_ph}</option>
                {Object.keys(MEASURE_FIELDS).map(function(cat) { return <option key={cat}>{cat}</option>; })}
              </select>
              {measureCategory && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {MEASURE_FIELDS[measureCategory].map(function(field) {
                    return (
                      <div key={field}>
                        <label style={{ fontSize: 11, color: "#64748B", display: "block", marginBottom: 4 }}>{field}</label>
                        <input type="number" value={measures[field] || ""} onChange={function(e) { setMeasure(field, e.target.value); }} placeholder="—" style={Object.assign({}, inp, { padding: "8px 12px" })} />
                      </div>
                    );
                  })}
                </div>
              )}
              {measureCategory && buildMeasuresText() && (
                <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(99,102,241,0.08)", borderRadius: 8 }}>
                  <p style={{ fontSize: 12, color: "#1D4ED8", margin: 0 }}>{buildMeasuresText()}</p>
                </div>
              )}
            </div>

            <button onClick={analyze} disabled={loading || (!images.length && !extra.trim())}
              style={{ width: "100%", padding: 16, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: (!images.length && !extra.trim()) ? "rgba(255,255,255,0.06)" : "#fff", color: (!images.length && !extra.trim()) ? "rgba(255,255,255,0.25)" : "#000", cursor: loading ? "default" : "pointer", fontFamily: "inherit", marginBottom: 16 }}>
              {loading ? a.generating : a.generate_btn}
            </button>

            {error && <div style={{ marginTop: 0, padding: 12, background: "rgba(220,38,38,0.08)", borderRadius: 10, fontSize: 13, color: "#DC2626" }}>{error}</div>}
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{result.item_name}</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{result.item_category} · {condition}</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={function() {
                  var text = result.title + "\n\n" + result.description + "\n\n" + (buildMeasuresText() ? buildMeasuresText() + "\n\n" : "") + (result.keywords || []).map(function(k) { return "#" + k; }).join(" ");
                  if (navigator.share) { navigator.share({ title: result.item_name, text: text }); }
                  else { navigator.clipboard.writeText(text); alert(lang === "en" ? "Listing copied!" : "Annonce copiée !"); }
                }} style={{ fontSize: 13, color: "#2563EB", background: "rgba(99,102,241,0.08)", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit" }}>
                  {lang === "en" ? "Share" : "Partager"}
                </button>
                <button onClick={reset} style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontFamily: "inherit" }}>{a.back}</button>
              </div>
            </div>

            <div style={{ background: "#111", borderRadius: 14, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{"🎯"}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{a.ai_title}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.5 }}>{a.ai_text}</p>
              </div>
            </div>

            {buildMeasuresText() && (
              <div style={{ background: "rgba(99,102,241,0.08)", border: "0.5px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 13, color: "#1D4ED8", margin: 0 }}>{"📏"} {buildMeasuresText()}</p>
                <button onClick={function() { copy("measures", buildMeasuresText()); }} style={{ fontSize: 11, color: "#1D4ED8", background: "transparent", border: "0.5px solid rgba(99,102,241,0.2)", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 10 }}>
                  {copied["measures"] ? a.copied : a.copy}
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {(result.platforms || []).map(function(p) {
                var ps = PLATFORM_STYLE[p.name] || {};
                return (
                  <button key={p.name} onClick={function() { setActiveTab(p.name); }}
                    style={{ fontSize: 13, fontWeight: ps.weight || 600, padding: "7px 16px", borderRadius: 20, border: activeTab === p.name ? "1.5px solid rgba(255,255,255,0.5)" : "0.5px solid rgba(255,255,255,0.1)", background: activeTab === p.name ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)", color: activeTab === p.name ? "#fff" : (ps.color || "rgba(255,255,255,0.5)"), fontFamily: ps.font || "inherit", letterSpacing: ps.spacing || "0px", textTransform: ps.transform || "none", cursor: "pointer" }}>
                    {p.name === result.best_platform ? "⭐ " : ""}{p.name} · {p.price_min}-{p.price_max}€
                  </button>
                );
              })}
            </div>

            {activePlatform && (
              <div>
                <div style={{ background: (PLATFORM_STYLE[activePlatform.name] || {}).bg || "#F9FAFB", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 18px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: (PLATFORM_STYLE[activePlatform.name] || {}).weight || 600, padding: "4px 12px", borderRadius: 20, background: "#0A0A0A", color: (PLATFORM_STYLE[activePlatform.name] || {}).color || "#333", fontFamily: (PLATFORM_STYLE[activePlatform.name] || {}).font || "inherit", letterSpacing: (PLATFORM_STYLE[activePlatform.name] || {}).spacing || "0px", textTransform: (PLATFORM_STYLE[activePlatform.name] || {}).transform || "none" }}>{activePlatform.name}</span>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{activePlatform.price_min}–{activePlatform.price_max}€</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Score {activePlatform.score}/10 · {result.time_to_sell}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 10, lineHeight: 1.5 }}>{activePlatform.reason}</p>
                </div>

                {[[a.title_l, "title", result.title], [a.desc_l, "desc", result.description]].map(function(row) {
                  return (
                    <div key={row[1]} style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>{row[0]}</span>
                        <button onClick={function() { copy(row[1], row[2]); }} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                          {copied[row[1]] ? a.copied : a.copy}
                        </button>
                      </div>
                      <p style={{ fontSize: row[1] === "title" ? 15 : 13, fontWeight: row[1] === "title" ? 700 : 400, color: "#fff", lineHeight: 1.7 }}>{row[2]}</p>
                    </div>
                  );
                })}

                <div style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5, marginBottom: 10 }}>{a.kw_l}</p>
                  <div>{(result.keywords || []).map(function(k) {
                    return <span key={k} style={{ display: "inline-block", fontSize: 12, padding: "4px 10px", background: "rgba(255,255,255,0.06)", borderRadius: 20, margin: "0 4px 6px 0", color: "rgba(255,255,255,0.6)" }}>#{k}</span>;
                  })}</div>
                </div>

                <div style={{ background: "rgba(251,146,60,0.06)", border: "0.5px solid rgba(251,146,60,0.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#92400E", letterSpacing: 0.5, marginBottom: 10 }}>{a.tips_l}</p>
                  {(result.selling_tips || []).map(function(tip, i) {
                    return (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < (result.selling_tips || []).length - 1 ? 8 : 0 }}>
                        <span style={{ color: "#D97706", flexShrink: 0 }}>{"·"}</span>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{tip}</p>
                      </div>
                    );
                  })}
                </div>

                {(function() {
                  var msg = lang === "en"
                    ? "Thank you for your purchase! 🎉 Your parcel was carefully packed and filmed before shipping with SellGuard — timestamped video proof is kept in case of dispute. Enjoy your item! 📦"
                    : "Merci pour ton achat ! 🎉 Ton colis a été soigneusement emballé et filmé avant envoi avec SellGuard — une preuve vidéo horodatée est conservée en cas de litige. Bonne réception ! 📦";
                  return (
                    <div style={{ background: "rgba(34,197,94,0.06)", border: "0.5px solid rgba(34,197,94,0.2)", borderRadius: 14, padding: "14px 18px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#15803D", letterSpacing: 0.5 }}>{lang === "en" ? "MESSAGE FOR BUYER" : "MESSAGE POUR L'ACHETEUR"}</p>
                        <button onClick={function() { copy("buyermsg", msg); }} style={{ fontSize: 12, color: "#15803D", background: "#0A0A0A", border: "0.5px solid rgba(34,197,94,0.2)", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                          {copied["buyermsg"] ? (lang === "en" ? "Copied ✓" : "Copié ✓") : (lang === "en" ? "Copy" : "Copier")}
                        </button>
                      </div>
                      <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.7 }}>{msg}</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </Layout>
    </>
  );
}
