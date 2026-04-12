import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";
import { useState, useEffect } from "react";

const PLATFORM_STYLE = {
  "Vinted":               { color: "#09B1BA", bg: "#E6F9FA" },
  "Depop":                { color: "#FF0000", bg: "#FFF0F0" },
  "Grailed":              { color: "#000000", bg: "#F5F5F5" },
  "Vestiaire Collective": { color: "#1A1A1A", bg: "#F5F0EB" },
  "Etsy":                 { color: "#F1641E", bg: "#FFF3EE" },
  "Autre":                { color: "#6B7280", bg: "#F3F4F6" },
};

const PLATFORMS = ["Vinted", "Depop", "Grailed", "Vestiaire Collective", "Etsy", "Autre"];

export default function Ventes() {
  const { lang } = useLang();
  const [sales, setSales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ article: "", platform: "Vinted", salePrice: "", buyPrice: "", costs: "", date: new Date().toISOString().split("T")[0] });
  const [filter, setFilter] = useState("all");

  const t = {
    title: lang === "en" ? "Sales Tracker" : "Suivi des ventes",
    subtitle: lang === "en" ? "Track your sales, profits and performance by platform." : "Suis tes ventes, bénéfices et performances par plateforme.",
    add_btn: lang === "en" ? "+ Add a sale" : "+ Ajouter une vente",
    empty_title: lang === "en" ? "No sales yet" : "Pas encore de ventes",
    empty_sub: lang === "en" ? "Add your first sale to start tracking your profits." : "Ajoute ta première vente pour commencer à suivre tes bénéfices.",
    article: lang === "en" ? "Item name" : "Nom de l'article",
    article_ph: lang === "en" ? "Ex: Levi's 501 Taille M" : "Ex: Levi's 501 Taille M",
    platform: lang === "en" ? "Platform" : "Plateforme",
    sale_price: lang === "en" ? "Sale price (€)" : "Prix de vente (€)",
    buy_price: lang === "en" ? "Purchase price (€)" : "Prix d'achat (€)",
    costs: lang === "en" ? "Other costs (€)" : "Frais divers (€)",
    costs_hint: lang === "en" ? "shipping, packaging..." : "transport, emballage...",
    date: lang === "en" ? "Date" : "Date",
    save: lang === "en" ? "Save" : "Enregistrer",
    cancel: lang === "en" ? "Cancel" : "Annuler",
    total_sales: lang === "en" ? "Total sales" : "Ventes totales",
    total_profit: lang === "en" ? "Total profit" : "Bénéfice total",
    avg_margin: lang === "en" ? "Avg margin" : "Marge moy.",
    best_platform: lang === "en" ? "Best platform" : "Meilleure plateforme",
    profit: lang === "en" ? "Profit" : "Bénéfice",
    margin: lang === "en" ? "Margin" : "Marge",
    delete: lang === "en" ? "Delete" : "Supprimer",
    all: lang === "en" ? "All" : "Tout",
    filter_label: lang === "en" ? "Filter by platform" : "Filtrer par plateforme",
    clear: lang === "en" ? "Clear all" : "Tout effacer",
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sg_sales") || "[]");
      setSales(saved);
    } catch(e) {}
  }, []);

  function saveSales(updated) {
    setSales(updated);
    localStorage.setItem("sg_sales", JSON.stringify(updated));
  }

  function addSale() {
    if (!form.article.trim() || !form.salePrice) return;
    const sale = {
      id: Date.now(),
      article: form.article,
      platform: form.platform,
      salePrice: parseFloat(form.salePrice) || 0,
      buyPrice: parseFloat(form.buyPrice) || 0,
      costs: parseFloat(form.costs) || 0,
      date: form.date,
    };
    sale.profit = sale.salePrice - sale.buyPrice - sale.costs;
    sale.margin = sale.buyPrice > 0 ? ((sale.profit / sale.buyPrice) * 100).toFixed(0) : 0;
    saveSales([sale, ...sales]);
    setForm({ article: "", platform: "Vinted", salePrice: "", buyPrice: "", costs: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
  }

  function deleteSale(id) {
    saveSales(sales.filter(s => s.id !== id));
  }

  const filtered = filter === "all" ? sales : sales.filter(s => s.platform === filter);
  const totalSales = filtered.reduce((a, s) => a + s.salePrice, 0);
  const totalProfit = filtered.reduce((a, s) => a + s.profit, 0);
  const avgMargin = filtered.length > 0 ? (filtered.reduce((a, s) => a + parseFloat(s.margin), 0) / filtered.length).toFixed(0) : 0;
  const bestPlatform = sales.length > 0 ? Object.entries(
    sales.reduce((acc, s) => { acc[s.platform] = (acc[s.platform] || 0) + s.profit; return acc; }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] : "—";

  const inp = { width: "100%", padding: "10px 12px", fontSize: 14, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, outline: "none", fontFamily: "inherit", color: "#111" };

  return (
    <>
      <Head><title>SellGuard — {t.title}</title></Head>
      <Layout>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#111", marginBottom: 6 }}>📊 {t.title}</h2>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{t.subtitle}</p>
          </div>
          {sales.length > 0 && !showForm && (
            <button onClick={() => setShowForm(true)}
              style={{ fontSize: 13, fontWeight: 700, padding: "8px 16px", borderRadius: 10, border: "none", background: "#111", color: "#fff", cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 12 }}>
              {t.add_btn}
            </button>
          )}
        </div>

        {/* Stats */}
        {sales.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              [t.total_sales, `${totalSales.toFixed(0)}€`, "#111"],
              [t.total_profit, `${totalProfit.toFixed(0)}€`, totalProfit >= 0 ? "#15803D" : "#DC2626"],
              [t.avg_margin, `${avgMargin}%`, parseFloat(avgMargin) >= 30 ? "#15803D" : "#D97706"],
              [t.best_platform, bestPlatform, PLATFORM_STYLE[bestPlatform]?.color || "#111"],
            ].map(([label, value, color]) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 16, fontWeight: 800, color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "20px", marginBottom: 20 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 5 }}>{t.article} *</label>
              <input value={form.article} onChange={e => setForm({...form, article: e.target.value})} placeholder={t.article_ph} style={inp} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 5 }}>{t.platform}</label>
              <select value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} style={inp}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 5 }}>{t.sale_price} *</label>
                <input type="number" value={form.salePrice} onChange={e => setForm({...form, salePrice: e.target.value})} placeholder="0" style={inp} min="0" step="0.5" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 5 }}>{t.buy_price}</label>
                <input type="number" value={form.buyPrice} onChange={e => setForm({...form, buyPrice: e.target.value})} placeholder="0" style={inp} min="0" step="0.5" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 5 }}>{t.costs} <span style={{ fontWeight: 400, color: "#999" }}>({t.costs_hint})</span></label>
                <input type="number" value={form.costs} onChange={e => setForm({...form, costs: e.target.value})} placeholder="0" style={inp} min="0" step="0.5" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 5 }}>{t.date}</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inp} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={addSale} disabled={!form.article.trim() || !form.salePrice}
                style={{ flex: 2, padding: 12, fontSize: 14, fontWeight: 700, borderRadius: 10, border: "none", background: !form.article.trim() || !form.salePrice ? "#E5E7EB" : "#111", color: !form.article.trim() || !form.salePrice ? "#999" : "#fff", cursor: "pointer", fontFamily: "inherit" }}>
                {t.save}
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ flex: 1, padding: 12, fontSize: 14, fontWeight: 600, borderRadius: 10, border: "1px solid #E5E7EB", background: "#fff", color: "#555", cursor: "pointer", fontFamily: "inherit" }}>
                {t.cancel}
              </button>
            </div>
          </div>
        )}

        {/* Filter */}
        {sales.length > 1 && !showForm && (
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            {["all", ...PLATFORMS].map(p => {
              const count = p === "all" ? sales.length : sales.filter(s => s.platform === p).length;
              if (p !== "all" && count === 0) return null;
              return (
                <button key={p} onClick={() => setFilter(p)}
                  style={{ fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 20, border: filter === p ? "2px solid #111" : "1px solid #E5E7EB", background: filter === p ? "#111" : "#fff", color: filter === p ? "#fff" : "#555", cursor: "pointer", fontFamily: "inherit" }}>
                  {p === "all" ? t.all : p} {count > 0 && <span style={{ opacity: 0.6 }}>({count})</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Sales list */}
        {sales.length === 0 && !showForm ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#111", marginBottom: 8 }}>{t.empty_title}</p>
            <p style={{ fontSize: 14, color: "#888", marginBottom: 24 }}>{t.empty_sub}</p>
            <button onClick={() => setShowForm(true)}
              style={{ padding: "12px 24px", fontSize: 14, fontWeight: 700, borderRadius: 12, border: "none", background: "#111", color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>
              {t.add_btn}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(sale => (
              <div key={sale.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sale.article}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: PLATFORM_STYLE[sale.platform]?.bg || "#F3F4F6", color: PLATFORM_STYLE[sale.platform]?.color || "#555" }}>{sale.platform}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{sale.salePrice}€</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: sale.profit >= 0 ? "#15803D" : "#DC2626" }}>+{sale.profit.toFixed(0)}€</span>
                    <span style={{ fontSize: 11, color: "#bbb" }}>{sale.date}</span>
                  </div>
                </div>
                <button onClick={() => deleteSale(sale.id)}
                  style={{ fontSize: 18, color: "#ccc", background: "transparent", border: "none", cursor: "pointer", padding: "4px", flexShrink: 0 }}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Clear all */}
        {sales.length > 0 && !showForm && (
          <button onClick={() => { setSales([]); localStorage.removeItem("sg_sales"); }}
            style={{ marginTop: 16, width: "100%", padding: 10, fontSize: 12, fontWeight: 600, borderRadius: 10, border: "1px solid #FECACA", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontFamily: "inherit" }}>
            🗑️ {t.clear}
          </button>
        )}
      </Layout>
    </>
  );
}
