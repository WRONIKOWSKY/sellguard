import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

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

  function scrollTo(id) { var el = document.querySelector(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }

  return (
    <>
      <Head>
        <title>SellCov — Revends sans te faire arnaquer.</title>
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

        .pain-list { list-style: none; display: flex; flex-direction: column; gap: 12px; max-width: 500px; margin: 0 auto; }
        .pain-item { font-size: 15px; color: var(--red); display: flex; align-items: center; gap: 10px; }
        .pain-callout { text-align: center; margin-top: 32px; font-size: 15px; color: var(--muted); font-weight: 400; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.6; }

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

        .modules-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 48px; }
        .mod-card { background: var(--bg2); border: 0.5px solid var(--border); border-radius: 18px; padding: 28px; text-decoration: none; display: block; transition: border-color 0.2s; cursor: pointer; }
        .mod-card:hover { border-color: var(--border2); }

        .flow-row { display: flex; align-items: center; justify-content: center; gap: 24px; margin-top: 48px; flex-wrap: wrap; }
        .flow-step { text-align: center; padding: 20px; }
        .flow-num { font-family: var(--serif); font-size: 36px; margin-bottom: 8px; }
        .flow-label { font-size: 14px; color: var(--muted); font-weight: 300; }
        .flow-arrow { font-size: 24px; color: rgba(255,255,255,0.15); }

        .pricing-card { max-width: 420px; margin: 48px auto 0; background: var(--bg2); border: 0.5px solid var(--border); border-radius: 20px; padding: 40px; text-align: center; }

        .social-proof { display: flex; justify-content: center; gap: 32px; margin-top: 48px; flex-wrap: wrap; }
        .proof-item { text-align: center; }
        .proof-num { font-family: var(--serif); font-size: 28px; color: var(--text); }
        .proof-label { font-size: 12px; color: var(--muted); margin-top: 4px; }

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
          .modules-row { grid-template-columns: 1fr; }
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
          <a onClick={function() { scrollTo("#problem"); }}>Pourquoi</a>
          <a onClick={function() { scrollTo("#how"); }}>Comment</a>
          <a onClick={function() { scrollTo("#modules"); }}>Modules</a>
        </div>
        <Link href="/annonce" className="nav-cta">Essayer gratuit</Link>
      </nav>

      {/* ═══ 1. HERO ═══ */}
      <section className="hero">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 20, fontSize: 11, color: "var(--muted)", marginBottom: 32, animation: "fadeUp 0.5s ease both" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }}></span>
          Bêta gratuite (places limitées)
        </div>
        <h1 className="lp-h1">Revends<br/><em>sans te faire arnaquer.</em></h1>
        <p className="hero-sub">On protège ton argent. À chaque envoi.</p>
        <p className="hero-sub2">Preuve horodatée. Défense automatique.</p>
        <div className="hero-actions">
          <Link href="/annonce" className="btn-primary">Essayer gratuitement</Link>
          <button className="btn-ghost" onClick={function() { scrollTo("#problem"); }}>Voir comment ça marche</button>
        </div>
        <div style={{ marginTop: 18, fontSize: 12, color: "var(--dim)", animation: "fadeUp 0.5s 0.32s ease both" }}>Vinted · Depop · Grailed · Vestiaire Collective · Etsy</div>
      </section>

      {/* ═══ 2. PROBLÈME ═══ */}
      <section className="section" id="problem">
        <h2 className="section-title">Tu peux perdre ton argent<br/><em>sur une seule vente.</em></h2>
        <div style={{ height: 40 }}></div>
        <ul className="pain-list reveal">
          <li className="pain-item">✕ "Article abîmé" → tu rembourses</li>
          <li className="pain-item">✕ L'acheteur ment → tu perds</li>
          <li className="pain-item">✕ Aucune protection → aucun recours</li>
        </ul>
        <p className="pain-callout reveal" style={{ fontWeight: 500, color: "var(--red)" }}>Tu prends 100% du risque.</p>
      </section>

      {/* ═══ 3. SOLUTION ═══ */}
      <section className="section" style={{ paddingTop: 40 }}>
        <h2 className="section-title">Tu vends.<br/><em>On protège.</em></h2>
        <p className="section-sub" style={{ marginBottom: 40 }}>Avant l'envoi, ton article est :</p>
        <div className="solution-list reveal">
          <div className="solution-item">✓ Horodaté automatiquement</div>
          <div className="solution-item">✓ Certifié avec preuve</div>
          <div className="solution-item">✓ Enregistré de façon sécurisée</div>
        </div>
        <p className="solution-callout reveal">L'acheteur conteste ? Tu as la preuve.</p>
      </section>

      {/* ═══ 4. COMMENT ÇA MARCHE ═══ */}
      <section className="section" id="how" style={{ paddingTop: 40 }}>
        <h2 className="section-title">4 étapes.<br/><em>Tu es couvert.</em></h2>
        <p className="section-sub"></p>
        <div className="steps-grid">
          {[
            { n: "01", name: "Tu prends une photo", desc: "Annonce générée. Prix, description, hashtags.", color: "var(--violet)" },
            { n: "02", name: "Tu certifies avant envoi", desc: "Preuve horodatée. Impossible à contester.", color: "var(--green)" },
            { n: "03", name: "Tu expédies", desc: "Suivi + preuve de dépôt sauvegardés.", color: "var(--muted)" },
            { n: "04", name: "Un litige ?", desc: "Défense générée en 1 clic.", color: "var(--pink)" },
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

      {/* ═══ 5. ANTI-ARNAQUE ═══ */}
      <section className="section" style={{ paddingTop: 40 }}>
        <h2 className="section-title">Avant vs Après<br/><em>SellCov.</em></h2>
        <div className="compare-grid">
          <div className="compare-card reveal" style={{ background: "rgba(248,113,113,0.04)", border: "0.5px solid rgba(248,113,113,0.15)" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>❌ Sans SellCov</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 14, color: "var(--red)" }}>✕ "Article abîmé à la réception"</div>
              <div style={{ fontSize: 14, color: "var(--red)" }}>✕ Plateforme rembourse l'acheteur</div>
              <div style={{ fontSize: 14, color: "var(--red)" }}>✕ Tu perds ton produit + ton argent</div>
              <div style={{ fontSize: 14, color: "var(--red)" }}>✕ Aucune preuve valable</div>
            </div>
          </div>
          <div className="compare-card reveal" style={{ background: "rgba(74,222,128,0.04)", border: "0.5px solid rgba(74,222,128,0.15)" }}>
            <div style={{ fontSize: 12, color: "var(--green)", marginBottom: 20 }}>✅ Avec SellCov</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 14, color: "var(--green)" }}>✓ Preuve enregistrée automatiquement</div>
              <div style={{ fontSize: 14, color: "var(--green)" }}>✓ Envoi certifié avant expédition</div>
              <div style={{ fontSize: 14, color: "var(--green)" }}>✓ Réponse prête immédiatement</div>
              <div style={{ fontSize: 14, color: "var(--green)" }}>✓ Ton argent est protégé</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ fontFamily: "var(--serif)", fontSize: 26, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            Si l'acheteur ment,<br/><em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>tu peux le prouver.</em>
          </p>
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/protection" className="btn-primary">Activer la protection</Link>
        </div>
      </section>

      {/* ═══ 6. MODULES ═══ */}
      <section className="section" id="modules" style={{ paddingTop: 40 }}>
        <h2 className="section-title">Tout ce qu'il te faut.<br/><em>Rien de plus.</em></h2>
        <div className="modules-row">
          <Link href="/annonce" className="mod-card reveal">
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--violet)", marginBottom: 12 }}>Annonce</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--text)", marginBottom: 8 }}>Photo → annonce optimisée en 30 secondes.</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, fontWeight: 300 }}>Titre, description, prix, hashtags. Prête à poster.</div>
          </Link>
          <Link href="/protection" className="mod-card reveal">
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--green)", marginBottom: 12 }}>Protection</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--text)", marginBottom: 8 }}>Certification + preuve horodatée.</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, fontWeight: 300 }}>Vidéo + certificat SHA-256. Inattaquable.</div>
          </Link>
          <Link href="/litige" className="mod-card reveal">
            <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--pink)", marginBottom: 12 }}>Défense</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--text)", marginBottom: 8 }}>Réponse automatique en cas de litige.</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, fontWeight: 300 }}>Photos truquées détectées. Défense en 1 clic.</div>
          </Link>
        </div>
      </section>

      {/* ═══ 9. CTA FINAL ═══ */}
      <section className="final-cta">
        <h2 className="final-title">Protège ton argent<br/><em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.35)" }}>maintenant.</em></h2>
        <p className="final-sub">Chaque vente non protégée est un risque.</p>
        <Link href="/annonce" className="btn-primary" style={{ fontSize: 15, padding: "16px 48px" }}>Essayer gratuitement</Link>
        <div style={{ marginTop: 18, fontSize: 12, color: "var(--dim)" }}>Vinted · Depop · Grailed · Vestiaire Collective · Etsy</div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="footer-logo">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/><text x="11" y="14.5" fontFamily="-apple-system,sans-serif" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.3)" textAnchor="middle">SC</text></svg>
          SellCov
        </div>
        <div className="footer-links">
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
        </div>
        <div className="footer-copy">© 2026 SellCov</div>
      </footer>
    </>
  );
}
