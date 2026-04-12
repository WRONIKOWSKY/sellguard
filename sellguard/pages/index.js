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
    { href: "/calculateur", icon: "🧮", title: h.m4_title, desc: h.m4_desc, color: "#FDF2F8", border: "#FBCFE8", tag: h.m4_tag },
    { href: "/ventes", icon: "📋", title: h.m5_title, desc: h.m5_desc, color: "#F5F3FF", border: "#DDD6FE", tag: h.m5_tag },
    { href: "/prix", icon: "💰", title: h.m6_title, desc: h.m6_desc, color: "#FFFBEB", border: "#FDE68A", tag: h.m6_tag },
  ];

  return (
    <>
      <Head>
        <title>SellGuard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 12, letterSpacing: -0.5, lineHeight: 1.2 }}>{h.title}</h1>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>{h.subtitle}</p>
          <div style={{ marginTop: 18, display: "inline-block", background: "#111", color: "#fff", padding: "8px 18px", borderRadius: 24, fontSize: 13, fontWeight: 600 }}>
            {h.beta}
            <span style={{ display: "block", fontSize: 11, fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{h.beta_sub}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MODULES.map(m => (
            <Link key={m.href} href={m.href}>
              <div style={{ background: "#fff", border: "1px solid " + m.border, borderRadius: 16, padding: "20px 22px", cursor: "pointer", transition: "transform 0.15s", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: m.border }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{m.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{m.title}</h2>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: m.color, color: "#555" }}>{m.tag}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{m.desc}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Layout>
    </>
  );
}
