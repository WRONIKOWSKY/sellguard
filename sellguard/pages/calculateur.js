import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";
import { useState } from "react";

const PLATFORM_FEES = {
  "Vinted":               { commission: 0, buyerFee: 0.05, fixed: 0.70, color: "#09B1BA", bg: "#E6F9FA" },
  "Depop":                { commission: 0.10, buyerFee: 0, fixed: 0, color: "#FF0000", bg: "#FFF0F0" },
  "Grailed":              { commission: 0.09, buyerFee: 0, fixed: 0, color: "#000000", bg: "#F5F5F5" },
  "Vestiaire Collective": { commission: 0.12, buyerFee: 0, fixed: 0, color: "#1A1A1A", bg: "#F5F0EB" },
  "Etsy":                 { commission: 0.065, buyerFee: 0, fixed: 0.20, color: "#F1641E", bg: "#FFF3EE" },
};

export default function Calculateur() {
  const { lang } = useLang();
  const [buyPrice, setBuyPrice] = useState("");
  const [costs, setCosts] = useState("");
  const [targetMargin, setTargetMargin] = useState("30");
  const [results, setResults] = useState(null);

  const t = {
    title: lang === "en" ? "Price Calculator" : "Calculateur de Prix",
    subtitle: lang === "en" ? "Find the optimal selling price on each platform to hit your target margin." : "Trouve le prix de vente optimal sur chaque plateforme pour atteindre ta marge cible.",
    buy_label: lang === "en" ? "Purchase price (€)" : "Prix d'achat (€)",
    buy_ph: lang === "en" ? "Ex: 15" : "Ex: 15",
    costs_label: lang === "en" ? "Additional costs (€)" : "Frais supplémentaires (€)",
    costs_hint: lang === "en" ? "cleaning, transport, packaging..." : "nettoyage, transport, emballage...",
    costs_ph: "Ex: 3",
    margin_label: lang === "en" ? "Target margin (%)" : "Marge cible (%)",
    calc_btn: lang === "en" ? "Calculate →" : "Calculer →",
    min_price: lang === "en" ? "Min. price" : "Prix min.",
    recommended: lang === "en" ? "Recommended" : "Recommandé",
    your_margin: lang === "en" ? "Your margin" : "Ta marge",
    platform_fee: lang === "en" ? "Platform fees" : "Frais plateforme",
    net_profit: lang === "en" ? "Net profit" : "Bénéfice net",
    break_even: lang === "en" ? "Break-even" : "Seuil rentabilité",
    tip_title: lang === "en" ? "💡 Tips" : "💡 Conseils",
    tip1: lang === "en" ? "Vinted is the only platform with zero seller fees — buyers pay the protection fee." : "Vinted est la seule plateforme sans commission vendeur — c'est l'acheteur qui paye la protection.",
    tip2: lang === "en" ? "Price 10-15% higher on Vestiaire and Grailed — their buyers expect premium pricing." : "Prix 10-15% plus élevé sur Vestiaire et Grailed — leur audience accepte des prix premium.",
    tip3: lang === "en" ? "On Vinted, include shipping in your price for better conversion." : "Sur Vinted, inclure les frais de port dans ton prix améliore le taux de conversion.",
  };

  function calculate() {
    const buy = parseFloat(buyPrice) || 0;
    const extra = parseFloat(costs) || 0;
    const margin = parseFloat(targetMargin) / 100 || 0.30;
    const totalCost = buy + extra;

    const res = Object.entries(PLATFORM_FEES).map(([name, fees]) => {
      // Break-even price (cover costs + platform fees)
      let breakEven;
      if (fees.commission > 0) {
        breakEven = (totalCost + fees.fixed) / (1 - fees.commission);
      } else {
        breakEven = totalCost + fees.fixed;
      }

      // Recommended price to hit target margin
      let recommended;
      if (fees.commission > 0) {
        recommended = (totalCost * (1 + margin) + fees.fixed) / (1 - fees.commission);
      } else {
        recommended = totalCost * (1 + margin) + fees.fixed;
      }

      // Round up to nearest 0.50
      recommended = Math.ceil(recommended * 2) / 2;
      breakEven = Math.ceil(breakEven * 2) / 2;

      // Calculate actual margin at recommended price
      const platformFee = recommended * fees.commission + fees.fixed;
      const netProfit = recommended - totalCost - platformFee;
      const actualMargin = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

      return {
        name,
        breakEven: breakEven.toFixed(2),
        recommended: recommended.toFixed(2),
        platformFee: platformFee.toFixed(2),
        netProfit: netProfit.toFixed(2),
        actualMargin: actualMargin.toFixed(0),
        color: fees.color,
        bg: fees.bg,
        commissionPct: Math.round(fees.commission * 100),
      };
    });

    setResults({ totalCost: totalCost.toFixed(2), platforms: res });
  }

  const inp = { width: "100%", padding: "10px 12px", fontSize: 15, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" };

  return (
    <>
      <Head><title>SellGuard — {t.title}</title></Head>
      <Layout>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>💰 {t.title}</h2>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{t.subtitle}</p>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px 20px", marginBottom: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{t.buy_label}</label>
            <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder={t.buy_ph} style={inp} min="0" step="0.5" />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>
              {t.costs_label} <span style={{ fontWeight: 400, color: "#999" }}>({t.costs_hint})</span>
            </label>
            <input type="number" value={costs} onChange={e => setCosts(e.target.value)} placeholder={t.costs_ph} style={inp} min="0" step="0.5" />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 10 }}>
              {t.margin_label} — <span style={{ color: "#2563EB", fontWeight: 700 }}>{targetMargin}%</span>
            </label>
            <input type="range" min="10" max="200" value={targetMargin} onChange={e => setTargetMargin(e.target.value)}
              style={{ width: "100%", accentColor: "#111" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#aaa", marginTop: 4 }}>
              <span>10%</span><span>50%</span><span>100%</span><span>200%</span>
            </div>
          </div>

          <button onClick={calculate} disabled={!buyPrice}
            style={{ width: "100%", padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 12, border: "none", background: !buyPrice ? "#E5E7EB" : "#111", color: !buyPrice ? "#999" : "#fff", cursor: !buyPrice ? "default" : "pointer", fontFamily: "inherit" }}>
            {t.calc_btn}
          </button>
        </div>

        {results && (
          <>
            <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{lang === "en" ? "Total cost" : "Coût total"}</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>{results.totalCost}€</p>
              </div>
              <div style={{ width: 1, background: "#E5E7EB" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>{lang === "en" ? "Target margin" : "Marge cible"}</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#2563EB" }}>{targetMargin}%</p>
              </div>
            </div>

            {results.platforms.map((pl, i) => (
              <div key={pl.name} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 18px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: pl.bg, color: pl.color }}>
                    {pl.name}
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "#111" }}>{pl.recommended}€</p>
                    <p style={{ fontSize: 11, color: "#888" }}>{t.recommended}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    [t.net_profit, `${pl.netProfit}€`, parseFloat(pl.netProfit) >= 0 ? "#15803D" : "#DC2626"],
                    [t.your_margin, `${pl.actualMargin}%`, parseFloat(pl.actualMargin) >= 20 ? "#15803D" : "#D97706"],
                    [t.platform_fee, `${pl.platformFee}€`, "#888"],
                  ].map(([label, value, color]) => (
                    <div key={label} style={{ background: "#F9FAFB", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                      <p style={{ fontSize: 10, color: "#888", marginBottom: 3 }}>{label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 10, padding: "6px 10px", background: "#F9FAFB", borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "#888" }}>{t.break_even}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#555" }}>{pl.breakEven}€</span>
                </div>
              </div>
            ))}

            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "14px 18px", marginTop: 6 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 10 }}>{t.tip_title}</p>
              {[t.tip1, t.tip2, t.tip3].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < 2 ? 8 : 0 }}>
                  <span style={{ color: "#D97706", flexShrink: 0 }}>·</span>
                  <p style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>{tip}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </Layout>
    </>
  );
}
