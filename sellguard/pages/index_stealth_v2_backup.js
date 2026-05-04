import Head from 'next/head';
import { useState } from 'react';
import { getSupabase } from '../lib/supabaseClient';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const clean = email.toLowerCase().trim();
    if (!clean || !clean.includes('@') || !clean.includes('.')) {
      setStatus('error');
      setErrorMsg('Email invalide.');
      return;
    }
    setStatus('loading');
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: clean, source: 'stealth_v2' }]);
      if (error) {
        // 23505 = duplicate (déjà inscrit) → on traite comme un succès
        if (error.code === '23505') {
          setStatus('success');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Une erreur est survenue. Réessaie dans un instant.');
    }
  }

  return (
    <>
      <Head>
        <title>SellCov — Bientôt</title>
        <meta
          name="description"
          content="SellCov évolue. Bientôt : récupère automatiquement tes chargebacks Stripe et PayPal grâce à la preuve vidéo cryptographique."
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sellcov.com" />
        <meta property="og:title" content="SellCov — Bientôt" />
        <meta
          property="og:description"
          content="SellCov évolue. Bientôt : récupère automatiquement tes chargebacks Stripe et PayPal."
        />
        <meta property="og:image" content="https://www.sellcov.com/logo.png" />
        <meta property="og:site_name" content="SellCov" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="stage">
        <div className="halo" />
        <div className="content">
          <img src="/logo.png" alt="SellCov" className="logo" />
          <div className="kicker">Refonte en cours</div>
          <h1 className="title">
            <span>SellCov</span> <span className="italic">évolue.</span>
          </h1>
          <p className="sub">
            Bientôt : récupère automatiquement tes chargebacks <strong>Stripe</strong> &amp;{' '}
            <strong>PayPal</strong> grâce à la preuve vidéo cryptographique.
          </p>

          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="form">
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                required
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? '…' : 'Préviens-moi'}
              </button>
            </form>
          ) : (
            <div className="ok">Merci. On revient vers toi très vite.</div>
          )}

          {status === 'error' && <div className="err">{errorMsg}</div>}

          <div className="foot">
            <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>
            <span>·</span>
            <a
              href="https://www.instagram.com/sellcov"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <span>·</span>
            <a
              href="https://www.tiktok.com/@sellcov.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              TikTok
            </a>
            <span>·</span>
            <a href="/mentions-legales">Mentions légales</a>
            <span>·</span>
            <a href="/confidentialite">Confidentialité</a>
          </div>
        </div>
      </main>

      <style jsx global>{`
        :root {
          --bg: #000;
          --text: #fff;
          --muted: #9a9a9a;
          --dim: #5a5a5a;
          --border: #1e1e1e;
          --border-strong: #2a2a2a;
          --green: #5ee8a3;
          --pink: #f570aa;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html,
        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }
        a {
          color: inherit;
          text-decoration: none;
        }

        .stage {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          overflow: hidden;
        }
        .halo {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 900px;
          height: 900px;
          background: radial-gradient(
            circle,
            rgba(94, 232, 163, 0.1) 0%,
            rgba(0, 0, 0, 0) 60%
          );
          pointer-events: none;
          z-index: 0;
        }
        .content {
          position: relative;
          z-index: 1;
          max-width: 620px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }
        .logo {
          height: 80px;
          width: auto;
          margin-bottom: 8px;
          display: block;
        }
        .kicker {
          color: var(--green);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          background: rgba(94, 232, 163, 0.08);
          border: 1px solid rgba(94, 232, 163, 0.25);
          padding: 6px 14px;
          border-radius: 999px;
        }
        .title {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(48px, 8vw, 84px);
          line-height: 0.95;
          letter-spacing: -0.03em;
        }
        .title .italic {
          font-style: italic;
          color: var(--muted);
          font-weight: 500;
        }
        .sub {
          color: var(--muted);
          font-size: clamp(15px, 1.6vw, 18px);
          line-height: 1.5;
          max-width: 520px;
        }
        .sub strong {
          color: #fff;
          font-weight: 600;
        }
        .form {
          display: flex;
          gap: 8px;
          width: 100%;
          max-width: 440px;
          margin-top: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .form input {
          flex: 1;
          min-width: 200px;
          background: transparent;
          border: 1px solid var(--border-strong);
          color: #fff;
          padding: 14px 18px;
          border-radius: 999px;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }
        .form input:focus {
          border-color: var(--green);
        }
        .form input::placeholder {
          color: var(--dim);
        }
        .form button {
          background: #fff;
          color: #000;
          border: none;
          padding: 14px 24px;
          border-radius: 999px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
        }
        .form button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15);
        }
        .form button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .ok {
          color: var(--green);
          font-size: 15px;
          padding: 12px 22px;
          border: 1px solid rgba(94, 232, 163, 0.3);
          background: rgba(94, 232, 163, 0.06);
          border-radius: 999px;
        }
        .err {
          color: var(--pink);
          font-size: 13px;
        }
        .foot {
          margin-top: 36px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          color: var(--dim);
          font-size: 13px;
        }
        .foot a {
          color: var(--muted);
          transition: color 0.15s;
        }
        .foot a:hover {
          color: #fff;
        }
        .foot span {
          color: var(--dim);
        }
      `}</style>
    </>
  );
}
