import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useLang } from "../../contexts/LangContext";

// Page publique derrière le QR du badge vendeur.
// Affiche uniquement des agrégats : pseudo revendiqué, plateforme, nombre
// d'envois certifiés, ancienneté. Jamais la liste des certificats.

const PLATFORM_LABELS = {
  vinted: "Vinted",
  depop: "Depop",
  grailed: "Grailed",
  vestiaire: "Vestiaire Collective",
  etsy: "Etsy",
  autre: null,
};

export default function VendeurPublic() {
  const router = useRouter();
  const { slug } = router.query;
  const { t, lang } = useLang();
  const s = t.vendeur;

  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/vendeur/${encodeURIComponent(slug)}`)
      .then((r) => r.json().then((data) => ({ status: r.status, data })))
      .then(({ status, data }) => {
        if (status !== 200) {
          setError(data.error || s.not_found);
          setSeller(null);
        } else {
          setSeller(data);
          setError(null);
        }
      })
      .catch(() => setError(s.err_network))
      .finally(() => setLoading(false));
  }, [slug, s.not_found, s.err_network]);

  const sinceStr = seller?.member_since
    ? new Date(seller.member_since).toLocaleDateString(lang === "en" ? "en-US" : "fr-FR", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      <Head>
        <title>{s.meta_title_prefix} {seller?.handle ? "@" + seller.handle : slug || ""}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; }
        body {
          font-family: var(--font-inter), -apple-system, system-ui, sans-serif;
          background: #f8f7f3;
          color: #111111;
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }
      `}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(248,247,243,0.92)", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <Link href="/">
            <span style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
              <img src="/logo-full.png" alt="SellCov" style={{ height: 80, width: "auto" }} />
            </span>
          </Link>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#167a48", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {s.header_kicker}
          </span>
        </div>
      </header>

      <main style={{ maxWidth: 620, margin: "0 auto", padding: "32px 24px 80px" }}>
        {loading && (
          <div style={{ ...cardStyle, textAlign: "center", color: "#6b6b6b" }}>{s.checking}</div>
        )}

        {!loading && error && (
          <div style={{ padding: "20px 22px", borderRadius: 16, background: "#fdecea", border: "1.5px solid #f5c2bc" }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#c0392b", margin: 0 }}>✗ {s.not_found}</p>
            <p style={{ fontSize: 13.5, color: "#6b6b6b", marginTop: 8 }}>{s.not_found_sub}</p>
          </div>
        )}

        {!loading && seller && (
          <>
            <div style={{ textAlign: "center", padding: "16px 0 24px" }}>
              <div style={{ width: 72, height: 72, margin: "0 auto 16px", borderRadius: "50%", background: "#e7f3ec", border: "2px solid #1f9f5f", display: "grid", placeItems: "center" }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#167a48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <h1 style={{ fontWeight: 800, fontSize: "clamp(26px, 6vw, 36px)", letterSpacing: "-0.02em" }}>
                @{seller.handle}
              </h1>
              <p style={{ color: "#6b6b6b", fontSize: 15, marginTop: 8 }}>
                {PLATFORM_LABELS[seller.platform]
                  ? s.sub_platform.replace("{platform}", PLATFORM_LABELS[seller.platform])
                  : s.sub_generic}
              </p>
            </div>

            <div style={{ padding: "20px 22px", borderRadius: 16, background: "#e7f3ec", border: "1.5px solid #1f9f5f", marginBottom: 14 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#167a48", margin: 0 }}>✓ {s.ok_title}</p>
              <p style={{ fontSize: 13.5, color: "#2a2a2a", marginTop: 6, lineHeight: 1.55 }}>{s.ok_sub}</p>
            </div>

            {/* Sous 3 envois, afficher le compteur dessert le vendeur qui
                démarre (« 0 envois certifiés » suggère l'inverse de ce que le
                badge annonce). On montre alors la seule info utile et vraie :
                le compte est bien vérifié, depuis telle date. */}
            {seller.cert_count >= 3 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div style={statBox}>
                  <div style={statLabel}>{s.stat_certs}</div>
                  <div style={statValue}>{seller.cert_count}</div>
                </div>
                <div style={statBox}>
                  <div style={statLabel}>{s.stat_since}</div>
                  <div style={{ ...statValue, fontSize: 20 }}>{sinceStr || "—"}</div>
                </div>
              </div>
            ) : (
              <div style={{ ...statBox, marginBottom: 14 }}>
                <div style={statLabel}>{s.stat_verified}</div>
                <div style={{ ...statValue, fontSize: 20 }}>{sinceStr || "—"}</div>
              </div>
            )}

            <p style={{ fontSize: 12.5, color: "#6b6b6b", textAlign: "center", lineHeight: 1.6, marginTop: 18 }}>
              {s.footer_note}
            </p>

            <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid #e6e4dc", textAlign: "center" }}>
              <Link href="/">
                <span style={{ fontSize: 14, fontWeight: 600, color: "#167a48", cursor: "pointer" }}>
                  {s.discover}
                </span>
              </Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1.5px solid #e6e4dc",
  borderRadius: 28,
  padding: "22px 26px",
};

const statBox = {
  padding: "18px 20px",
  background: "#fff",
  border: "1.5px solid #e6e4dc",
  borderRadius: 16,
  textAlign: "center",
};

const statLabel = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6b6b6b",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  marginBottom: 6,
};

const statValue = {
  fontSize: 32,
  fontWeight: 800,
  color: "#111",
  letterSpacing: "-0.02em",
};
