import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLang } from "../contexts/LangContext";

export default function Home() {
  var ref = useLang(), lang = ref.lang, setLang = ref.setLang;
  function tx(o) { return o[lang] || o.en || o.fr; }
  function scrollTo(id) { var el = document.querySelector(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }

  var _certTime = useState("17/04/2026 · 14:38:52"), certTime = _certTime[0], setCertTime = _certTime[1];
  useEffect(function() {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".reveal").forEach(function(el) { io.observe(el); });
    var t = setInterval(function() {
      setCertTime(new Date().toLocaleString("fr-FR"));
    }, 1000);
    return function() { io.disconnect(); clearInterval(t); };
  }, []);

  return (
    <>
      <Head>
        <title>SellCov — Protection des vendeurs</title>
        <meta name="description" content="Preuve horodatée. Défense automatique. Protège chaque vente." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #060608;
          --s1: #0e0e10;
          --s2: #141416;
          --s3: #1a1a1e;
          --border: rgba(255,255,255,0.06);
          --border2: rgba(255,255,255,0.12);
          --text: #f0f0f2;
          --muted: rgba(240,240,242,0.4);
          --dim: rgba(240,240,242,0.2);
          --green: #34d399;
          --green-dim: rgba(52,211,153,0.12);
          --green-border: rgba(52,211,153,0.2);
          --red: #f87171;
          --red-dim: rgba(248,113,113,0.08);
          --red-border: rgba(248,113,113,0.18);
          --blue: #60a5fa;
          --blue-dim: rgba(96,165,250,0.1);
          --serif: 'DM Serif Display', Georgia, serif;
          --sans: 'DM Sans', -apple-system, sans-serif;
        }
        html { scroll-behavior: smooth; }
        body { font-family: var(--sans); background: var(--bg); color: var(--text); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

        /* ── REVEAL ── */
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: none; }
        .reveal-d1 { transition-delay: 0.1s; }
        .reveal-d2 { transition-delay: 0.2s; }
        .reveal-d3 { transition-delay: 0.3s; }

        /* ── NAV ── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          height: 56px; padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(6,6,8,0.85); backdrop-filter: blur(24px);
          border-bottom: 0.5px solid var(--border);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-mark {
          width: 28px; height: 28px; border-radius: 8px;
          background: var(--s3); border: 0.5px solid var(--border2);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--serif); font-size: 11px; color: var(--text);
        }
        .nav-logo-name { font-family: var(--serif); font-size: 17px; color: var(--text); letter-spacing: -0.01em; }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a { font-size: 13px; color: var(--muted); text-decoration: none; cursor: pointer; transition: color 0.2s; }
        .nav-links a:hover { color: var(--text); }
        .nav-right { display: flex; align-items: center; gap: 10px; }
        .lang-select {
          appearance: none; padding: 6px 12px; font-size: 11px; font-weight: 500;
          border-radius: 8px; border: 0.5px solid var(--border2);
          background: var(--s1); color: var(--muted); cursor: pointer;
          font-family: var(--sans); outline: none; transition: border-color 0.2s;
        }
        .lang-select:hover { border-color: var(--border2); color: var(--text); }
        .nav-cta {
          padding: 8px 20px; background: var(--text); color: var(--bg);
          font-size: 12px; font-weight: 600; border-radius: 10px;
          border: none; cursor: pointer; font-family: var(--sans);
          text-decoration: none; display: inline-block;
          transition: opacity 0.15s, transform 0.15s;
        }
        .nav-cta:hover { opacity: 0.88; transform: scale(1.02); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh; display: grid;
          grid-template-columns: 1fr 1fr; gap: 0;
          align-items: center; position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; top: -200px; left: -100px;
          width: 800px; height: 800px;
          background: radial-gradient(circle at 30% 40%, rgba(52,211,153,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-left { padding: 100px 64px 100px 80px; display: flex; flex-direction: column; gap: 0; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 12px 5px 8px; border-radius: 20px;
          background: var(--green-dim); border: 0.5px solid var(--green-border);
          font-size: 11px; font-weight: 500; color: var(--green);
          margin-bottom: 32px; width: fit-content;
          animation: fadeUp 0.5s 0.05s ease both;
        }
        .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse-dot 2s infinite; }
        .hero-h1 {
          font-family: var(--serif); font-size: clamp(40px, 4.5vw, 64px);
          font-weight: 400; line-height: 1.06; letter-spacing: -0.025em;
          margin-bottom: 20px;
          animation: fadeUp 0.5s 0.1s ease both;
        }
        .hero-h1 em { font-style: italic; color: rgba(240,240,242,0.28); }
        .hero-sub {
          font-size: 16px; color: var(--muted); line-height: 1.65;
          max-width: 360px; margin-bottom: 36px; font-weight: 300;
          animation: fadeUp 0.5s 0.15s ease both;
        }
        .hero-actions { display: flex; gap: 10px; animation: fadeUp 0.5s 0.2s ease both; }
        .btn-primary {
          padding: 13px 28px; background: var(--text); color: var(--bg);
          font-size: 13px; font-weight: 600; border-radius: 12px;
          border: none; cursor: pointer; font-family: var(--sans);
          text-decoration: none; display: inline-block;
          transition: transform 0.15s, opacity 0.15s;
        }
        .btn-primary:hover { opacity: 0.9; transform: scale(1.015); }
        .btn-ghost {
          padding: 13px 24px; background: transparent; color: var(--muted);
          font-size: 13px; border-radius: 12px;
          border: 0.5px solid var(--border2); cursor: pointer;
          font-family: var(--sans); transition: background 0.15s, color 0.15s;
          text-decoration: none; display: inline-block;
        }
        .btn-ghost:hover { background: var(--s2); color: var(--text); }
        .hero-platforms { margin-top: 28px; font-size: 11px; color: var(--dim); letter-spacing: 0.03em; animation: fadeUp 0.5s 0.25s ease both; }

        /* ── HERO RIGHT: CERT PREVIEW ── */
        .hero-right {
          padding: 80px 80px 80px 32px;
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .cert-preview {
          width: 100%; max-width: 380px;
          background: var(--s1); border: 0.5px solid var(--border2);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 40px 80px rgba(0,0,0,0.6);
          animation: fadeUp 0.6s 0.2s ease both;
        }
        .cert-header {
          padding: 18px 20px 16px;
          border-bottom: 0.5px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .cert-title-row { display: flex; align-items: center; gap: 10px; }
        .cert-shield {
          width: 30px; height: 30px; border-radius: 8px;
          background: var(--green-dim); border: 0.5px solid var(--green-border);
          display: flex; align-items: center; justify-content: center;
        }
        .cert-name { font-size: 13px; font-weight: 600; color: var(--text); }
        .cert-sub { font-size: 10px; color: var(--muted); margin-top: 1px; }
        .cert-badge-valid {
          font-size: 10px; font-weight: 600; color: var(--green);
          background: var(--green-dim); border: 0.5px solid var(--green-border);
          padding: 3px 10px; border-radius: 6px;
        }
        .cert-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 0; }
        .cert-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 0; border-bottom: 0.5px solid var(--border);
        }
        .cert-row:last-child { border-bottom: none; }
        .cert-label { font-size: 11px; color: var(--muted); }
        .cert-val { font-size: 11px; font-weight: 500; color: var(--text); text-align: right; max-width: 180px; }
        .cert-val.mono { font-family: monospace; font-size: 10px; color: var(--blue); letter-spacing: 0.02em; }
        .cert-val.live { color: var(--green); }
        .cert-footer {
          margin: 14px 20px 18px;
          background: rgba(52,211,153,0.06);
          border: 0.5px solid var(--green-border);
          border-radius: 10px; padding: 10px 14px;
          display: flex; align-items: center; gap: 8;
        }
        .cert-footer-text { font-size: 10px; color: var(--green); line-height: 1.5; }

        /* ── DIVIDER ── */
        .divider { height: 0.5px; background: var(--border); max-width: 920px; margin: 0 auto; }

        /* ── SECTIONS ── */
        .section { padding: 96px 40px; max-width: 960px; margin: 0 auto; }
        .section-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--dim); margin-bottom: 16px; }
        .section-title { font-family: var(--serif); font-size: clamp(28px, 3.5vw, 44px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 12px; }
        .section-title em { font-style: italic; color: rgba(240,240,242,0.28); }
        .section-sub { font-size: 15px; color: var(--muted); font-weight: 300; line-height: 1.65; max-width: 480px; }

        /* ── PROBLEM ── */
        .problem-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; margin-top: 56px; }
        .pain-list { display: flex; flex-direction: column; gap: 12px; }
        .pain-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px 16px; border-radius: 12px;
          background: var(--red-dim); border: 0.5px solid var(--red-border);
        }
        .pain-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); margin-top: 5px; flex-shrink: 0; }
        .pain-text { font-size: 14px; color: var(--red); line-height: 1.5; }
        .pain-conclusion { margin-top: 20px; padding: 16px 18px; background: rgba(248,113,113,0.05); border: 0.5px solid var(--red-border); border-radius: 12px; }
        .pain-conclusion-text { font-size: 14px; color: var(--red); font-weight: 500; }

        /* ── STEPS ── */
        .steps-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: var(--border); border: 0.5px solid var(--border); border-radius: 20px; overflow: hidden; margin-top: 56px; }
        .step-card { background: var(--bg); padding: 32px 24px; transition: background 0.2s; }
        .step-card:hover { background: var(--s1); }
        .step-num { font-size: 10px; color: var(--dim); letter-spacing: 0.1em; margin-bottom: 20px; font-weight: 500; }
        .step-name { font-size: 14px; font-weight: 500; color: var(--text); margin-bottom: 8px; line-height: 1.4; }
        .step-desc { font-size: 12px; color: var(--muted); line-height: 1.65; font-weight: 300; }
        .step-accent { display: inline-block; width: 24px; height: 2px; border-radius: 2px; margin-bottom: 16px; }

        /* ── COMPARE ── */
        .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 56px; }
        .compare-card { border-radius: 18px; padding: 28px 32px; }
        .compare-head { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px; }
        .compare-items { display: flex; flex-direction: column; gap: 10px; }
        .compare-item { display: flex; align-items: flex-start; gap: 10px; }
        .compare-icon { font-size: 12px; margin-top: 1px; flex-shrink: 0; line-height: 1.5; }
        .compare-text { font-size: 14px; line-height: 1.5; }
        .compare-quote {
          text-align: center; margin-top: 56px;
          font-family: var(--serif); font-size: clamp(22px, 2.8vw, 34px);
          letter-spacing: -0.02em; line-height: 1.3; color: var(--text);
        }
        .compare-quote em { font-style: italic; color: rgba(240,240,242,0.28); }

        /* ── FINAL CTA ── */
        .final-cta { padding: 120px 40px; text-align: center; position: relative; }
        .final-cta::before {
          content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(52,211,153,0.04) 0%, transparent 65%);
          pointer-events: none;
        }
        .final-title { font-family: var(--serif); font-size: clamp(32px, 5vw, 60px); font-weight: 400; letter-spacing: -0.03em; line-height: 1.06; margin-bottom: 16px; }
        .final-title em { font-style: italic; color: rgba(240,240,242,0.28); }
        .final-sub { font-size: 15px; color: var(--muted); margin-bottom: 40px; font-weight: 300; max-width: 380px; margin-left: auto; margin-right: auto; }
        .final-cta-btn {
          display: inline-block; padding: 16px 48px;
          background: var(--text); color: var(--bg);
          font-size: 14px; font-weight: 600; border-radius: 14px;
          text-decoration: none; transition: transform 0.15s, opacity 0.15s;
          position: relative; z-index: 1;
        }
        .final-cta-btn:hover { opacity: 0.9; transform: scale(1.015); }

        /* ── FOOTER ── */
        footer {
          border-top: 0.5px solid var(--border);
          padding: 32px 40px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px;
        }
        .footer-logo { display: flex; align-items: center; gap: 8px; font-family: var(--serif); font-size: 15px; color: var(--dim); }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { font-size: 12px; color: var(--dim); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--muted); }
        .footer-copy { font-size: 11px; color: rgba(240,240,242,0.12); }
        .newsletter-row { display: flex; align-items: center; gap: 6px; }
        .newsletter-input {
          padding: 7px 14px; font-size: 12px;
          background: var(--s1); border: 0.5px solid var(--border2);
          border-radius: 8px; color: var(--text); font-family: var(--sans);
          outline: none; width: 160px; transition: border-color 0.2s;
        }
        .newsletter-input:focus { border-color: rgba(255,255,255,0.2); }
        .newsletter-input::placeholder { color: var(--dim); }
        .newsletter-btn {
          padding: 7px 14px; font-size: 11px; font-weight: 500;
          background: var(--s2); border: 0.5px solid var(--border2);
          border-radius: 8px; color: var(--muted); cursor: pointer;
          font-family: var(--sans); transition: background 0.15s, color 0.15s;
        }
        .newsletter-btn:hover { background: var(--s3); color: var(--text); }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; min-height: auto; }
          .hero-left { padding: 80px 32px 40px; }
          .hero-right { padding: 0 32px 80px; justify-content: flex-start; }
          .cert-preview { max-width: 100%; }
          .problem-layout { grid-template-columns: 1fr; gap: 40px; }
          .steps-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .nav { padding: 0 20px; }
          .nav-links { display: none; }
          .section { padding: 72px 24px; }
          .hero-left { padding: 64px 24px 32px; }
          .hero-right { padding: 0 24px 64px; }
          .compare-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
          footer { flex-direction: column; align-items: flex-start; padding: 28px 24px; }
        }
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav className="nav">
        <span className="nav-logo">
          <div className="nav-logo-mark">SC</div>
          <span className="nav-logo-name">SellCov</span>
        </span>
        <div className="nav-links">
          <a onClick={function() { scrollTo("#problem"); }}>{tx({fr:"Pourquoi", en:"Why", es:"Por qué", it:"Perché"})}</a>
          <a onClick={function() { scrollTo("#how"); }}>{tx({fr:"Comment", en:"How", es:"Cómo", it:"Come"})}</a>
        </div>
        <div className="nav-right">
          <select value={lang} onChange={function(e) { setLang(e.target.value); }} className="lang-select">
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
        <div className="hero-left">
          <div className="hero-badge">
            <div className="hero-badge-dot"></div>
            {tx({fr:"Bêta gratuite", en:"Free beta", es:"Beta gratuita", it:"Beta gratuita"})}
          </div>
          <h1 className="hero-h1">
            {tx({fr:"Revends", en:"Resell", es:"Revende", it:"Rivendi"})}<br />
            <em>{tx({fr:"sans te faire arnaquer.", en:"without getting scammed.", es:"sin que te estafen.", it:"senza farti truffare."})}</em>
          </h1>
          <p className="hero-sub">
            {tx({fr:"Chaque vente génère une preuve légale. Vidéo horodatée, certificat SHA-256, défense automatique.", en:"Every sale generates legal proof. Timestamped video, SHA-256 certificate, automatic defense.", es:"Cada venta genera prueba legal. Vídeo con timestamp, certificado SHA-256, defensa automática.", it:"Ogni vendita genera prova legale. Video con timestamp, certificato SHA-256, difesa automatica."})}
          </p>
          <div className="hero-actions">
            <Link href="/protection" className="btn-primary">{tx({fr:"Essayer gratuitement", en:"Try for free", es:"Probar gratis", it:"Prova gratis"})}</Link>
            <button className="btn-ghost" onClick={function() { scrollTo("#problem"); }}>{tx({fr:"Comment ça marche", en:"How it works", es:"Cómo funciona", it:"Come funziona"})}</button>
          </div>
          <div className="hero-platforms">Vinted · Depop · Grailed · Vestiaire Collective · Etsy</div>
        </div>

        {/* CERT PREVIEW */}
        <div className="hero-right">
          <div className="cert-preview">
            <div className="cert-header">
              <div className="cert-title-row">
                <div className="cert-shield">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="#34d399" strokeWidth="1.5" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="cert-name">SellCov Certificate</div>
                  <div className="cert-sub">{tx({fr:"Preuve horodatée", en:"Timestamped proof", es:"Prueba con timestamp", it:"Prova con timestamp"})}</div>
                </div>
              </div>
              <div className="cert-badge-valid">{tx({fr:"Valide", en:"Valid", es:"Válido", it:"Valido"})}</div>
            </div>

            <div className="cert-body">
              <div className="cert-row">
                <span className="cert-label">ID</span>
                <span className="cert-val mono">SC-4F2A9B1C</span>
              </div>
              <div className="cert-row">
                <span className="cert-label">{tx({fr:"Article", en:"Item", es:"Artículo", it:"Articolo"})}</span>
                <span className="cert-val">Carhartt WIP Detroit Jacket — S</span>
              </div>
              <div className="cert-row">
                <span className="cert-label">{tx({fr:"Horodatage", en:"Timestamp", es:"Marca temporal", it:"Timestamp"})}</span>
                <span className="cert-val live" style={{ fontFamily: "monospace", fontSize: 10 }}>{certTime}</span>
              </div>
              <div className="cert-row">
                <span className="cert-label">SHA-256</span>
                <span className="cert-val mono">A3F9…C72E</span>
              </div>
              <div className="cert-row">
                <span className="cert-label">{tx({fr:"Vidéo", en:"Video", es:"Vídeo", it:"Video"})}</span>
                <span className="cert-val" style={{ color: "var(--green)", fontSize: 11 }}>SellCov_SC-4F2A9B1C.mp4 · 2.4 MB</span>
              </div>
              <div className="cert-row">
                <span className="cert-label">{tx({fr:"Appareil", en:"Device", es:"Dispositivo", it:"Dispositivo"})}</span>
                <span className="cert-val">iPhone / Safari iOS</span>
              </div>
            </div>

            <div className="cert-footer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="#34d399" strokeWidth="1.5" fill="none"/>
              </svg>
              <span className="cert-footer-text">{tx({fr:"Preuve légalement admissible · Signé SellCov", en:"Legally admissible proof · Signed by SellCov", es:"Prueba legalmente admisible · Firmado SellCov", it:"Prova legalmente ammissibile · Firmato SellCov"})}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* ═══ PROBLÈME ═══ */}
      <section className="section" id="problem">
        <div className="section-label reveal">{tx({fr:"Le problème", en:"The problem", es:"El problema", it:"Il problema"})}</div>
        <h2 className="section-title reveal">
          {tx({fr:"Tu peux tout perdre", en:"You can lose everything", es:"Puedes perderlo todo", it:"Puoi perdere tutto"})}<br/>
          <em>{tx({fr:"sur une seule vente.", en:"on a single sale.", es:"en una sola venta.", it:"su una singola vendita."})}</em>
        </h2>

        <div className="problem-layout">
          <div className="pain-list reveal">
            {[
              tx({fr:"Un acheteur malhonnête déclenche un remboursement forcé", en:"A dishonest buyer triggers a forced refund", es:"Un comprador deshonesto activa un reembolso forzado", it:"Un acquirente disonesto attiva un rimborso forzato"}),
              tx({fr:"Zéro preuve, zéro recours possible", en:"Zero proof, zero possible recourse", es:"Cero prueba, cero recurso posible", it:"Zero prove, zero ricorso possibile"}),
            ].map(function(t, i) {
              return (
                <div className={"pain-item reveal reveal-d" + (i+1)} key={i}>
                  <div className="pain-dot"></div>
                  <span className="pain-text">{t}</span>
                </div>
              );
            })}
            <div className="pain-conclusion reveal reveal-d3">
              <div className="pain-conclusion-text">{tx({fr:"Tu prends 100% du risque.", en:"You take 100% of the risk.", es:"Asumes el 100% del riesgo.", it:"Ti prendi il 100% del rischio."})}</div>
            </div>
          </div>

          <div className="reveal reveal-d2" style={{ background: "var(--s1)", border: "0.5px solid var(--border2)", borderRadius: 18, padding: "28px 32px" }}>
            <div style={{ fontSize: 11, color: "var(--dim)", marginBottom: 20, letterSpacing: "0.05em" }}>
              {tx({fr:"Scénario type", en:"Typical scenario", es:"Escenario típico", it:"Scenario tipico"})}
            </div>
            {[
              { label: tx({fr:"Tu vends", en:"You sell", es:"Vendes", it:"Vendi"}), val: "Jordans · 85€", ok: true },
              { label: tx({fr:"Tu expédies", en:"You ship", es:"Envías", it:"Spedisci"}), val: tx({fr:"Sans preuve", en:"Without proof", es:"Sin prueba", it:"Senza prova"}), ok: false },
              { label: tx({fr:"Acheteur", en:"Buyer", es:"Comprador", it:"Acquirente"}), val: tx({fr:"Conteste la réception", en:"Disputes delivery", es:"Contesta la recepción", it:"Contesta la ricezione"}), ok: false },
              { label: tx({fr:"Plateforme", en:"Platform", es:"Plataforma", it:"Piattaforma"}), val: tx({fr:"Rembourse sans vérifier", en:"Refunds without checking", es:"Reembolsa sin verificar", it:"Rimborsa senza verificare"}), ok: false },
              { label: tx({fr:"Résultat", en:"Result", es:"Resultado", it:"Risultato"}), val: tx({fr:"−85€ + article perdu", en:"−85€ + item lost", es:"−85€ + artículo perdido", it:"−85€ + articolo perso"}), ok: false },
            ].map(function(row, i) {
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 4 ? "0.5px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: row.ok ? "var(--text)" : "var(--red)" }}>{row.val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* ═══ SOLUTION ═══ */}
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="section-label reveal">{tx({fr:"La solution", en:"The solution", es:"La solución", it:"La soluzione"})}</div>
        <h2 className="section-title reveal">
          {tx({fr:"Tu vends.", en:"You sell.", es:"Vendes.", it:"Vendi."})}<br/>
          <em>{tx({fr:"On protège.", en:"We protect.", es:"Protegemos.", it:"Proteggiamo."})}</em>
        </h2>
        <p className="section-sub reveal" style={{ marginBottom: 0 }}>
          {tx({fr:"L'acheteur conteste ? Tu as la preuve.", en:"Buyer disputes? You have the proof.", es:"¿El comprador contesta? Tienes la prueba.", it:"L'acquirente contesta? Hai la prova."})}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 520, marginTop: 40 }}>
          {[
            tx({fr:"Horodatage automatique avant chaque envoi", en:"Automatic timestamping before every shipment", es:"Marca temporal automática antes de cada envío", it:"Timestamp automatico prima di ogni spedizione"}),
            tx({fr:"Certification avec empreinte SHA-256", en:"SHA-256 fingerprint certification", es:"Certificación con huella digital SHA-256", it:"Certificazione con impronta SHA-256"}),
            tx({fr:"Sauvegarde légale de chaque transaction", en:"Legal backup of every transaction", es:"Respaldo legal de cada transacción", it:"Backup legale di ogni transazione"}),
          ].map(function(t, i) {
            return (
              <div key={i} className={"reveal reveal-d" + (i+1)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: "var(--green-dim)", border: "0.5px solid var(--green-border)", borderRadius: 12 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
                  <path d="M20 6L9 17l-5-5" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 14, color: "var(--green)", lineHeight: 1.5 }}>{t}</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="divider"></div>

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <section className="section" id="how" style={{ paddingTop: 80 }}>
        <div className="section-label reveal">{tx({fr:"Le process", en:"The process", es:"El proceso", it:"Il processo"})}</div>
        <h2 className="section-title reveal">
          {tx({fr:"4 étapes.", en:"4 steps.", es:"4 pasos.", it:"4 passaggi."})}<br/>
          <em>{tx({fr:"Tu es couvert.", en:"You're covered.", es:"Estás cubierto.", it:"Sei coperto."})}</em>
        </h2>
        <div className="steps-grid">
          {[
            { n: "01", name: tx({fr:"Photo de l'article", en:"Item photo", es:"Foto del artículo", it:"Foto dell'articolo"}), desc: tx({fr:"Annonce générée avec prix, description et hashtags optimisés.", en:"Listing generated with optimized price, description and hashtags.", es:"Anuncio generado con precio, descripción y hashtags optimizados.", it:"Annuncio generato con prezzo, descrizione e hashtag ottimizzati."}), color: "#818cf8", bg: "rgba(129,140,248,0.12)" },
            { n: "02", name: tx({fr:"Certification avant envoi", en:"Certify before shipping", es:"Certifica antes del envío", it:"Certifica prima della spedizione"}), desc: tx({fr:"Vidéo horodatée et certificat PDF à empreinte numérique.", en:"Timestamped video and PDF certificate with digital fingerprint.", es:"Vídeo con timestamp y certificado PDF con huella digital.", it:"Video con timestamp e certificato PDF con impronta digitale."}), color: "var(--green)", bg: "var(--green-dim)" },
            { n: "03", name: tx({fr:"Expédition sécurisée", en:"Secured shipping", es:"Envío seguro", it:"Spedizione sicura"}), desc: tx({fr:"Numéro de suivi et preuve de dépôt sauvegardés automatiquement.", en:"Tracking number and deposit proof saved automatically.", es:"Número de seguimiento y prueba de depósito guardados automáticamente.", it:"Numero di tracciamento e prova di deposito salvati automaticamente."}), color: "var(--text)", bg: "rgba(255,255,255,0.06)" },
            { n: "04", name: tx({fr:"Litige géré", en:"Dispute handled", es:"Litigio gestionado", it:"Controversia gestita"}), desc: tx({fr:"L'IA analyse, détecte la fraude et génère ta réponse de défense.", en:"AI analyzes, detects fraud and generates your defense response.", es:"La IA analiza, detecta el fraude y genera tu respuesta de defensa.", it:"L'IA analizza, rileva la frode e genera la tua risposta di difesa."}), color: "#f472b6", bg: "rgba(244,114,182,0.1)" },
          ].map(function(s, i) {
            return (
              <div key={s.n} className={"step-card reveal reveal-d" + (i % 4 + 1)}>
                <div className="step-num">{s.n}</div>
                <div className="step-accent" style={{ background: s.color }}></div>
                <div className="step-name" style={{ color: s.color }}>{s.name}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="divider"></div>

      {/* ═══ AVANT / APRÈS ═══ */}
      <section className="section" style={{ paddingTop: 80 }}>
        <div className="section-label reveal">{tx({fr:"Avant / Après", en:"Before / After", es:"Antes / Después", it:"Prima / Dopo"})}</div>
        <h2 className="section-title reveal">
          {tx({fr:"La différence", en:"The difference", es:"La diferencia", it:"La differenza"})}<br/>
          <em>SellCov.</em>
        </h2>
        <div className="compare-grid">
          <div className="compare-card reveal" style={{ background: "var(--red-dim)", border: "0.5px solid var(--red-border)" }}>
            <div className="compare-head" style={{ color: "var(--red)" }}>
              {tx({fr:"Avant SellCov", en:"Before SellCov", es:"Antes de SellCov", it:"Prima di SellCov"})}
            </div>
            <div className="compare-items">
              {[
                tx({fr:"Réception contestée par l'acheteur", en:"Delivery contested by buyer", es:"Recepción contestada por el comprador", it:"Ricezione contestata dall'acquirente"}),
                tx({fr:"La plateforme rembourse sans vérifier", en:"Platform refunds without checking", es:"La plataforma reembolsa sin verificar", it:"La piattaforma rimborsa senza verificare"}),
                tx({fr:"Tu perds ton produit et ton argent", en:"You lose your product and money", es:"Pierdes tu producto y tu dinero", it:"Perdi il tuo prodotto e i tuoi soldi"}),
                tx({fr:"Aucune preuve valable", en:"No valid proof", es:"Ninguna prueba válida", it:"Nessuna prova valida"}),
              ].map(function(t, i) {
                return (
                  <div className="compare-item" key={i}>
                    <span className="compare-icon" style={{ color: "var(--red)" }}>—</span>
                    <span className="compare-text" style={{ color: "var(--red)" }}>{t}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="compare-card reveal reveal-d1" style={{ background: "var(--green-dim)", border: "0.5px solid var(--green-border)" }}>
            <div className="compare-head" style={{ color: "var(--green)" }}>
              {tx({fr:"Avec SellCov", en:"With SellCov", es:"Con SellCov", it:"Con SellCov"})}
            </div>
            <div className="compare-items">
              {[
                tx({fr:"Preuve enregistrée automatiquement", en:"Proof recorded automatically", es:"Prueba registrada automáticamente", it:"Prova registrata automaticamente"}),
                tx({fr:"Envoi certifié avant expédition", en:"Shipment certified before sending", es:"Envío certificado antes del envío", it:"Spedizione certificata prima dell'invio"}),
                tx({fr:"Réponse de défense générée en 1 clic", en:"Defense response generated in 1 click", es:"Respuesta de defensa generada en 1 clic", it:"Risposta di difesa generata in 1 clic"}),
                tx({fr:"Ton argent est protégé", en:"Your money is protected", es:"Tu dinero está protegido", it:"I tuoi soldi sono protetti"}),
              ].map(function(t, i) {
                return (
                  <div className="compare-item" key={i}>
                    <span className="compare-icon" style={{ color: "var(--green)" }}>+</span>
                    <span className="compare-text" style={{ color: "var(--green)" }}>{t}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <p className="compare-quote reveal" style={{ marginTop: 56 }}>
          {tx({fr:"Si l'acheteur ment,", en:"If the buyer lies,", es:"Si el comprador miente,", it:"Se l'acquirente mente,"})}<br/>
          <em>{tx({fr:"tu peux le prouver.", en:"you can prove it.", es:"puedes probarlo.", it:"puoi dimostrarlo."})}</em>
        </p>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/protection" className="btn-primary">{tx({fr:"Activer la protection", en:"Activate protection", es:"Activar la protección", it:"Attiva la protezione"})}</Link>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="final-cta">
        <h2 className="final-title reveal">
          {tx({fr:"Protège ton argent", en:"Protect your money", es:"Protege tu dinero", it:"Proteggi i tuoi soldi"})}<br/>
          <em>{tx({fr:"maintenant.", en:"now.", es:"ahora.", it:"adesso."})}</em>
        </h2>
        <p className="final-sub reveal">{tx({fr:"Chaque vente non protégée est un risque.", en:"Every unprotected sale is a risk.", es:"Cada venta sin proteger es un riesgo.", it:"Ogni vendita non protetta è un rischio."})}</p>
        <Link href="/annonce" className="final-cta-btn reveal">{tx({fr:"Essayer gratuitement", en:"Try for free", es:"Probar gratis", it:"Prova gratis"})}</Link>
        <div style={{ marginTop: 20, fontSize: 11, color: "var(--dim)" }}>Vinted · Depop · Grailed · Vestiaire Collective · Etsy</div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="footer-logo">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="rgba(240,240,242,0.2)" strokeWidth="1"/>
            <text x="11" y="14.5" fontFamily="-apple-system,sans-serif" fontSize="6" fontWeight="700" fill="rgba(240,240,242,0.2)" textAnchor="middle">SC</text>
          </svg>
          SellCov
        </div>
        <div className="footer-links">
          <a href="mailto:hello@sellcov.com">FAQ</a>
          <a href="mailto:hello@sellcov.com">{tx({fr:"Contact", en:"Contact", es:"Contacto", it:"Contatto"})}</a>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
        </div>
        <div className="newsletter-row">
          <input id="nl" type="email" className="newsletter-input" placeholder={tx({fr:"Ton email", en:"Your email", es:"Tu email", it:"La tua email"})} />
          <button className="newsletter-btn" onClick={function() {
            var em = document.getElementById("nl");
            if (em && em.value) {
              window.location.href = "mailto:hello@sellcov.com?subject=Newsletter SellCov&body=" + tx({fr:"Inscris-moi : ", en:"Sign me up: ", es:"Suscríbeme: ", it:"Iscrivimi: "}) + em.value;
              em.value = "";
            }
          }}>{tx({fr:"S'inscrire", en:"Subscribe", es:"Suscribirse", it:"Iscriviti"})}</button>
        </div>
        <div className="footer-copy">© 2026 SellCov</div>
      </footer>
    </>
  );
}
