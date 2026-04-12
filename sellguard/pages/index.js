import Link from "next/link";
import Head from "next/head";
import Layout from "../components/Layout";
import { useLang } from "../contexts/LangContext";

export default function Home() {
  const { t } = useLang();
  const h = t.home;

  const MODULES = [
    { href: "/annonce", icon: "📦", title: h.m1_title, desc: h.m1_desc, color: "#EFF6FF", border: "#BFDBFE", tag: h.m1_tag },
    { href: "/protection", icon: "🛡️", title: h.m2_title, desc: h.m2_desc, color: "#F0FDF4", border: "#BBF7D0", tag: h.m2_tag },
    { href: "/litige", icon: "⚖️", title: h.m3_title, desc: h.m3_desc, color: "#FFF7ED", border: "#FED7AA", tag: h.m3_tag },
    { href: "/calculateur", icon: "💰", title: h.m4_title, desc: h.m4_desc, color: "#F0FDF4", border: "#BBF7D0", tag: h.m4_tag },
    { href: "/ventes", icon: "📊", title: h.m5_title, desc: h.m5_desc, color: "#EFF6FF", border: "#BFDBFE", tag: h.m5_tag },
  ];

  return (
    <>
      <Head>
        <title>SellGuard — {h.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111", marginBottom: 12, letterSpacing: -0.5, lineHeight: 1.2 }}>{h.title}</h1>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>{h.subtitle}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MODULES.map(m => (
            <Link key={m.href} href={m.href}>
              <div style={{ background: "#fff", border: `1px solid ${m.border}`, borderRadius: 16, padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 18 }}>
                <div style={{ width: 48, height: 48, background: m.color, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{m.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, background: m.color, color: "#555" }}>{m.tag}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{m.desc}</p>
                </div>
                <span style={{ color: "#999", fontSize: 18, flexShrink: 0, marginTop: 4 }}>→</span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 32, padding: "20px 24px", background: "#111", borderRadius: 16, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#999", marginBottom: 4 }}>{h.beta}</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{h.beta_sub}</p>
        </div>
      </Layout>
    </>
  );
}
