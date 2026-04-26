import Link from "next/link";

const NAV_COLORS = {
  "/annonce": "#818CF8",
  "/protection": "#4ADE80",
  "/compte": "#FACC15",
};

export default function Layout({ children }) {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <nav style={{ display: "flex", gap: 20, padding: 20 }}>
        <Link href="/annonce" style={{ color: NAV_COLORS["/annonce"] }}>
          Annonce
        </Link>
        <Link href="/protection" style={{ color: NAV_COLORS["/protection"] }}>
          Protection
        </Link>
        <Link href="/compte" style={{ color: NAV_COLORS["/compte"] }}>
          Compte
        </Link>
      </nav>

      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}
