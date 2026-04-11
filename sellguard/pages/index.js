import Link from "next/link";
import Head from "next/head";
import Layout from "../components/Layout";

const MODULES = [
  {
    href: "/annonce",
    icon: "📦",
    title: "Générer une annonce",
    desc: "Photo → titre, description, hashtags et prix optimisés pour Vinted, eBay, Leboncoin et Facebook simultanément.",
    color: "#EFF6FF",
    border: "#BFDBFE",
    tag: "Gain de temps"
  },
  {
    href: "/protection",
    icon: "🛡️",
    title: "Protéger mon envoi",
    desc: "Certifie tes photos avant l'envoi avec horodatage numérique. Preuve légale inattaquable en cas de litige.",
    color: "#F0FDF4",
    border: "#BBF7D0",
    tag: "Protection légale"
  },
  {
    href: "/litige",
    icon: "⚖️",
    title: "Gérer un litige",
    desc: "Analyse les photos de l'acheteur pour détecter une fraude IA. Génère ta réponse de défense automatiquement.",
    color: "#FFF7ED",
    border: "#FED7AA",
    tag: "Anti-fraude"
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>SellGuard — Protection & gestion pour revendeurs pros</title>
        <meta name="description" content="Générez vos annonces, protégez vos envois et défendez-vous contre les litiges automatiquement." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111", marginBottom: 12, letterSpacing: -0.5, lineHeight: 1.2 }}>
            La suite complète du<br />revendeur professionnel
          </h1>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
            Annonces optimisées, protection légale avant envoi, et défense automatique contre les fraudes et litiges.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MODULES.map(m => (
            <Link key={m.href} href={m.href}>
              <div style={{ background: "#fff", border: `1px solid ${m.border}`, borderRadius: 16, padding: "20px 24px", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", display: "flex", alignItems: "flex-start", gap: 18 }}>
                <div style={{ width: 48, height: 48, background: m.color, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {m.icon}
                </div>
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
          <p style={{ fontSize: 13, color: "#999", marginBottom: 4 }}>Version Beta — Accès gratuit</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>3 utilisations gratuites · Ensuite 29€/mois</p>
        </div>
      </Layout>
    </>
  );
}
