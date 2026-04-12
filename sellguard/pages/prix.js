import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";
import { useState } from "react";

const PLATFORM_STYLE = {
  "Vinted":               { color: "#09B1BA", bg: "#E6F9FA" },
  "Depop":                { color: "#FF0000", bg: "#FFF0F0" },
  "Grailed":              { color: "#000000", bg: "#F5F5F5" },
  "Vestiaire Collective": { color: "#1A1A1A", bg: "#F5F0EB" },
  "Etsy":                 { color: "#F1641E", bg: "#FFF3EE" },
};

const CONDITIONS = {
  fr: ["Neuf avec étiquette", "Neuf sans étiquette", "Très bon état", "Bon état", "Satisfaisant"],
  en: ["New with tags", "New without tags", "Very good condition", "Good condition", "Fair condition"],
};

export default function Prix() {
  const { lang } = useLang();
  const [item, setItem] = useState("");
  const [condition, setCondition] = useState(CONDITIONS[lang]?.[2] || "Très bon état");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const t = {
    title: lang === "en" ? "Market Price Analysis" : "Analyse des Prix du Marché",
    subtitle: lang === "en" ? "Get real-time pricing insights for any fashion item based on current market data." : "Obtiens une analyse des prix en temps réel pour n'importe quel article de mode.",
    item_label: lang === "en" ? "Item to analyze" : "Article à analyser",
    item_ph: lang === "en" ? "Ex: Supreme Box Logo Hoodie Black L" : "Ex: Supreme Box Logo Hoodie Noir Taille L",
    condition_label: lang === "en" ? "Condition" : "État",
    analyze_btn: lang === "en" ? "Analyze market →" : "Analyser le marché →",
    analyzing: lang === "en" ? "Analyzing..." : "Analyse en cours...",
    market_range: lang === "en" ? "Market range" : "Fourchette marché",
    sweet_spot: lang === "en" ? "Optimal price" : "Prix optimal",
    demand: lang === "en" ? "Demand" : "Demande",
    trend: lang === "en" ? "Trend" : "Tendance",
    demand_high: lang === "en" ? "High 🔥" : "Forte 🔥",
    demand_medium: lang === "en" ? "Medium" : "Moyenne",
    demand_low: lang === "en" ? "Low" : "Faible",
    trend_up: lang === "en" ? "Rising ↑" : "En hausse ↑",
    trend_stable: lang === "en" ? "Stable →" : "Stable →",
    trend_down: lang === "en" ? "Falling ↓" : "En baisse ↓",
    by_platform: lang === "en" ? "BY PLATFORM" : "PAR PLATEFORME",
    time_to_sell: lang === "en" ? "Time to sell" : "Délai de vente",
    factors: lang === "en" ? "PRICE FACTORS" : "FACTEURS DE PRIX",
    verdict: lang === "en" ? "MARKET VERDICT" : "VERDICT DU MARCHÉ",
    new_search: lang === "en" ? "New analysis" : "Nouvelle analyse",
    ai_note: lang === "en" ? "Analysis based on AI market knowledge — prices may vary." : "Analyse basée sur la connaissance IA du marché — les prix peuvent varier.",
  };

  async function analyze() {
    if (!item.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/prix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item, condition, lang })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setResult(data);
    } catch(e) {
      const msg = e.message || "";
      if (msg.includes("fetch") || msg.includes("Network")) {
        setError(lang === "en" ? "Connection error. Check your internet." : "Erreur de connexion. Vérifie ta connexion internet.");
      } else {
        setError(lang === "en" ? "An error occurred. Please try again." : "Une erreur est survenue. Réessaie.");
      }
    }
    setLoading(false);
  }

  const inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" };

  const demandColor = result?.demand === "high" ? "#15803D" : result?.demand === "medium" ? "#D97706" : "#DC2626";
  const trendColor = result?.trend === "up" ? "#15803D" : result?.trend === "stable" ? "#555" : "#DC2626";
  const demandLabel = result?.demand === "high" ? t.demand_high : result?.demand === "medium" ? t.demand_medium : t.demand_low;
  const trendLabel = result?.trend === "up" ? t.trend_up : result?.trend === "stable" ? t.trend_stable : t.trend_down;

  return (
    <>
      <Head><title>SellGuard — {t.title}</title></Head>
      <Layout>
        {!result ? (
          <>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>📈 {t.title}</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{t.subtitle}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{t.item_label}</label>
              <textarea value={item} onChange={e => setItem(e.target.value)} rows={2} placeholder={t.item_ph}
                style={{ ...inp, resize: "none", lineHeight: 1.6, padding: "10px 12px" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{t.condition_label}</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} style={inp}>
                {(CONDITIONS[lang] || CONDITIONS.fr).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <button onClick={analyze} disabled={loading || !item.trim()}
              style={{ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: !item.trim() ? "#E5E7EB" : "#111", color: !item.trim() ? "#999" : "#fff", cursor: loading ? "default" : "pointer", fontFamily: "inherit" }}>
              {loading ? t.analyzing : t.analyze_btn}
            </button>

            {error && <div style={{ marginTop: 12, padding: 12, background: "#FEF2F2", borderRadius: 10, fontSize: 13, color: "#DC2626" }}>{error}</div>}
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 4 }}>{item}</h2>
                <p style={{ fontSize: 13, color: "#888" }}>{condition}</p>
              </div>
              <button onClick={() => { setResult(null); setItem(""); }}
                style={{ fontSize: 13, color: "#666", background: "#F3F4F6", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 12 }}>
                {t.new_search}
              </button>
            </div>

            {/* Main stats */}
            <div style={{ background: "#111", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{t.market_range}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{result.market_price_min}€ — {result.market_price_max}€</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "#666", marginBottom: 4 }}>{t.sweet_spot}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#00FF88" }}>{result.sweet_spot}€</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>{t.demand}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: demandColor }}>{demandLabel}</p>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "#666", marginBottom: 2 }}>{t.trend}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: trendColor }}>{trendLabel}</p>
                </div>
              </div>
            </div>

            {/* By platform */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 14 }}>{t.by_platform}</p>
              {result.platforms?.map((pl, i) => (
                <div key={pl.name} style={{ paddingBottom: i < result.platforms.length - 1 ? 14 : 0, marginBottom: i < result.platforms.length - 1 ? 14 : 0, borderBottom: i < result.platforms.length - 1 ? "1px solid #F9FAFB" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: PLATFORM_STYLE[pl.name]?.bg || "#F3F4F6", color: PLATFORM_STYLE[pl.name]?.color || "#555" }}>{pl.name}</span>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>{pl.price_min}€ — {pl.price_max}€</p>
                      <p style={{ fontSize: 11, color: "#888" }}>{t.time_to_sell} : {pl.avg_time_to_sell}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{pl.tips}</p>
                </div>
              ))}
            </div>

            {/* Price factors */}
            {result.price_factors?.length > 0 && (
              <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 12 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 10 }}>{t.factors}</p>
                {result.price_factors.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < result.price_factors.length - 1 ? 8 : 0 }}>
                    <span style={{ color: "#D97706", flexShrink: 0 }}>·</span>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{f}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Verdict */}
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 14, padding: "14px 18px", marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", letterSpacing: 0.5, marginBottom: 8 }}>{t.verdict}</p>
              <p style={{ fontSize: 13, color: "#1E40AF", lineHeight: 1.6 }}>{result.verdict}</p>
            </div>

            <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", lineHeight: 1.5 }}>{t.ai_note}</p>
          </>
        )}
      </Layout>
    </>
  );
}
