import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(function() {
    // Scroll reveal
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(".step-card, .mod-card, .stat-cell").forEach(function(el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      io.observe(el);
    });

    // Step cycling
    var steps = document.querySelectorAll(".vf-step");
    var cur = 0;
    var interval = setInterval(function() {
      steps[cur].classList.remove("active");
      cur = (cur + 1) % steps.length;
      steps[cur].classList.add("active");
    }, 2200);

    return function() { clearInterval(interval); };
  }, []);

  function scrollTo(id) {
    var el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <Head>
        <title>SellGuard — Revendre, sans la galère.</title>
        <meta name="description" content="De l'annonce à la livraison, SellGuard gère tout ce que Vinted, Depop et Grailed ne font pas." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #000; --bg2: #0A0A0A; --bg3: #111;
          --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.14);
          --text: #fff; --muted: rgba(255,255,255,0.42); --dim: rgba(255,255,255,0.22);
          --violet: #818CF8; --violet-bg: rgba(99,102,241,0.1);
          --green: #4ADE80; --green-bg: rgba(34,197,94,0.1);
          --orange: #FB923C; --orange-bg: rgba(251,146,60,0.1);
          --pink: #F472B6; --pink-bg: rgba(236,72,153,0.1);
          --blue: #38BDF8; --blue-bg: rgba(56,189,248,0.1);
          --serif: 'DM Serif Display', Georgia, serif;
          --sans: 'DM Sans', -apple-system, sans-serif;
        }
        html { scroll-behavior: smooth; }
        body { font-family: var(--sans); background: var(--bg); color: var(--text); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        .lp-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 36px; height: 54px;
          background: rgba(0,0,0,0.82); border-bottom: 0.5px solid var(--border);
          backdrop-filter: blur(20px);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; font-family: var(--serif); font-size: 18px; color: var(--text); letter-spacing: -0.01em; text-decoration: none; cursor: pointer; }
        .nav-links { display: flex; gap: 28px; }
        .nav-links a { font-size: 12px; color: var(--muted); text-decoration: none; transition: color 0.2s; font-weight: 400; letter-spacing: 0.01em; cursor: pointer; }
        .nav-links a:hover { color: var(--text); }
        .nav-cta { padding: 8px 20px; background: var(--text); color: var(--bg); font-size: 12px; font-weight: 500; border-radius: 20px; border: none; cursor: pointer; transition: opacity 0.2s; font-family: var(--sans); text-decoration: none; }
        .nav-cta:hover { opacity: 0.88; }

        .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 80px 32px 100px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -180px; left: 50%; transform: translateX(-50%); width: 700px; height: 700px; background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 68%); pointer-events: none; }
        .hero-badge { display: inline-flex; align-items: center; gap: 7px; padding: 5px 14px; background: rgba(255,255,255,0.04); border: 0.5px solid var(--border2); border-radius: 20px; font-size: 11px; color: var(--muted); letter-spacing: 0.05em; margin-bottom: 32px; animation: fadeUp 0.5s ease both; }
        .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
        .lp-h1 { font-family: var(--serif); font-size: clamp(48px, 8vw, 80px); font-weight: 400; line-height: 1.04; letter-spacing: -0.02em; color: var(--text); margin-bottom: 10px; animation: fadeUp 0.5s 0.08s ease both; }
        .lp-h1 em { font-style: italic; color: rgba(255,255,255,0.32); }
        .hero-sub { font-size: 17px; color: var(--muted); line-height: 1.68; max-width: 400px; margin: 0 auto 40px; font-weight: 300; animation: fadeUp 0.5s 0.16s ease both; }
        .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.5s 0.24s ease both; }
        .btn-primary { padding: 14px 34px; background: var(--text); color: var(--bg); font-size: 14px; font-weight: 500; border-radius: 28px; border: none; cursor: pointer; transition: transform 0.15s, opacity 0.15s; font-family: var(--sans); text-decoration: none; display: inline-block; }
        .btn-primary:hover { opacity: 0.88; transform: scale(1.02); }
        .btn-ghost { padding: 14px 34px; background: transparent; color: var(--text); font-size: 14px; font-weight: 400; border-radius: 28px; border: 0.5px solid rgba(255,255,255,0.2); cursor: pointer; transition: background 0.15s; font-family: var(--sans); }
        .btn-ghost:hover { background: rgba(255,255,255,0.05); }
        .hero-note { margin-top: 18px; font-size: 12px; color: var(--dim); letter-spacing: 0.05em; animation: fadeUp 0.5s 0.32s ease both; }

        .video-wrap { padding: 0 32px 80px; display: flex; justify-content: center; }
        .video-frame { width: 100%; max-width: 820px; background: var(--bg2); border: 0.5px solid var(--border); border-radius: 20px; overflow: hidden; }
        .vf-bar { display: flex; align-items: center; gap: 7px; padding: 13px 20px; border-bottom: 0.5px solid var(--border); }
        .vf-dot { width: 10px; height: 10px; border-radius: 50%; }
        .vf-url { flex: 1; text-align: center; font-size: 11px; color: rgba(255,255,255,0.18); letter-spacing: 0.05em; }
        .vf-body { padding: 52px 40px; display: flex; align-items: center; justify-content: center; gap: 52px; min-height: 300px; position: relative; }
        .vf-phone { width: 112px; height: 196px; background: #111; border-radius: 22px; border: 1.5px solid rgba(255,255,255,0.1); overflow: hidden; display: flex; flex-direction: column; padding: 12px 10px; gap: 6px; flex-shrink: 0; }
        .vf-ph-bar { height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; }
        .vf-ph-img { flex: 1; background: #1A1A2E; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .vf-ph-price { font-size: 9px; color: rgba(255,255,255,0.45); text-align: center; letter-spacing: 0.04em; }
        .vf-steps { display: flex; flex-direction: column; gap: 10px; }
        .vf-step { display: flex; align-items: center; gap: 12px; padding: 11px 15px; background: var(--bg3); border: 0.5px solid var(--border); border-radius: 12px; min-width: 230px; transition: border-color 0.3s; }
        .vf-step.active { border-color: rgba(255,255,255,0.2); }
        .vf-step-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .vf-step-name { font-size: 12px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
        .vf-step-desc { font-size: 11px; color: var(--muted); }

        .ticker { border-top: 0.5px solid var(--border); border-bottom: 0.5px solid var(--border); padding: 13px 0; overflow: hidden; white-space: nowrap; }
        .ticker-inner { display: inline-flex; gap: 52px; animation: ticker 26s linear infinite; }
        .ticker-item { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--dim); }
        .ticker-sep { color: rgba(255,255,255,0.08); }

        .section { padding: 96px 32px; }
        .section-eyebrow { text-align: center; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--dim); margin-bottom: 14px; }
        .section-title { text-align: center; font-family: var(--serif); font-size: clamp(32px, 4.5vw, 48px); font-weight: 400; letter-spacing: -0.02em; color: var(--text); margin-bottom: 8px; line-height: 1.1; }
        .section-title em { font-style: italic; color: rgba(255,255,255,0.35); }
        .section-sub { text-align: center; font-size: 15px; color: var(--muted); margin-bottom: 60px; font-weight: 300; }

        .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px,1fr)); gap: 1px; background: var(--border); border: 0.5px solid var(--border); border-radius: 18px; overflow: hidden; max-width: 920px; margin: 0 auto; }
        .step-card { background: var(--bg); padding: 36px 28px; transition: background 0.2s; }
        .step-card:hover { background: var(--bg2); }
        .step-num { font-size: 11px; color: var(--dim); letter-spacing: 0.1em; margin-bottom: 20px; }
        .step-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .step-name { font-size: 15px; font-weight: 500; color: var(--text); margin-bottom: 8px; }
        .step-desc { font-size: 13px; color: var(--muted); line-height: 1.65; margin-bottom: 16px; font-weight: 300; }
        .step-badge { display: inline-block; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 500; }

        .modules-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; max-width: 920px; margin: 0 auto; }
        .mod-card { background: var(--bg2); border: 0.5px solid var(--border); border-radius: 18px; padding: 28px; cursor: pointer; transition: border-color 0.2s, background 0.2s; text-decoration: none; display: block; }
        .mod-card:hover { background: var(--bg3); border-color: var(--border2); }
        .mod-card.wide { grid-column: 1/-1; display: flex; align-items: center; justify-content: space-between; gap: 32px; }
        .mod-eyebrow { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; opacity: 0.75; }
        .mod-title { font-family: var(--serif); font-size: 22px; font-weight: 400; color: var(--text); letter-spacing: -0.01em; margin-bottom: 8px; line-height: 1.2; }
        .mod-card.wide .mod-title { font-size: 28px; }
        .mod-desc { font-size: 13px; color: var(--muted); line-height: 1.55; font-weight: 300; }
        .mod-pill { display: inline-block; padding: 5px 14px; border-radius: 14px; font-size: 12px; font-weight: 500; margin-top: 16px; }
        .mod-icon-box { width: 120px; height: 88px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .stats-band { margin: 0 32px; background: var(--bg2); border: 0.5px solid var(--border); border-radius: 20px; display: grid; grid-template-columns: repeat(3,1fr); overflow: hidden; }
        .stat-cell { padding: 44px 24px; text-align: center; border-right: 0.5px solid var(--border); }
        .stat-cell:last-child { border-right: none; }
        .stat-n { font-family: var(--serif); font-size: 52px; font-weight: 400; color: var(--text); letter-spacing: -0.03em; line-height: 1; margin-bottom: 10px; }
        .stat-l { font-size: 13px; color: var(--muted); font-weight: 300; }

        .final-cta { padding: 120px 32px; text-align: center; }
        .final-title { font-family: var(--serif); font-size: clamp(40px,6vw,68px); font-weight: 400; letter-spacing: -0.03em; color: var(--text); line-height: 1.05; margin-bottom: 18px; }
        .final-title em { font-style: italic; color: rgba(255,255,255,0.35); }
        .final-sub { font-size: 16px; color: var(--muted); margin-bottom: 40px; font-weight: 300; line-height: 1.6; }
        .final-note { margin-top: 16px; font-size: 12px; color: var(--dim); letter-spacing: 0.05em; }

        .lp-footer { border-top: 0.5px solid var(--border); padding: 32px 36px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-logo { display: flex; align-items: center; gap: 10px; font-family: var(--serif); font-size: 16px; color: var(--dim); }
        .footer-links { display: flex; gap: 28px; }
        .footer-links a { font-size: 12px; color: var(--dim); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--muted); }
        .footer-copy { font-size: 11px; color: rgba(255,255,255,0.14); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        @media (max-width: 640px) {
          .lp-nav { padding: 0 20px; }
          .nav-links { display: none; }
          .modules-grid { grid-template-columns: 1fr; }
          .mod-card.wide { flex-direction: column; }
          .mod-icon-box { display: none; }
          .steps-grid { grid-template-columns: 1fr; }
          .stats-band { grid-template-columns: 1fr; margin: 0 20px; }
          .stat-cell { border-right: none; border-bottom: 0.5px solid var(--border); }
          .stat-cell:last-child { border-bottom: none; }
          .vf-body { flex-direction: column; gap: 24px; }
          .lp-footer { flex-direction: column; align-items: flex-start; }
          .video-wrap { padding: 0 16px 48px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="lp-nav">
        <span className="nav-logo">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="14" stroke="#fff" strokeWidth="1.2"/>
            <circle cx="15" cy="15" r="10" stroke="#fff" strokeWidth="0.4" strokeDasharray="2.8 2.8"/>
            <text x="15" y="19.5" fontFamily="-apple-system,Helvetica Neue,sans-serif" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="-0.02em">SG</text>
          </svg>
          SellGuard
        </span>
        <div className="nav-links">
          <a onClick={function() { scrollTo("#how"); }}>Comment ça marche</a>
          <a onClick={function() { scrollTo("#modules"); }}>Modules</a>
          <a onClick={function() { scrollTo("#cta"); }}>Commencer</a>
        </div>
        <Link href="/annonce" className="nav-cta">Gratuit · Bêta</Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          Bêta ouverte · 100% gratuit
        </div>
        <h1 className="lp-h1">Revendre,<br/><em>sans la galère.</em></h1>
        <p className="hero-sub">De l'annonce à la livraison, SellGuard gère tout ce que Vinted, Depop et Grailed ne font pas.</p>
        <div className="hero-actions">
          <Link href="/annonce" className="btn-primary">Essayer gratuitement</Link>
          <button className="btn-ghost" onClick={function() { scrollTo("#how"); }}>Voir comment ça marche</button>
        </div>
        <div className="hero-note">Vinted · Depop · Grailed · Vestiaire Collective</div>
      </section>

      {/* VIDEO FRAME */}
      <div className="video-wrap">
        <div className="video-frame">
          <div className="vf-bar">
            <div className="vf-dot" style={{ background: "#FF5F57" }}></div>
            <div className="vf-dot" style={{ background: "#FEBC2E" }}></div>
            <div className="vf-dot" style={{ background: "#28C840" }}></div>
            <div className="vf-url">sellguard.vercel.app</div>
          </div>
          <div className="vf-body">
            <div className="vf-phone">
              <div className="vf-ph-bar" style={{ width: "65%" }}></div>
              <div className="vf-ph-bar" style={{ width: "42%" }}></div>
              <div className="vf-ph-img">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="4" width="20" height="20" rx="3" stroke="rgba(255,255,255,0.14)" strokeWidth="1"/><path d="M9 14h10M14 9v10" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeLinecap="round"/></svg>
              </div>
              <div className="vf-ph-price">Levi's 501 · 38€</div>
            </div>
            <div className="vf-steps">
              <div className="vf-step active">
                <div className="vf-step-icon" style={{ background: "var(--violet-bg)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="#818CF8" strokeWidth="1"/><path d="M5 7h6M5 10h4" stroke="#818CF8" strokeWidth="1" strokeLinecap="round"/></svg>
                </div>
                <div><div className="vf-step-name">Annonce générée</div><div className="vf-step-desc">Photo → titre, desc, prix · 30 sec</div></div>
              </div>
              <div className="vf-step">
                <div className="vf-step-icon" style={{ background: "var(--green-bg)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l6 2.5v5c0 3.5-6 6.5-6 6.5S2 13 2 9.5V4.5L8 2z" stroke="#4ADE80" strokeWidth="1" strokeLinejoin="round"/></svg>
                </div>
                <div><div className="vf-step-name">Photos certifiées</div><div className="vf-step-desc">Horodatage légal avant envoi</div></div>
              </div>
              <div className="vf-step">
                <div className="vf-step-icon" style={{ background: "var(--orange-bg)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 12l3-5 3 3 4-6" stroke="#FB923C" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div><div className="vf-step-name">Vente suivie</div><div className="vf-step-desc">Dashboard · marges en temps réel</div></div>
              </div>
              <div className="vf-step">
                <div className="vf-step-icon" style={{ background: "var(--pink-bg)" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#F472B6" strokeWidth="1"/><path d="M6 6.5s0-1.5 2-1.5 2 1.5 2 1.5-1 1.5-2 2v.3" stroke="#F472B6" strokeWidth="1" strokeLinecap="round"/><circle cx="8" cy="11" r=".6" fill="#F472B6"/></svg>
                </div>
                <div><div className="vf-step-name">Litige défendu</div><div className="vf-step-desc">Réponse auto · fraude détectée</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {["Annonce IA", "Protection légale", "Anti-fraude", "Calcul de marges", "Suivi des ventes", "Prix du marché", "Vinted · Depop · Grailed", "Annonce IA", "Protection légale", "Anti-fraude", "Calcul de marges", "Suivi des ventes", "Prix du marché", "Vinted · Depop · Grailed"].map(function(t, i) {
            return <span key={i}><span className="ticker-item">{t}</span><span className="ticker-sep"> — </span></span>;
          })}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="section-eyebrow">Comment ça marche</div>
        <h2 className="section-title">De la photo<br/><em>à la livraison.</em></h2>
        <p className="section-sub">4 étapes. Zéro stress.</p>
        <div className="steps-grid">
          {[
            { num: "01", name: "Tu prends une photo", desc: "L'IA génère titre, description et prix optimal pour chaque plateforme en moins de 30 secondes.", badge: "Annonce IA", color: "--violet" },
            { num: "02", name: "Tu certifies avant envoi", desc: "Horodatage numérique automatique. Preuve légale inattaquable en cas de litige.", badge: "Protection légale", color: "--green" },
            { num: "03", name: "Tu suis tes ventes", desc: "Toutes tes annonces centralisées. Marges, commissions et prix du marché en temps réel.", badge: "Dashboard pro", color: "--orange" },
            { num: "04", name: "Un litige ? On gère.", desc: "Détection fraude IA instantanée. Réponse de défense générée automatiquement en un clic.", badge: "Anti-fraude", color: "--pink" },
          ].map(function(s) {
            return (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <div className="step-icon" style={{ background: "var(" + s.color + "-bg)" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {s.num === "01" && <><rect x="2" y="3" width="16" height="14" rx="2" stroke={"var(" + s.color + ")"} strokeWidth="1.2"/><path d="M5 9h10M5 13h6" stroke={"var(" + s.color + ")"} strokeWidth="1.2" strokeLinecap="round"/></>}
                    {s.num === "02" && <><path d="M10 2l8 3.5v6.5c0 5-8 8.5-8 8.5s-8-3.5-8-8.5V5.5L10 2z" stroke={"var(" + s.color + ")"} strokeWidth="1.2" strokeLinejoin="round"/><path d="M7 10l2.5 2.5L13 9" stroke={"var(" + s.color + ")"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></>}
                    {s.num === "03" && <path d="M4 16l4-8 4 4 5-8" stroke={"var(" + s.color + ")"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>}
                    {s.num === "04" && <><circle cx="10" cy="10" r="7" stroke={"var(" + s.color + ")"} strokeWidth="1.2"/><path d="M8 8.5s0-2 2-2 2 2 2 2-1 1.5-2 2.5v.4" stroke={"var(" + s.color + ")"} strokeWidth="1.2" strokeLinecap="round"/><circle cx="10" cy="14" r=".8" fill={"var(" + s.color + ")"}/></>}
                  </svg>
                </div>
                <div className="step-name">{s.name}</div>
                <div className="step-desc">{s.desc}</div>
                <div className="step-badge" style={{ background: "var(" + s.color + "-bg)", color: "var(" + s.color + ")" }}>{s.badge}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* MODULES */}
      <section className="section" id="modules" style={{ paddingTop: 0 }}>
        <div className="section-eyebrow">Les modules</div>
        <h2 className="section-title">Tout ce qu'il te faut.</h2>
        <p className="section-sub" style={{ marginBottom: 40 }}>6 outils. Une seule app.</p>
        <div className="modules-grid">
          <Link href="/annonce" className="mod-card wide">
            <div>
              <div className="mod-eyebrow" style={{ color: "var(--violet)" }}>Annonce IA</div>
              <div className="mod-title">Photo → annonce parfaite en secondes.</div>
              <div className="mod-desc">Titre, description, hashtags et prix optimisés pour Vinted, Depop, Grailed et Vestiaire.</div>
              <div className="mod-pill" style={{ background: "var(--violet-bg)", color: "var(--violet)" }}>Essayer →</div>
            </div>
            <div className="mod-icon-box" style={{ background: "rgba(99,102,241,0.06)", border: "0.5px solid rgba(99,102,241,0.14)" }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><rect x="6" y="7" width="32" height="30" rx="4" stroke="#818CF8" strokeWidth="1.2"/><path d="M12 19h20M12 26h12" stroke="#818CF8" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
          </Link>
          <Link href="/protection" className="mod-card">
            <div className="mod-eyebrow" style={{ color: "var(--green)" }}>Protection</div>
            <div className="mod-title">Certifie avant d'envoyer.</div>
            <div className="mod-desc">Horodatage légal automatique. Inattaquable en cas de litige.</div>
            <div className="mod-pill" style={{ background: "var(--green-bg)", color: "var(--green)" }}>Légal →</div>
          </Link>
          <Link href="/litige" className="mod-card">
            <div className="mod-eyebrow" style={{ color: "var(--pink)" }}>Litige</div>
            <div className="mod-title">Défense automatique.</div>
            <div className="mod-desc">Fraude IA détectée, réponse générée en 1 clic.</div>
            <div className="mod-pill" style={{ background: "var(--pink-bg)", color: "var(--pink)" }}>Anti-fraude →</div>
          </Link>
          <Link href="/calculateur" className="mod-card">
            <div className="mod-eyebrow" style={{ color: "var(--orange)" }}>Calculateur</div>
            <div className="mod-title">Marge exacte.</div>
            <div className="mod-desc">Frais, commissions et marges nettes par plateforme.</div>
            <div className="mod-pill" style={{ background: "var(--orange-bg)", color: "var(--orange)" }}>Calculer →</div>
          </Link>
          <Link href="/prix" className="mod-card">
            <div className="mod-eyebrow" style={{ color: "var(--blue)" }}>Prix marché</div>
            <div className="mod-title">Prix en un clic.</div>
            <div className="mod-desc">Compare les prix sur toutes les plateformes simultanément.</div>
            <div className="mod-pill" style={{ background: "var(--blue-bg)", color: "var(--blue)" }}>Comparer →</div>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-band">
        <div className="stat-cell"><div className="stat-n">6</div><div className="stat-l">Modules inclus</div></div>
        <div className="stat-cell"><div className="stat-n">0 €</div><div className="stat-l">Pendant la bêta</div></div>
        <div className="stat-cell"><div className="stat-n">4</div><div className="stat-l">Plateformes</div></div>
      </div>

      {/* FINAL CTA */}
      <section className="final-cta" id="cta">
        <h2 className="final-title">Commence<br/><em>maintenant.</em></h2>
        <p className="final-sub">Gratuit pendant toute la phase bêta.<br/>Sans carte bleue. Sans engagement.</p>
        <Link href="/annonce" className="btn-primary" style={{ fontSize: 15, padding: "16px 48px" }}>Essayer gratuitement</Link>
        <div className="final-note">Vinted · Depop · Grailed · Vestiaire Collective</div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="footer-logo">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/><circle cx="11" cy="11" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" strokeDasharray="2.2 2.2"/><text x="11" y="14.5" fontFamily="-apple-system,sans-serif" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.3)" textAnchor="middle" letterSpacing="-0.01em">SG</text></svg>
          SellGuard
        </div>
        <div className="footer-links">
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
        </div>
        <div className="footer-copy">© 2026 SellGuard</div>
      </footer>
    </>
  );
}
