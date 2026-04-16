import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useLang } from "../contexts/LangContext";

export default function Home() {
var ref = useLang(), lang = ref.lang, t = ref.t, setLang = ref.setLang;
var h = t.home;

useEffect(function() {
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(function(el) {
    el.style.opacity = "0"; el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    io.observe(el);
  });
  return function() { io.disconnect(); };
}, []);

function scrollTo(id) { var el = document.querySelector(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }

var steps = {
  fr: [
    { n: "01", name: "Tu prends une photo", desc: "Annonce générée. Prix, description, hashtags.", color: "var(--violet)" },
    { n: "02", name: "Tu certifies avant envoi", desc: "Preuve horodatée enregistrée.", color: "var(--green)" },
    { n: "03", name: "Tu expédies", desc: "Suivi et preuve de dépôt sauvegardés.", color: "#fff" },
    { n: "04", name: "Un litige ?", desc: "Défense générée en 1 clic.", color: "var(--pink)" },
  ],
  en: [
    { n: "01", name: "You take a photo", desc: "Listing generated. Price, description, hashtags.", color: "var(--violet)" },
    { n: "02", name: "You certify before shipping", desc: "Timestamped proof recorded.", color: "var(--green)" },
    { n: "03", name: "You ship", desc: "Tracking and deposit proof saved.", color: "#fff" },
    { n: "04", name: "A dispute?", desc: "Defense generated in 1 click.", color: "var(--pink)" },
  ],
  es: [
    { n: "01", name: "Tomas una foto", desc: "Anuncio generado. Precio, descripción, hashtags.", color: "var(--violet)" },
    { n: "02", name: "Certificas antes del envío", desc: "Prueba con marca temporal registrada.", color: "var(--green)" },
    { n: "03", name: "Envías", desc: "Seguimiento y prueba de depósito guardados.", color: "#fff" },
    { n: "04", name: "¿Un litigio?", desc: "Defensa generada en 1 clic.", color: "var(--pink)" },
  ],
  it: [
    { n: "01", name: "Scatti una foto", desc: "Annuncio generato. Prezzo, descrizione, hashtag.", color: "var(--violet)" },
    { n: "02", name: "Certifichi prima della spedizione", desc: "Prova con timestamp registrata.", color: "var(--green)" },
    { n: "03", name: "Spedisci", desc: "Tracciamento e prova di deposito salvati.", color: "#fff" },
    { n: "04", name: "Una controversia?", desc: "Difesa generata in 1 clic.", color: "var(--pink)" },
  ],
};

var pain = {
  fr: { title: "Tu peux perdre ton argent", em: "sur une seule vente.", items: ["Un acheteur malhonnête, remboursement forcé", "Zéro preuve, zéro recours"], callout: "Tu prends 100% du risque." },
  en: { title: "You can lose your money", em: "on a single sale.", items: ["A dishonest buyer, forced refund", "Zero proof, zero recourse"], callout: "You take 100% of the risk." },
  es: { title: "Puedes perder tu dinero", em: "en una sola venta.", items: ["Un comprador deshonesto, reembolso forzado", "Cero prueba, cero recurso"], callout: "Tú asumes el 100% del riesgo." },
  it: { title: "Puoi perdere i tuoi soldi", em: "su una singola vendita.", items: ["Un acquirente disonesto, rimborso forzato", "Zero prove, zero ricorso"], callout: "Ti assumi il 100% del rischio." },
};

var solution = {
  fr: { title: "Tu vends.", em: "On protège.", sub: "Chaque vente est sécurisée.", items: ["Horodatage automatique avant envoi", "Certification avec preuve légale", "Sauvegarde sécurisée de chaque envoi"], callout: "L'acheteur conteste ? Tu as la preuve." },
  en: { title: "You sell.", em: "We protect.", sub: "Every sale is secured.", items: ["Automatic timestamping before shipping", "Certification with legal proof", "Secure backup of every shipment"], callout: "Buyer disputes? You have the proof." },
  es: { title: "Tú vendes.", em: "Nosotros protegemos.", sub: "Cada venta está asegurada.", items: ["Marca temporal automática antes del envío", "Certificación con prueba legal", "Copia de seguridad segura de cada envío"], callout: "¿El comprador disputa? Tienes la prueba." },
  it: { title: "Tu vendi.", em: "Noi proteggiamo.", sub: "Ogni vendita è sicura.", items: ["Timestamp automatico prima della spedizione", "Certificazione con prova legale", "Backup sicuro di ogni spedizione"], callout: "L'acquirente contesta? Hai la prova." },
};

var compare = {
  fr: {
    before: "Avant SellCov",
    after: "Avec SellCov",
    bad: ["Réception contestée par l'acheteur", "La plateforme rembourse l'acheteur", "Tu perds ton produit et ton argent", "Aucune preuve valable"],
    good: ["Preuve enregistrée automatiquement", "Envoi certifié avant expédition", "Réponse de défense générée", "Ton argent est protégé"],
    proof: ["Si l'acheteur ment,", "tu peux le prouver."],
    cta: "Activer la protection",
  },
  en: {
    before: "Before SellCov",
    after: "With SellCov",
    bad: ["Delivery disputed by buyer", "Platform refunds the buyer", "You lose your product and your money", "No valid proof"],
    good: ["Proof recorded automatically", "Shipment certified before sending", "Defense response generated", "Your money is protected"],
    proof: ["If the buyer lies,", "you can prove it."],
    cta: "Activate protection",
  },
  es: {
    before: "Antes de SellCov",
    after: "Con SellCov",
    bad: ["Recepción disputada por el comprador", "La plataforma reembolsa al comprador", "Pierdes tu producto y tu dinero", "Sin prueba válida"],
    good: ["Prueba registrada automáticamente", "Envío certificado antes de la expedición", "Respuesta de defensa generada", "Tu dinero está protegido"],
    proof: ["Si el comprador miente,", "puedes probarlo."],
    cta: "Activar la protección",
  },
  it: {
    before: "Prima di SellCov",
    after: "Con SellCov",
    bad: ["Ricezione contestata dall'acquirente", "La piattaforma rimborsa l'acquirente", "Perdi il tuo prodotto e i tuoi soldi", "Nessuna prova valida"],
    good: ["Prova registrata automaticamente", "Spedizione certificata prima dell'invio", "Risposta di difesa generata", "I tuoi soldi sono protetti"],
    proof: ["Se l'acquirente mente,", "puoi provarlo."],
    cta: "Attiva la protezione",
  },
};

var hero = {
  fr: { badge: "Bêta gratuite (places limitées)", h1a: "Revends", h1b: "sans te faire arnaquer.", sub: "On protège ton argent. À chaque envoi.", sub2: "Preuve horodatée. Défense automatique.", cta1: "Essayer gratuitement", cta2: "Voir comment ça marche", nav1: "Pourquoi", nav2: "Comment", cta_nav: "Essayer gratuit" },
  en: { badge: "Free beta (limited spots)", h1a: "Resell", h1b: "without getting scammed.", sub: "We protect your money. Every shipment.", sub2: "Timestamped proof. Automatic defense.", cta1: "Try for free", cta2: "See how it works", nav1: "Why", nav2: "How", cta_nav: "Try free" },
  es: { badge: "Beta gratuita (plazas limitadas)", h1a: "Revende", h1b: "sin que te estafen.", sub: "Protegemos tu dinero. En cada envío.", sub2: "Prueba con marca temporal. Defensa automática.", cta1: "Probar gratis", cta2: "Ver cómo funciona", nav1: "Por qué", nav2: "Cómo", cta_nav: "Probar gratis" },
  it: { badge: "Beta gratuita (posti limitati)", h1a: "Rivendi", h1b: "senza essere truffato.", sub: "Proteggiamo i tuoi soldi. Ad ogni spedizione.", sub2: "Prova con timestamp. Difesa automatica.", cta1: "Prova gratis", cta2: "Scopri come funziona", nav1: "Perché", nav2: "Come", cta_nav: "Prova gratis" },
};

var finalCta = {
  fr: { title: "Protège ton argent", em: "maintenant.", sub: "Chaque vente non protégée est un risque.", cta: "Essayer gratuitement" },
  en: { title: "Protect your money", em: "now.", sub: "Every unprotected sale is a risk.", cta: "Try for free" },
  es: { title: "Protege tu dinero", em: "ahora.", sub: "Cada venta no protegida es un riesgo.", cta: "Probar gratis" },
  it: { title: "Proteggi i tuoi soldi", em: "adesso.", sub: "Ogni vendita non protetta è un rischio.", cta: "Prova gratis" },
};

var hl = hero[lang] || hero.fr;
var pl = pain[lang] || pain.fr;
var sl = solution[lang] || solution.fr;
var cl = compare[lang] || compare.fr;
var stl = steps[lang] || steps.fr;
var fl = finalCta[lang] || finalCta.fr;

return (
  <>
    <Head>
      <title>SellCov — {hl.h1a} {hl.h1b}</title>
      <meta name="description" content={hl.sub} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    </Head>

    <style jsx global>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg: #000; --bg2: #0A0A0A; --bg3: #111;
        --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.14);
        --text: #fff; --muted: rgba(255,255,255,0.42); --dim: rgba(255,255,255,0.22);
        --violet: #818CF8; --violet-bg: rgba(99,102,241,0.1);
        --green: #4ADE80; --green-bg: rgba(34,197,94,0.1);
        --pink: #F472B6; --pink-bg: rgba(236,72,153,0.1);
        --red: #F87171;
        --serif: 'DM Serif Display', Georgia, serif;
        --sans: 'DM Sans', -apple-system, sans-serif;
      }
      html { scroll-behavior: smooth; }
      body { font-family: var(--sans); background: var(--bg); color: var(--text); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

      .lp-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 36px; height: 54px; background: rgba(0,0,0,0.82); border-bottom: 0.5px solid var(--border); backdrop-filter: blur(20px); }
      .nav-logo { display: flex; align-items: center; gap: 10px; font-family: var(--serif); font-size: 18px; color: var(--text); text-decoration: none; cursor: pointer; }
      .nav-links { display: flex; gap: 28px; }
      .nav-links a { font-size: 12px; color: var(--muted); text-decoration: none; cursor: pointer; transition: color 0.2s; }
      .nav-links a:hover { color: var(--text); }
      .nav-cta { padding: 8px 20px; background: var(--text); color: var(--bg); font-size: 12px; font-weight: 500; border-radius: 20px; border: none; cursor: pointer; font-family: var(--sans); text-decoration: none; }

      .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 32px 100px; position: relative; }
      .hero::before { content: ''; position: absolute; top: -180px; left: 50%; transform: translateX(-50%); width: 700px; height: 700px; background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 68%); pointer-events: none; }
      .lp-h1 { font-family: var(--serif); font-size: clamp(44px, 8vw, 76px); font-weight: 400; line-height: 1.04; letter-spacing: -0.02em; margin-bottom: 10px; animation: fadeUp 0.5s 0.08s ease both; }
      .lp-h1 em { font-style: italic; color: rgba(255,255,255,0.32); }
      .hero-sub { font-size: 18px; color: var(--text); line-height: 1.5; max-width: 440px; margin: 0 auto 8px; font-weight: 400; animation: fadeUp 0.5s 0.16s ease both; }
      .hero-sub2 { font-size: 14px; color: var(--muted); margin-bottom: 36px; animation: fadeUp 0.5s 0.2s ease both; }
      .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.5s 0.24s ease both; }
      .btn-primary { padding: 14px 34px; background: var(--text); color: var(--bg); font-size: 14px; font-weight: 500; border-radius: 28px; border: none; cursor: pointer; font-family: var(--sans); text-decoration: none; display: inline-block; transition: transform 0.15s, opacity 0.15s; }
      .btn-primary:hover { opacity: 0.88; transform: scale(1.02); }
      .btn-ghost { padding: 14px 34px; background: transparent; color: var(--text); font-size: 14px; border-radius: 28px; border: 0.5px solid rgba(255,255,255,0.2); cursor: pointer; font-family: var(--sans); transition: background 0.15s; }
      .btn-ghost:hover { background: rgba(255,255,255,0.05); }

      .section { padding: 96px 32px; max-width: 920px; margin: 0 auto; }
      .section-title { text-align: center; font-family: var(--serif); font-size: clamp(30px, 4.5vw, 46px); font-weight: 400; letter-spacing: -0.02em; margin-bottom: 8px; line-height: 1.1; }
      .section-title em { font-style: italic; color: rgba(255,255,255,0.35); }
      .section-sub { text-align: center; font-size: 15px; color: var(--muted); font-weight: 300; line-height: 1.6; }

      .pain-list { list-style: none; display: flex; flex-direction: column; gap: 12px; max-width: 500px; margin: 0 auto; }
      .pain-item { font-size: 15px; color: var(--red); display: flex; align-items: center; gap: 10px; text-align: left; }
      .pain-callout { text-align: left; margin-top: 32px; font-size: 15px; color: var(--muted); font-weight: 400; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.6; }

      .solution-list { display: flex; flex-direction: column; gap: 10px; max-width: 500px; margin: 0 auto; }
      .solution-item { font-size: 15px; color: var(--green); display: flex; align-items: center; gap: 10px; }
      .solution-callout { text-align: center; margin-top: 32px; font-size: 16px; font-weight: 500; color: var(--text); max-width: 500px; margin-left: auto; margin-right: auto; }

      .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 1px; background: var(--border); border: 0.5px solid var(--border); border-radius: 18px; overflow: hidden; margin-top: 48px; }
      .step-card { background: var(--bg); padding: 32px 24px; }
      .step-num { font-size: 11px; color: var(--dim); letter-spacing: 0.1em; margin-bottom: 14px; }
      .step-name { font-size: 15px; font-weight: 500; color: var(--text); margin-bottom: 6px; }
      .step-desc { font-size: 13px; color: var(--muted); line-height: 1.6; font-weight: 300; }

      .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 48px; }
      .compare-card { border-radius: 18px; padding: 32px; }

      .final-cta { padding: 120px 32px; text-align: center; }
      .final-title { font-family: var(--serif); font-size: clamp(36px,6vw,64px); font-weight: 400; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 16px; }
      .final-sub { font-size: 16px; color: var(--muted); margin-bottom: 36px; font-weight: 300; }

      footer { border-top: 0.5px solid var(--border); padding: 32px 36px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
      .footer-logo { display: flex; align-items: center; gap: 10px; font-family: var(--serif); font-size: 16px; color: var(--dim); }
      .footer-links { display: flex; gap: 28px; }
      .footer-links a { font-size: 12px; color: var(--dim); text-decoration: none; }
      .footer-copy { font-size: 11px; color: rgba(255,255,255,0.14); }

      .lang-btn { font-size: 10px; font-weight: 600; padding: 4px 8px; border-radius: 6px; border: 0.5px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); cursor: pointer; font-family: var(--sans); transition: all 0.15s; }
      .lang-btn.active { background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.4); }

      @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
      @media (max-width: 640px) {
        .lp-nav { padding: 0 20px; }
        .nav-links { display: none; }
        .compare-grid { grid-template-columns: 1fr; }
        .steps-grid { grid-template-columns: 1fr; }
        footer { flex-direction: column; align-items: flex-start; }
      }
    `}</style>

    {/* NAV */}
    <nav className="lp-nav">
      <span className="nav-logo">
        <svg width="28" height="28" viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="14" stroke="#fff" strokeWidth="1.2"/><circle cx="15" cy="15" r="10" stroke="#fff" strokeWidth="0.4" strokeDasharray="2.8 2.8"/><text x="15" y="19.5" fontFamily="-apple-system,sans-serif" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">SC</text></svg>
        SellCov
      </span>
      <div className="nav-links">
        <a onClick={function() { scrollTo("#problem"); }}>{hl.nav1}</a>
        <a onClick={function() { scrollTo("#how"); }}>{hl.nav2}</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {["fr","en","es","it"].map(function(l) {
            return (
              <button key={l} onClick={function() { setLang(l); }}
                className={"lang-btn" + (lang === l ? " active" : "")}>
                {l.toUpperCase()}
              </button>
            );
          })}
        </div>
        <Link href="/annonce" className="nav-cta">{hl.cta_nav}</Link>
      </div>
    </nav>

    {/* HERO */}
    <section className="hero">
      <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 20, fontSize: 11, color: "var(--muted)", marginBottom: 32, animation: "fadeUp 0.5s ease both" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }}></span>
        {hl.badge}
      </div>
      <h1 className="lp-h1">{hl.h1a}<br/><em>{hl.h1b}</em></h1>
      <p className="hero-sub">{hl.sub}</p>
      <p className="hero-sub2">{hl.sub2}</p>
      <div className="hero-actions">
        <Link href="/annonce" className="btn-primary">{hl.cta1}</Link>
        <button className="btn-ghost" onClick={function() { scrollTo("#problem"); }}>{hl.cta2}</button>
      </div>
      <div style={{ marginTop: 18, fontSize: 12, color: "var(--dim)", animation: "fadeUp 0.5s 0.32s ease both" }}>Vinted · Depop · Grailed · Vestiaire Collective · Etsy</div>
    </section>

    {/* PROBLÈME */}
    <section className="section" id="problem">
      <h2 className="section-title">{pl.title}<br/><em>{pl.em}</em></h2>
      <div style={{ height: 40 }}></div>
      <ul className="pain-list reveal">
        {pl.items.map(function(item) { return <li key={item} className="pain-item">{item}</li>; })}
      </ul>
      <p className="pain-callout reveal" style={{ fontWeight: 500, color: "var(--red)" }}>{pl.callout}</p>
    </section>

    {/* SOLUTION */}
    <section className="section" style={{ paddingTop: 40 }}>
      <h2 className="section-title">{sl.title}<br/><em>{sl.em}</em></h2>
      <p className="section-sub" style={{ marginBottom: 40 }}>{sl.sub}</p>
      <div className="solution-list reveal">
        {sl.items.map(function(item) { return <div key={item} className="solution-item">{item}</div>; })}
      </div>
      <p className="solution-callout reveal">{sl.callout}</p>
    </section>

    {/* COMMENT ÇA MARCHE */}
    <section className="section" id="how" style={{ paddingTop: 40 }}>
      <h2 className="section-title">4 {lang === "fr" ? "étapes." : lang === "en" ? "steps." : lang === "es" ? "pasos." : "passi."}<br/><em>{lang === "fr" ? "Tu es couvert." : lang === "en" ? "You're covered." : lang === "es" ? "Estás cubierto." : "Sei coperto."}</em></h2>
      <div className="steps-grid">
        {stl.map(function(s) {
          return (
            <div key={s.n} className="step-card reveal">
              <div className="step-num">{s.n}</div>
              <div className="step-name" style={{ color: s.color }}>{s.name}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          );
        })}
      </div>
    </section>

    {/* COMPARATIF */}
    <section className="section" style={{ paddingTop: 40 }}>
      <h2 className="section-title">{lang === "fr" ? "Avant vs Après" : lang === "en" ? "Before vs After" : lang === "es" ? "Antes vs Después" : "Prima vs Dopo"}<br/><em>SellCov.</em></h2>
      <div className="compare-grid">
        <div className="compare-card reveal" style={{ background: "rgba(248,113,113,0.04)", border: "0.5px solid rgba(248,113,113,0.15)" }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>{cl.before}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {cl.bad.map(function(item) { return <div key={item} style={{ fontSize: 14, color: "var(--red)" }}>{item}</div>; })}
          </div>
        </div>
        <div className="compare-card reveal" style={{ background: "rgba(74,222,128,0.04)", border: "0.5px solid rgba(74,222,128,0.15)" }}>
          <div style={{ fontSize: 12, color: "var(--green)", marginBottom: 20 }}>{cl.after}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {cl.good.map(function(item) { return <div key={item} style={{ fontSize: 14, color: "var(--green)" }}>{item}</div>; })}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 48 }}>
        <p style={{ fontFamily: "var(--serif)", fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
          {cl.proof[0]}<br/><em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>{cl.proof[1]}</em>
        </p>
      </div>
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <Link href="/protection" className="btn-primary">{cl.cta}</Link>
      </div>
    </section>

    {/* CTA FINAL */}
    <section className="final-cta">
      <h2 className="final-title">{fl.title}<br/><em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>{fl.em}</em></h2>
      <p className="final-sub">{fl.sub}</p>
      <Link href="/annonce" className="btn-primary" style={{ fontSize: 15, padding: "16px 48px" }}>{fl.cta}</Link>
      <div style={{ marginTop: 18, fontSize: 12, color: "var(--dim)" }}>Vinted · Depop · Grailed · Vestiaire Collective · Etsy</div>
    </section>

    {/* FOOTER */}
    <footer>
      <div className="footer-logo">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/><text x="11" y="14.5" fontFamily="-apple-system,sans-serif" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.3)" textAnchor="middle">SC</text></svg>
        SellCov
      </div>
      <div className="footer-links">
        <a href="mailto:hello@sellcov.com">FAQ</a>
        <a href="mailto:hello@sellcov.com">Contact</a>
        <a href="#">Instagram</a>
        <a href="#">TikTok</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input id="newsletter" type="email" placeholder={lang === "fr" ? "Ton email" : lang === "en" ? "Your email" : lang === "es" ? "Tu email" : "La tua email"} style={{ padding: "7px 14px", fontSize: 12, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 8, color: "#fff", fontFamily: "var(--sans)", outline: "none", width: 180 }} />
        <button onClick={function() { var em = document.getElementById("newsletter"); if (em.value) { window.location.href = "mailto:hello@sellcov.com?subject=Newsletter SellCov&body=Inscris-moi : " + em.value; em.value = ""; } }} style={{ padding: "7px 14px", fontSize: 11, fontWeight: 600, background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 8, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "var(--sans)" }}>Newsletter</button>
      </div>
      <div className="footer-copy">© 2026 SellCov</div>
    </footer>
  </>
);
}
