import Link from "next/link";
import { useRouter } from "next/router";
import { useLang } from "../contexts/LangContext";

export default function Layout({ children }) {
  const router = useRouter();
  const { lang, t, setLang } = useLang();

  const NAV = [
    { href: "/annonce", label: t.nav.annonce, icon: "📦" },
    { href: "/protection", label: t.nav.protection, icon: "🛡️" },
    { href: "/litige", label: t.nav.litige, icon: "⚖️" },
    { href: "/calculateur", label: t.nav.calculateur, icon: "🧮" },
    { href: "/ventes", label: t.nav.ventes, icon: "📋" },
    { href: "/prix", label: t.nav.prix, icon: "💰" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E8E4", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <span style={{ fontSize: 17, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Sell<span style={{ color: "#2563EB" }}>Guard</span></span>
          </Link>
          <button
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, border: "1px solid #E5E7EB", background: "#F9FAFB", color: "#555", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 }}>
            {lang === "fr" ? "EN" : "FR"}
          </button>
        </div>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 12px", display: "flex", gap: 2, overflowX: "auto", WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href}>
              <span style={{
                fontSize: 12, fontWeight: 500, padding: "8px 10px", borderRadius: 8, whiteSpace: "nowrap",
                background: router.pathname === n.href ? "#EFF6FF" : "transparent",
                color: router.pathname === n.href ? "#2563EB" : "#555",
                transition: "all 0.15s",
                display: "inline-block"
              }}>
                {n.icon} {n.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
        {children}
      </div>
    </div>
  );
}
