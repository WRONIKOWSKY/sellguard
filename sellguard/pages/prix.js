import { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";

const PLATFORM_COLORS = {
  "Vinted": { bg: "rgba(9,177,186,0.1)", text: "#2E7D32" },
  "Depop": { bg: "rgba(255,0,0,0.08)", text: "#C62828" },
  "Grailed": { bg: "rgba(56,189,248,0.1)", text: "#1565C0" },
  "Vestiaire Collective": { bg: "rgba(106,27,154,0.15)", text: "#6A1B9A" },
  "eBay": { bg: "rgba(230,81,0,0.1)", text: "#E65100" },
  "Leboncoin": { bg: "rgba(245,127,23,0.1)", text: "#F57F17" },
  "Rakuten": { bg: "rgba(40,53,147,0.15)", text: "#283593" },
  "Etsy": { bg: "rgba(191,54,12,0.1)", text: "#BF360C" },
  "Facebook Marketplace": { bg: "rgba(56,189,248,0.1)", text: "#1565C0" },
};

export default function Prix() {
  var ref = useLang(), lang = ref.lang, t = ref.t;
  var a = t.prix;
  var _s1 = useState(""), item = _s1[0], setItem = _s1[1];
  var _s2 = useState(a.conditions[2]), cond = _s2[0], setCond = _s2[1];
  var _s3 = useState(false), loading = _s3[0], setLoading = _s3[1];
  var _s4 = useState(null), result = _s4[0], setResult = _s4[1];
  var _s5 = useState(""), error = _s5[0], setError = _s5[1];

  function search() {
    if (!item.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    fetch("/api/prix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: item, condition: cond, lang: lang })
    })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) throw new Error(data.error);
        setResult(data);
      })
      .catch(function(e) { setError(e.message); })
      .finally(function() { setLoading(false); });
  }

  function reset() {
    setResult(null);
    setItem("");
    setError("");
  }

  var demandColor = { haute: "#16A34A", moyenne: "#D97706", basse: "#DC2626", high: "#16A34A", medium: "#D97706", low: "#DC2626" };
  var trendIcon = { hausse: "↗", stable: "↔", baisse: "↘", rising: "↗", declining: "↘" };

  return (
    <>
      <Head><title>SellGuard - {a.title}</title></Head>
      <Layout>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>{a.title}</h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", marginBottom: 24 }}>{a.subtitle}</p>

        {!result ? (
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 6 }}>{a.item_label}</label>
            <input
              value={item}
              onChange={function(e) { setItem(e.target.value); }}
              onKeyDown={function(e) { if (e.key === "Enter") search(); }}
              placeholder={a.item_ph}
              style={{ width: "100%", padding: "14px 16px", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 16 }}
            />

            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", display: "block", marginBottom: 6 }}>{a.condition_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              {a.conditions.map(function(c) {
                return (
                  <button
                    key={c}
                    onClick={function() { setCond(c); }}
                    style={{
                      fontSize: 12, padding: "8px 14px", borderRadius: 20, border: "0.5px solid " + (cond === c ? "#818CF8" : "rgba(255,255,255,0.1)"),
                      background: cond === c ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.03)", color: cond === c ? "#818CF8" : "rgba(255,255,255,0.5)",
                      cursor: "pointer", fontFamily: "inherit", fontWeight: 500
                    }}
                  >{c}</button>
                );
              })}
            </div>

            <button
              onClick={search}
              disabled={!item.trim() || loading}
              style={{
                width: "100%", padding: "16px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700,
                background: loading ? "rgba(255,255,255,0.06)" : "#fff", color: loading ? "rgba(255,255,255,0.25)" : "#000",
                cursor: loading ? "default" : "pointer", fontFamily: "inherit"
              }}
            >{loading ? a.searching : a.search_btn}</button>

            {error && (
              <div style={{ marginTop: 14, background: "rgba(220,38,38,0.08)", border: "0.5px solid rgba(220,38,38,0.2)", borderRadius: 12, padding: 14, fontSize: 13, color: "#991B1B" }}>
                {error}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 14 }}>{result.item_name}</h2>

              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, background: "rgba(34,197,94,0.06)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", marginBottom: 4 }}>{a.range}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }}>{result.price_min} - {result.price_max}€</p>
                </div>
                <div style={{ flex: 1, background: "rgba(99,102,241,0.08)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.42)", marginBottom: 4 }}>{a.avg}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#2563EB" }}>{result.price_optimal}€</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>{lang === "en" ? "Demand" : "Demande"}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: demandColor[result.demand] || "#333" }}>
                    {result.demand ? result.demand.charAt(0).toUpperCase() + result.demand.slice(1) : "-"}
                  </span>
                </div>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>{lang === "en" ? "Trend" : "Tendance"}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                    {trendIcon[result.trend] || ""} {result.trend ? result.trend.charAt(0).toUpperCase() + result.trend.slice(1) : "-"}
                  </span>
                </div>
              </div>

              {result.trend_detail && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, background: "rgba(251,146,60,0.06)", borderRadius: 10, padding: "10px 14px", marginBottom: 0 }}>
                  {result.trend_detail}
                </p>
              )}
            </div>

            <div style={{ background: "#0A0A0A", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: 0.5, marginBottom: 14 }}>
                {lang === "en" ? "PRICE BY PLATFORM" : "PRIX PAR PLATEFORME"}
              </p>
              {(result.platforms || []).map(function(p, i) {
                var col = PLATFORM_COLORS[p.name] || { bg: "#F3F4F6", text: "#333" };
                return (
                  <div key={p.name} style={{ padding: "12px 0", borderBottom: i < result.platforms.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: col.bg, color: col.text }}>{p.name}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{p.avg_price}€</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{p.price_min} - {p.price_max}€</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>{p.sell_time}</span>
                    </div>
                    {p.tip && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, lineHeight: 1.4 }}>{p.tip}</p>}
                  </div>
                );
              })}
            </div>

            {result.advice && (
              <div style={{ background: "rgba(251,146,60,0.06)", border: "0.5px solid rgba(251,146,60,0.2)", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#92400E", letterSpacing: 0.5, marginBottom: 6 }}>{a.tip}</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{result.advice}</p>
              </div>
            )}

            <button
              onClick={reset}
              style={{ width: "100%", padding: "16px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700, background: "#0A0A0A", color: "#000", cursor: "pointer", fontFamily: "inherit" }}
            >{a.back}</button>
          </div>
        )}
      </Layout>
    </>
  );
}
