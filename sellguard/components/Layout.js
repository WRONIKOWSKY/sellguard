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
    { href: "/calculateur", label: lang === "en" ? "Calculator" : "Calculateur", icon: "💰" },
    { href: "/ventes", label: lang === "en" ? "Sales" : "Ventes", icon: "📊" },
    { href: "/historique", label: lang === "en" ? "History" : "Historique", icon: "📋" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E8E4", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <span style={{ fontSize: 17, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Sell<span style={{ color: "#2563EB" }}>Guard</span></span>
          </Link>
          <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {NAV.map(n => (
              <Link key={n.href} href={n.href}>
                <span style={{ fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 8, background: router.pathname === n.href ? "#EFF6FF" : "transparent", color: router.pathname === n.href ? "#2563EB" : "#555", transition: "all 0.15s" }}>
                  {n.icon} {n.label}
                </span>
              </Link>
            ))}
            <button
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, border: "1px solid #E5E7EB", background: "#F9FAFB", color: "#555", cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 }}>
              {lang === "fr" ? "EN" : "FR"}
            </button>
          </nav>
        </div>
      </div>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
        {children}
      </div>
    </div>
  );
}
