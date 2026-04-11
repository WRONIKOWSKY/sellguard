import Link from "next/link";
import { useRouter } from "next/router";

const NAV = [
  { href: "/annonce", label: "Annonce", icon: "📦" },
  { href: "/protection", label: "Protection", icon: "🛡️" },
  { href: "/litige", label: "Litige", icon: "⚖️" },
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#F7F7F5" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E8E4", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/">
            <span style={{ fontSize: 17, fontWeight: 700, color: "#111", letterSpacing: -0.3 }}>Sell<span style={{ color: "#2563EB" }}>Guard</span></span>
          </Link>
          <nav style={{ display: "flex", gap: 4 }}>
            {NAV.map(n => (
              <Link key={n.href} href={n.href}>
                <span style={{
                  fontSize: 13, fontWeight: 500, padding: "6px 14px", borderRadius: 8,
                  background: router.pathname === n.href ? "#EFF6FF" : "transparent",
                  color: router.pathname === n.href ? "#2563EB" : "#555",
                  transition: "all 0.15s"
                }}>
                  {n.icon} {n.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
        {children}
      </div>
    </div>
  );
}
