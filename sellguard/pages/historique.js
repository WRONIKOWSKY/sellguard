import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";
import { useState, useEffect } from "react";

const PLATFORM_STYLE = {
  "Vinted":               { bg: "#E6F9FA", color: "#09B1BA" },
  "Depop":                { bg: "#FFF0F0", color: "#FF0000" },
  "Grailed":              { bg: "#F5F5F5", color: "#000000" },
  "Vestiaire Collective": { bg: "#F5F0EB", color: "#1A1A1A" },
  "Etsy":                 { bg: "#FFF3EE", color: "#F1641E" },
};

export function saveToHistory(result, condition, lang) {
  try {
    const history = JSON.parse(localStorage.getItem("sg_history") || "[]");
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleString("fr-FR"),
      lang: lang || "fr",
      item_name: result.item_name,
      item_category: result.item_category,
      condition,
      best_platform: result.best_platform,
      platforms: result.platforms,
      title: result.title,
      description: result.description,
      keywords: result.keywords,
      selling_tips: result.selling_tips,
      time_to_sell: result.time_to_sell,
    };
    const updated = [entry, ...history].slice(0, 20);
    localStorage.setItem("sg_history", JSON.stringify(updated));
  } catch(e) {}
}

export default function Historique() {
  const { lang } = useLang();
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState({});

  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem("sg_history") || "[]");
      setHistory(h);
    } catch(e) {}
  }, []);

  function deleteEntry(id) {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem("sg_history", JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  }

  function clearAll() {
    setHistory([]);
    setSelected(null);
    localStorage.removeItem("sg_history");
  }

  function copy(key, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(c => ({ ...c, [key]: true }));
      setTimeout(() => setCopied(c => ({ ...c, [key]: false })), 1500);
    });
  }

  const title = lang === "en" ? "My listings" : "Mes annonces";
  const empty_title = lang === "en" ? "No listings yet" : "Pas encore d'annonces";
  const empty_sub = lang === "en" ? "Generate your first listing in the Listing tab." : "Génère ta première annonce dans l'onglet Annonce.";
  const clear_btn = lang === "en" ? "Clear all" : "Tout effacer";
  const delete_btn = lang === "en" ? "Delete" : "Supprimer";
  const back_btn = lang === "en" ? "← Back" : "← Retour";
  const copy_btn = lang === "en" ? "Copy" : "Copier";
  const copied_btn = lang === "en" ? "Copied ✓" : "Copié ✓";
  const title_l = lang === "en" ? "TITLE" : "TITRE";
  const desc_l = lang === "en" ? "DESCRIPTION" : "DESCRIPTION";
  const kw_l = lang === "en" ? "KEYWORDS" : "MOTS-CLÉS";
  const tips_l = lang === "en" ? "TIPS" : "CONSEILS";

  if (selected) {
    const best = selected.platforms?.find(p => p.name === selected.best_platform) || selected.platforms?.[0];
    return (
      <>
        <Head><title>SellGuard — {selected.item_name}</title></Head>
        <Layout>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>{selected.item_name}</h2>
              <p style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{selected.item_category} · {selected.date}</p>
            </div>
            <button onClick={() => setSelected(null)} style={{ fontSize: 13, color: "#666", background: "#F3F4F6", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontFamily: "inherit" }}>{back_btn}</button>
          </div>

          {best && (
            <div style={{ background: PLATFORM_STYLE[best.name]?.bg || "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: "#fff", color: PLATFORM_STYLE[best.name]?.color || "#333" }}>{best.name}</span>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>{best.price_min}–{best.price_max}€</p>
              </div>
            </div>
          )}

          {[[title_l, "title", selected.title], [desc_l, "desc", selected.description]].map(([label, key, value]) => (
            <div key={key} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>{label}</span>
                <button onClick={() => copy(key, value)} style={{ fontSize: 12, color: "#555", background: "#F3F4F6", border: "none", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit" }}>
                  {copied[key] ? copied_btn : copy_btn}
                </button>
              </div>
              <p style={{ fontSize: key === "title" ? 15 : 13, fontWeight: key === "title" ? 700 : 400, color: "#111", lineHeight: 1.7 }}>{value}</p>
            </div>
          ))}

          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: 0.5, marginBottom: 10 }}>{kw_l}</p>
            <div>{selected.keywords?.map(k => (
              <span key={k} style={{ display: "inline-block", fontSize: 12, padding: "4px 10px", background: "#F3F4F6", borderRadius: 20, margin: "0 4px 6px 0", color: "#444" }}>#{k}</span>
            ))}</div>
          </div>

          {selected.selling_tips?.length > 0 && (
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#92400E", letterSpacing: 0.5, marginBottom: 10 }}>{tips_l}</p>
              {selected.selling_tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < selected.selling_tips.length - 1 ? 8 : 0 }}>
                  <span style={{ color: "#D97706", flexShrink: 0 }}>·</span>
                  <p style={{ fontSize: 13, color: "#555", lineHeight: 1.5 }}>{tip}</p>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => deleteEntry(selected.id)} style={{ width: "100%", padding: 12, fontSize: 13, fontWeight: 600, borderRadius: 12, border: "1px solid #FECACA", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontFamily: "inherit" }}>
            🗑️ {delete_btn}
          </button>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head><title>SellGuard — {title}</title></Head>
      <Layout>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111" }}>📋 {title}</h2>
            {history.length > 0 && (
              <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
                {history.length} {lang === "en" ? `listing${history.length > 1 ? "s" : ""} generated` : `annonce${history.length > 1 ? "s" : ""} générée${history.length > 1 ? "s" : ""}`}
              </p>
            )}
          </div>
          {history.length > 0 && (
            <button onClick={clearAll} style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: "inherit" }}>
              {clear_btn}
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 8 }}>{empty_title}</p>
            <p style={{ fontSize: 14, color: "#888" }}>{empty_sub}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {history.map(entry => {
              const best = entry.platforms?.find(p => p.name === entry.best_platform) || entry.platforms?.[0];
              return (
                <div key={entry.id} onClick={() => setSelected(entry)}
                  style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.item_name}</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      {best && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: PLATFORM_STYLE[best.name]?.bg || "#F3F4F6", color: PLATFORM_STYLE[best.name]?.color || "#555" }}>{best.name}</span>}
                      {best && <span style={{ fontSize: 12, color: "#888" }}>{best.price_min}–{best.price_max}€</span>}
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: entry.lang === "en" ? "#EFF6FF" : "#F0FDF4", color: entry.lang === "en" ? "#1D4ED8" : "#15803D" }}>{(entry.lang || "fr").toUpperCase()}</span>
                      <span style={{ fontSize: 11, color: "#bbb" }}>{entry.date}</span>
                    </div>
                  </div>
                  <span style={{ color: "#ccc", fontSize: 18, flexShrink: 0 }}>→</span>
                </div>
              );
            })}
          </div>
        )}
      </Layout>
    </>
  );
}
