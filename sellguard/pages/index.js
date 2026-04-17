import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { useLang } from "../contexts/LangContext";

export default function Home() {
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

  var ref = useLang(), lang = ref.lang, setLang = ref.setLang;
  function tx(o) { return o[lang] || o.en || o.fr; }

  function scrollTo(id) { var el = document.querySelector(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }

  return (
    <>
      <Head>
        <title>SellCov</title>
        <meta name="description" content="Ton argent est protégé. À chaque envoi. Preuve horodatée. Défense automatique." />
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
        .section-eyebrow { text-align: center; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--dim); margin-bottom: 14px; }
        .section-title { text-align: center; font-family: var(--serif); font-size: clamp(30px, 4.5vw, 46px); font-weight: 400; letter-spacing: -0.02em; margin-bottom: 8px; line-height: 1.1; }
        .section-title em { font-style: italic; color: rgba(255,255,255,0.35); }
        .section-sub { text-align: center; font-size: 15px; color: var(--muted); font-weight: 300; line-height: 1.6; }

        .pain-list { list-style: none; display: flex; flex-direction: column; gap: 0; max-width: 500px; margin: 0 auto; }
        .pain-item { font-size: 19px; font-weight: 300; color: var(--red); padding: 18px 0; border-bottom: 0.5px solid rgba(248,113,113,0.1); text-align: left; letter-spacing: -0.01em; line-height: 1.3; }
        .pain-callout { text-align: left; margin-top: 24px; font-size: 19px; font-weight: 500; color: var(--red); max-width: 500px; margin-left: auto; margin-right: auto; letter-spacing: -0.02em; }

        .solution-list { display: flex; flex-direction: column; gap: 0; max-width: 500px; margin: 0 auto; }
        .solution-item { font-size: 19px; font-weight: 300; color: var(--green); padding: 18px 0; border-bottom: 0.5px solid rgba(74,222,128,0.1); letter-spacing: -0.01em; line-height: 1.3; }
        .solution-callout { text-align: center; margin-top: 32px; font-size: 19px; font-weight: 400; color: var(--text); max-width: 500px; margin-left: auto; margin-right: auto; letter-spacing: -0.02em; }

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

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .lp-nav { padding: 0 20px; }
          .nav-links { display: none; }
          .compare-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .flow-arrow { display: none; }
          footer { flex-direction: column; align-items: flex-start; }
          .modules-apple { grid-template-columns: 1fr !important; }
          .modules-apple-full { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav className="lp-nav">
        <span className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 30 30" fill="none"><circle cx="15" cy="15" r="14" stroke="#fff" strokeWidth="1.2"/><circle cx="15" cy="15" r="10" stroke="#fff" strokeWidth="0.4" strokeDasharray="2.8 2.8"/><text x="15" y="19.5" fontFamily="-apple-system,sans-serif" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">SC</text></svg>
          SellCov
        </span>
        <div className="nav-links">
          <a onClick={function() { scrollTo("#problem"); }}>{tx({fr:"Pourquoi", en:"Why", es:"Por qué", it:"Perché"})}</a>
          <a onClick={function() { scrollTo("#how"); }}>{tx({fr:"Comment", en:"How", es:"Cómo", it:"Come"})}</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select value={lang} onChange={function(e) { setLang(e.target.value); }} style={{ fontSize: 11, fontWeight: 600, padding: "5px 14px", borderRadius: 20, border: "0.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "var(--sans)" }}>
            <option value="fr">FR</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="it">IT</option>
          </select>
          <Link href="/annonce" className="nav-cta">{tx({fr:"Essayer gratuit", en:"Try free", es:"Probar gratis", it:"Prova gratis"})}</Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 20, fontSize: 11, color: "var(--muted)", marginBottom: 32, animation: "fadeUp 0.5s ease both" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }}></span>
          {tx({fr:"Bêta gratuite (places limitées)", en:"Free beta (limited spots)", es:"Beta gratuita (plazas limitadas)", it:"Beta gratuita (posti limitati)"})}
        </div>
        <h1 className="lp-h1">{tx({fr:"Revends", en:"Resell", es:"Revende", it:"Rivendi"})}<br/><em>{tx({fr:"sans te faire arnaquer.", en:"without getting scammed.", es:"sin que te estafen.", it:"senza farti truffare."})}</em></h1>
        <p className="hero-sub">{tx({fr:"On protège ton argent. À chaque envoi.", en:"We protect your money. Every shipment.", es:"Protegemos tu dinero. En cada envío.", it:"Proteggiamo i tuoi soldi. Ad ogni spedizione."})}</p>
        <p className="hero-sub2">{tx({fr:"Preuve horodatée. Défense automatique.", en:"Timestamped proof. Automatic defense.", es:"Prueba con marca temporal. Defensa automática.", it:"Prova con timestamp. Difesa automatica."})}</p>
        <div className="hero-actions">
          <Link href="/annonce" className="btn-primary">{tx({fr:"Essayer gratuitement", en:"Try for free", es:"Probar gratis", it:"Prova gratis"})}</Link>
          <button className="btn-ghost" onClick={function() { scrollTo("#problem"); }}>{tx({fr:"Voir comment ça marche", en:"See how it works", es:"Ver cómo funciona", it:"Scopri come funziona"})}</button>
        </div>
        <div style={{ marginTop: 18, fontSize: 12, color: "var(--dim)", animation: "fadeUp 0.5s 0.32s ease both" }}>Vinted · Depop · Grailed · Vestiaire Collective · Etsy</div>
      </section>

      {/* ═══ MODULES APPLE-STYLE ═══ */}
      <section style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10, alignItems: "stretch" }}>

          {/* Card 1 — Annonce */}
          <Link href="/annonce" style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "#0d0d0f", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", cursor: "pointer" }}>
            <div style={{ padding: "44px 40px 32px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#818CF8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{tx({fr:"Annonce", en:"Listing", es:"Anuncio", it:"Annuncio"})}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 400, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 12 }}>
                {tx({fr:"Génère ton annonce", en:"Generate your listing", es:"Genera tu anuncio", it:"Genera il tuo annuncio"})}<br/>
                <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.25)" }}>{tx({fr:"en 10 secondes.", en:"in 10 seconds.", es:"en 10 segundos.", it:"in 10 secondi."})}</em>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", marginBottom: 28, fontWeight: 300, lineHeight: 1.6 }}>{tx({fr:"Photo → titre, description, prix optimisés pour Vinted, Depop, Grailed.", en:"Photo → title, description, optimized price for Vinted, Depop, Grailed.", es:"Foto → título, descripción, precio optimizado.", it:"Foto → titolo, descrizione, prezzo ottimizzato."})}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ padding: "9px 22px", background: "#818CF8", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 10 }}>{tx({fr:"Essayer", en:"Try it", es:"Probar", it:"Prova"})}</span>
                <span style={{ padding: "9px 22px", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 13, border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 10 }}>{tx({fr:"En savoir plus", en:"Learn more", es:"Saber más", it:"Scopri di più"})}</span>
              </div>
            </div>
          </Link>

          {/* Card 2 — Protection */}
          <Link href="/protection" style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "#060f0c", border: "0.5px solid rgba(74,222,128,0.1)", borderRadius: 20, overflow: "hidden", cursor: "pointer" }}>
            <div style={{ padding: "44px 40px 32px" }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#4ADE80", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{tx({fr:"Protection", en:"Protection", es:"Protección", it:"Protezione"})}</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 400, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 12 }}>
                {tx({fr:"Certifie avant", en:"Certify before", es:"Certifica antes", it:"Certifica prima"})}<br/>
                <em style={{ fontStyle: "italic", color: "rgba(74,222,128,0.35)" }}>{tx({fr:"d'expédier.", en:"shipping.", es:"de enviar.", it:"di spedire."})}</em>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", marginBottom: 28, fontWeight: 300, lineHeight: 1.6 }}>{tx({fr:"Vidéo horodatée + certificat SHA-256. Preuve légale inattaquable en cas de litige.", en:"Timestamped video + SHA-256 certificate. Unassailable legal proof.", es:"Vídeo con timestamp + certificado SHA-256.", it:"Video con timestamp + certificato SHA-256."})}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ padding: "9px 22px", background: "#4ADE80", color: "#000", fontSize: 13, fontWeight: 600, borderRadius: 10 }}>{tx({fr:"Protéger", en:"Protect", es:"Proteger", it:"Proteggi"})}</span>
                <span style={{ padding: "9px 22px", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 13, border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 10 }}>{tx({fr:"En savoir plus", en:"Learn more", es:"Saber más", it:"Scopri di più"})}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Card 3 — Litige pleine largeur */}
        <div style={{ display: "block", background: "#0a060d", border: "0.5px solid rgba(244,114,182,0.1)", borderRadius: 20, overflow: "hidden", cursor: "pointer" }} onClick={function() { window.location.href = "/litige"; }}>
          <div style={{ padding: "44px 40px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#F472B6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>{tx({fr:"Litige", en:"Dispute", es:"Litigio", it:"Litigio"})}</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 400, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 12 }}>
              {tx({fr:"Défense automatique.", en:"Automatic defense.", es:"Defensa automática.", it:"Difesa automatica."})}<br/>
              <em style={{ fontStyle: "italic", color: "rgba(244,114,182,0.35)" }}>{tx({fr:"En 1 clic.", en:"In 1 click.", es:"En 1 clic.", it:"In 1 clic."})}</em>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", marginBottom: 28, fontWeight: 300, lineHeight: 1.6, maxWidth: 320 }}>{tx({fr:"L'IA analyse les photos, détecte la fraude et génère ta réponse de défense.", en:"AI analyzes photos, detects fraud and generates your defense response.", es:"La IA analiza las fotos y genera tu respuesta.", it:"L'IA analizza le foto e genera la tua risposta."})}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ padding: "9px 22px", background: "#F472B6", color: "#fff", fontSize: 13, fontWeight: 600, borderRadius: 10 }}>{tx({fr:"Gérer un litige", en:"Handle dispute", es:"Gestionar litigio", it:"Gestisci litigio"})}</span>
              <span style={{ padding: "9px 22px", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 13, border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 10 }}>{tx({fr:"En savoir plus", en:"Learn more", es:"Saber más", it:"Scopri di più"})}</span>
            </div>
          </div>
        </div>
      </section>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
      {/* ═══ CTA FINAL ═══ */}
      <section className="final-cta">
        <h2 className="final-title">{tx({fr:"Protège ton argent", en:"Protect your money", es:"Protege tu dinero", it:"Proteggi i tuoi soldi"})}<br/><em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>{tx({fr:"maintenant.", en:"now.", es:"ahora.", it:"adesso."})}</em></h2>
        <p className="final-sub">{tx({fr:"Chaque vente non protégée est un risque.", en:"Every unprotected sale is a risk.", es:"Cada venta sin proteger es un riesgo.", it:"Ogni vendita non protetta è un rischio."})}</p>
        <Link href="/annonce" className="btn-primary" style={{ fontSize: 15, padding: "16px 48px" }}>{tx({fr:"Essayer gratuitement", en:"Try for free", es:"Probar gratis", it:"Prova gratis"})}</Link>
        <div style={{ marginTop: 18, fontSize: 12, color: "var(--dim)" }}>Vinted · Depop · Grailed · Vestiaire Collective · Etsy</div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="footer-logo">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/><text x="11" y="14.5" fontFamily="-apple-system,sans-serif" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.3)" textAnchor="middle">SC</text></svg>
          SellCov
        </div>
        <div className="footer-links">
          <a href="mailto:hello@sellcov.com">{tx({fr:"FAQ", en:"FAQ", es:"FAQ", it:"FAQ"})}</a>
          <a href="mailto:hello@sellcov.com">{tx({fr:"Contact", en:"Contact", es:"Contacto", it:"Contatto"})}</a>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input id="newsletter" type="email" placeholder={tx({fr:"Ton email", en:"Your email", es:"Tu email", it:"La tua email"})} style={{ padding: "7px 14px", fontSize: 12, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 8, color: "#fff", fontFamily: "var(--sans)", outline: "none", width: 180 }} />
          <button onClick={function() { var em = document.getElementById("newsletter"); if (em.value) { window.location.href = "mailto:hello@sellcov.com?subject=Newsletter SellCov&body=" + tx({fr:"Inscris-moi : ", en:"Sign me up: ", es:"Suscríbeme: ", it:"Iscrivimi: "}) + em.value; em.value = ""; } }} style={{ padding: "7px 14px", fontSize: 11, fontWeight: 600, background: "rgba(255,255,255,0.08)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 8, color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "var(--sans)" }}>{tx({fr:"Newsletter", en:"Newsletter", es:"Newsletter", it:"Newsletter"})}</button>
        </div>
        <div className="footer-copy">© 2026 SellCov</div>
      </footer>
    </>
  );
}
