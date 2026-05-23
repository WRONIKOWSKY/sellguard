import Head from "next/head";
import Link from "next/link";

export default function LegalLayout({ children, title, description }) {
  const fullTitle = title ? `${title} — SellCov` : "SellCov";
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>

      <style jsx global>{`
        :root {
          --bg: #f8f7f3;
          --bg-card: #ffffff;
          --ink: #111111;
          --ink-soft: #2a2a2a;
          --muted: #6b6b6b;
          --dim: #a0a09a;
          --line: #e6e4dc;
          --green: #1f9f5f;
          --green-deep: #167a48;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; }
        body {
          font-family: var(--font-inter), -apple-system, system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }

        .legal-header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(248, 247, 243, 0.92);
          backdrop-filter: blur(10px);
        }
        .legal-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px;
          max-width: 1100px; margin: 0 auto;
        }
        .legal-nav-logo { display: flex; align-items: center; }
        .legal-nav-logo img { height: 80px; width: auto; display: block; }
        .legal-lang { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
        .legal-lang-active { color: var(--ink); }
        .legal-lang-disabled { color: var(--dim); cursor: not-allowed; opacity: 0.55; }
        .legal-lang-divider { color: var(--dim); }

        .legal-main {
          max-width: 720px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .legal-title {
          font-weight: 800;
          font-size: clamp(32px, 5vw, 44px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 12px;
        }
        .legal-subtitle {
          color: var(--muted);
          font-size: 17px;
          margin-bottom: 40px;
        }
        .legal-content {
          color: var(--ink-soft);
          font-size: 16px;
          line-height: 1.7;
        }
        .legal-content h2 {
          font-size: 22px;
          font-weight: 700;
          margin-top: 36px;
          margin-bottom: 12px;
          color: var(--ink);
          letter-spacing: -0.01em;
        }
        .legal-content h3 {
          font-size: 17px;
          font-weight: 700;
          margin-top: 24px;
          margin-bottom: 8px;
          color: var(--ink);
        }
        .legal-content p {
          margin-bottom: 16px;
        }
        .legal-content ul, .legal-content ol {
          margin: 0 0 16px 24px;
        }
        .legal-content li {
          margin-bottom: 6px;
        }
        .legal-content a {
          color: var(--green-deep);
          text-decoration: underline;
        }
        .legal-content strong { font-weight: 700; color: var(--ink); }

        /* FAQ items */
        .legal-faq details {
          border-bottom: 1px solid var(--line);
          padding: 20px 0;
        }
        .legal-faq summary {
          font-size: 16px; font-weight: 600; color: var(--ink);
          cursor: pointer; list-style: none;
          position: relative; padding-right: 32px;
          display: block; line-height: 1.4;
        }
        .legal-faq summary::-webkit-details-marker { display: none; }
        .legal-faq summary::after {
          content: "+"; position: absolute; right: 0; top: 0;
          font-size: 22px; color: var(--muted); font-weight: 400;
          line-height: 1.4;
        }
        .legal-faq details[open] summary::after { content: "−"; }
        .legal-faq details p {
          color: var(--muted); margin-top: 10px;
          font-size: 14.5px; line-height: 1.65;
        }

        /* Footer */
        .legal-footer {
          border-top: 1px solid var(--line);
          padding: 36px 24px;
          text-align: center;
          color: var(--dim); font-size: 13px;
          max-width: 720px; margin: 60px auto 0;
        }
        .legal-footer-links {
          margin-bottom: 14px;
          display: flex; gap: 18px; justify-content: center; flex-wrap: wrap;
        }
        .legal-footer-links a { color: var(--muted); font-size: 13px; transition: color .15s; }
        .legal-footer-links a:hover { color: var(--ink); }
      `}</style>

      <header className="legal-header">
        <div className="legal-nav">
          <Link href="/" className="legal-nav-logo">
            <img src="/logo-full.png" alt="SellCov" />
          </Link>
          <div className="legal-lang">
            <span className="legal-lang-active">FR</span>
            <span className="legal-lang-divider">·</span>
            <span className="legal-lang-disabled" title="Coming soon">EN</span>
          </div>
        </div>
      </header>

      <main className="legal-main">{children}</main>

      <footer className="legal-footer">
        <div className="legal-footer-links">
          <Link href="/faq">FAQ</Link>
          <a href="mailto:hello@sellcov.com">Contact</a>
          <a href="https://www.instagram.com/sellcov" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@sellcov.com" target="_blank" rel="noopener noreferrer">TikTok</a>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/cgu">CGU</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </div>
        <div>© 2026 SellCov</div>
      </footer>
    </>
  );
}
