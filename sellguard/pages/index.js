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

        .pain-list { list-style: none; display: flex; flex-direction: column; gap: 10px; max-width: 500px; margin: 0 auto; }
        .pain-item { font-size: 15px; color: var(--red); display: flex; align-items: center; gap: 10px; text-align: left; }
        .pain-callout { text-align: left; margin-top: 10px; font-size: 15px; color: var(--muted); font-weight: 400; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.6; }

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

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 640px) {
          .lp-nav { padding: 0 20px; }
          .nav-links { display: none; }
          .compare-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          .flow-arrow { display: none; }
          footer { flex-direction: column; align-items: flex-start; }
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

      {/* ═══ PROBLÈME ═══ */}
      <section className="section" id="problem">
        <h2 className="section-title">{tx({fr:"Tu peux perdre ton argent", en:"You can lose your money", es:"Puedes perder tu dinero", it:"Puoi perdere i tuoi soldi"})}<br/><em>{tx({fr:"sur une seule vente.", en:"on a single sale.", es:"en una sola venta.", it:"su una singola vendita."})}</em></h2>
        <div style={{ height: 40 }}></div>
        <ul className="pain-list reveal">
          <li className="pain-item">{tx({fr:"Un acheteur malhonnête, remboursement forcé", en:"A dishonest buyer, forced refund", es:"Un comprador deshonesto, reembolso forzado", it:"Un acquirente disonesto, rimborso forzato"})}</li>
          <li className="pain-item">{tx({fr:"Zéro preuve, zéro recours", en:"Zero proof, zero recourse", es:"Cero prueba, cero recurso", it:"Zero prove, zero ricorso"})}</li>
        </ul>
        <p className="pain-callout reveal" style={{ fontWeight: 500, color: "var(--red)" }}>{tx({fr:"Tu prends 100% du risque.", en:"You take 100% of the risk.", es:"Asumes el 100% del riesgo.", it:"Ti prendi il 100% del rischio."})}</p>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section className="section" style={{ paddingTop: 40 }}>
        <h2 className="section-title">{tx({fr:"Tu vends.", en:"You sell.", es:"Vendes.", it:"Vendi."})}<br/><em>{tx({fr:"On protège.", en:"We protect.", es:"Protegemos.", it:"Proteggiamo."})}</em></h2>
        <p className="section-sub" style={{ marginBottom: 40 }}>{tx({fr:"Chaque vente est sécurisée.", en:"Every sale is secured.", es:"Cada venta está asegurada.", it:"Ogni vendita è protetta."})}</p>
        <div className="solution-list reveal">
          <div className="solution-item">{tx({fr:"Horodatage automatique avant envoi", en:"Automatic timestamping before shipping", es:"Marca temporal automática antes del envío", it:"Timestamp automatico prima della spedizione"})}</div>
          <div className="solution-item">{tx({fr:"Certification avec preuve légale", en:"Certification with legal proof", es:"Certificación con prueba legal", it:"Certificazione con prova legale"})}</div>
          <div className="solution-item">{tx({fr:"Sauvegarde sécurisée de chaque envoi", en:"Secure backup of every shipment", es:"Respaldo seguro de cada envío", it:"Backup sicuro di ogni spedizione"})}</div>
        </div>
        <p className="solution-callout reveal">{tx({fr:"L'acheteur conteste ? Tu as la preuve.", en:"Buyer disputes? You have the proof.", es:"¿El comprador contesta? Tienes la prueba.", it:"L'acquirente contesta? Hai la prova."})}</p>
      </section>

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <section className="section" id="how" style={{ paddingTop: 40 }}>
        <h2 className="section-title">{tx({fr:"4 étapes.", en:"4 steps.", es:"4 pasos.", it:"4 passaggi."})}<br/><em>{tx({fr:"Tu es couvert.", en:"You're covered.", es:"Estás cubierto.", it:"Sei coperto."})}</em></h2>
        <div className="steps-grid">
          {[
            { n: "01", name: tx({fr:"Tu prends une photo", en:"Take a photo", es:"Tomas una foto", it:"Scatti una foto"}), desc: tx({fr:"Annonce générée. Prix, description, hashtags.", en:"Listing generated. Price, description, hashtags.", es:"Anuncio generado. Precio, descripción, hashtags.", it:"Annuncio generato. Prezzo, descrizione, hashtag."}), color: "var(--violet)" },
            { n: "02", name: tx({fr:"Tu certifies avant envoi", en:"Certify before shipping", es:"Certificas antes del envío", it:"Certifichi prima della spedizione"}), desc: tx({fr:"Preuve horodatée enregistrée.", en:"Timestamped proof recorded.", es:"Prueba con marca temporal registrada.", it:"Prova con timestamp registrata."}), color: "var(--green)" },
            { n: "03", name: tx({fr:"Tu expédies", en:"You ship", es:"Envías", it:"Spedisci"}), desc: tx({fr:"Suivi et preuve de dépôt sauvegardés.", en:"Tracking and deposit proof saved.", es:"Seguimiento y prueba de depósito guardados.", it:"Tracciamento e prova di deposito salvati."}), color: "#fff" },
            { n: "04", name: tx({fr:"Un litige ?", en:"A dispute?", es:"¿Un litigio?", it:"Una controversia?"}), desc: tx({fr:"Défense générée en 1 clic.", en:"Defense generated in 1 click.", es:"Defensa generada en 1 clic.", it:"Difesa generata in 1 clic."}), color: "var(--pink)" },
          ].map(function(s) {
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

      {/* ═══ AVANT / APRÈS ═══ */}
      <section className="section" style={{ paddingTop: 40 }}>
        <h2 className="section-title">{tx({fr:"Avant vs Après", en:"Before vs After", es:"Antes vs Después", it:"Prima vs Dopo"})}<br/><em>SellCov.</em></h2>
        <div className="compare-grid">
          <div className="compare-card reveal" style={{ background: "rgba(248,113,113,0.04)", border: "0.5px solid rgba(248,113,113,0.15)" }}>
            <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 20 }}>{tx({fr:"Avant SellCov", en:"Before SellCov", es:"Antes de SellCov", it:"Prima di SellCov"})}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 14, color: "var(--red)" }}>{tx({fr:"Réception contestée par l'acheteur", en:"Delivery contested by buyer", es:"Recepción contestada por el comprador", it:"Ricezione contestata dall'acquirente"})}</div>
              <div style={{ fontSize: 14, color: "var(--red)" }}>{tx({fr:"La plateforme rembourse l'acheteur", en:"Platform refunds the buyer", es:"La plataforma reembolsa al comprador", it:"La piattaforma rimborsa l'acquirente"})}</div>
              <div style={{ fontSize: 14, color: "var(--red)" }}>{tx({fr:"Tu perds ton produit et ton argent", en:"You lose your product and your money", es:"Pierdes tu producto y tu dinero", it:"Perdi il tuo prodotto e i tuoi soldi"})}</div>
              <div style={{ fontSize: 14, color: "var(--red)" }}>{tx({fr:"Aucune preuve valable", en:"No valid proof", es:"Ninguna prueba válida", it:"Nessuna prova valida"})}</div>
            </div>
          </div>
          <div className="compare-card reveal" style={{ background: "rgba(74,222,128,0.04)", border: "0.5px solid rgba(74,222,128,0.15)" }}>
            <div style={{ fontSize: 12, color: "var(--green)", marginBottom: 20 }}>{tx({fr:"Avec SellCov", en:"With SellCov", es:"Con SellCov", it:"Con SellCov"})}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 14, color: "var(--green)" }}>{tx({fr:"Preuve enregistrée automatiquement", en:"Proof recorded automatically", es:"Prueba registrada automáticamente", it:"Prova registrata automaticamente"})}</div>
              <div style={{ fontSize: 14, color: "var(--green)" }}>{tx({fr:"Envoi certifié avant expédition", en:"Shipment certified before sending", es:"Envío certificado antes de la expedición", it:"Spedizione certificata prima dell'invio"})}</div>
              <div style={{ fontSize: 14, color: "var(--green)" }}>{tx({fr:"Réponse de défense générée", en:"Defense response generated", es:"Respuesta de defensa generada", it:"Risposta di difesa generata"})}</div>
              <div style={{ fontSize: 14, color: "var(--green)" }}>{tx({fr:"Ton argent est protégé", en:"Your money is protected", es:"Tu dinero está protegido", it:"I tuoi soldi sono protetti"})}</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            {tx({fr:"Si l'acheteur ment,", en:"If the buyer lies,", es:"Si el comprador miente,", it:"Se l'acquirente mente,"})}<br/><em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>{tx({fr:"tu peux le prouver.", en:"you can prove it.", es:"puedes probarlo.", it:"puoi dimostrarlo."})}</em>
          </p>
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/protection" className="btn-primary">{tx({fr:"Activer la protection", en:"Activate protection", es:"Activar la protección", it:"Attiva la protezione"})}</Link>
        </div>
      </section>

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
