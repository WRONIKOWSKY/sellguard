import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabaseClient';
import { useLang } from '../contexts/LangContext';

export default function Compte() {
  const { t, lang } = useLang();
  const c = t.compte;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [envois, setEnvois] = useState([]);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradedMsg, setUpgradedMsg] = useState(false);
  const [badgeHandle, setBadgeHandle] = useState('');
  const [badgePlatform, setBadgePlatform] = useState('vinted');
  const [badgeBusy, setBadgeBusy] = useState(false);
  const [badgeError, setBadgeError] = useState(null);
  const [badgePreview, setBadgePreview] = useState(null); // {slug, dataUrl}

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('upgraded=1')) {
      setUpgradedMsg(true);
    }
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      sub?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setProfile(null);
      setEnvois([]);
      return;
    }
    const sb = getSupabase();
    if (!sb) return;
    sb.from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
        if (data?.public_handle) {
          setBadgeHandle(data.public_handle);
          if (data.handle_platform) setBadgePlatform(data.handle_platform);
        }
      });
    sb.from('envois')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setEnvois(data || []));
  }, [session]);

  async function sendMagicLink(e) {
    e.preventDefault();
    setError(null);
    const sb = getSupabase();
    if (!sb) {
      setError(c.err_connect);
      return;
    }
    if (!email || !email.includes('@')) {
      setError(c.err_invalid_email);
      return;
    }
    setSending(true);
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== 'undefined'
            ? window.location.origin + '/compte'
            : undefined,
      },
    });
    setSending(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  async function logout() {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
    setSession(null);
    setSent(false);
    setEmail('');
  }

  async function startCheckout() {
    setError(null);
    setUpgrading(true);
    const sb = getSupabase();
    if (!sb) {
      setError(c.err_connect);
      setUpgrading(false);
      return;
    }
    const { data } = await sb.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) {
      setError(c.err_session);
      setUpgrading(false);
      return;
    }
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok && json.url) {
        window.location.href = json.url;
      } else {
        setError(json.error || c.err_checkout);
        setUpgrading(false);
      }
    } catch (e) {
      setError(c.err_network);
      setUpgrading(false);
    }
  }

  async function makeBadge() {
    setBadgeError(null);
    setBadgePreview(null);
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) {
      setBadgeError(c.err_session);
      return;
    }
    setBadgeBusy(true);
    try {
      const res = await fetch('/api/vendeur-claim', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: badgeHandle, platform: badgePlatform }),
      });
      const json = await res.json();
      if (!res.ok) {
        setBadgeError(json.error || c.badge_err);
        setBadgeBusy(false);
        return;
      }
      const { buildBadgeCanvas } = await import('../lib/badge');
      const canvas = await buildBadgeCanvas({
        handle: json.handle,
        slug: json.slug,
        origin: window.location.origin,
        lang,
      });
      setBadgePreview({ slug: json.slug, handle: json.handle, dataUrl: canvas.toDataURL('image/png') });
    } catch (e) {
      console.error('[badge]', e);
      setBadgeError(c.badge_err);
    }
    setBadgeBusy(false);
  }

  function saveBadge() {
    if (!badgePreview) return;
    const a = document.createElement('a');
    a.href = badgePreview.dataUrl;
    a.download = `SellCov_badge_${badgePreview.slug}.png`;
    a.click();
  }

  const tier = session?.user?.app_metadata?.tier;
  const isPro = ['seller', 'pro', 'admin'].includes(tier);
  const planLabel = tier === 'admin' ? c.plan_admin : isPro ? c.plan_pro : c.plan_free;

  return (
    <>
      <Head>
        <title>{c.meta_title}</title>
        <meta name="description" content={c.meta_desc} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <style jsx global>{`
        :root {
          --bg: #f8f7f3;
          --bg-soft: #ffffff;
          --bg-card: #ffffff;
          --ink: #111111;
          --ink-soft: #2a2a2a;
          --muted: #6b6b6b;
          --dim: #a0a09a;
          --line: #e6e4dc;
          --line-strong: #d4d2c8;
          --green: #1f9f5f;
          --green-deep: #167a48;
          --green-soft: #e7f3ec;
          --danger: #c0392b;
          --radius: 16px;
          --radius-lg: 28px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; }
        body {
          font-family: var(--font-inter), -apple-system, system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }
        button { font-family: inherit; }
      `}</style>

      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(248,247,243,0.92)", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", maxWidth: 1100, margin: "0 auto" }}>
          <Link href="/">
            <span style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
              <img src="/logo-full.png" alt="SellCov" style={{ height: 80, width: "auto" }} />
            </span>
          </Link>
          <Link href="/">
            <span style={{ color: "#6b6b6b", fontSize: 14, fontWeight: 500, padding: "8px 14px", borderRadius: 999, cursor: "pointer" }}>
              {t.nav.back}
            </span>
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        {loading && (
          <div style={{ ...cardStyle, textAlign: "center", color: "#6b6b6b", marginTop: 48 }}>{c.loading}</div>
        )}

        {!loading && !session && !sent && (
          <>
            <div style={{ padding: "48px 0 24px", textAlign: "center" }}>
              <h1 style={{ fontWeight: 800, fontSize: "clamp(28px, 6vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                {c.title}
              </h1>
              <p style={{ color: "#6b6b6b", fontSize: 16, marginTop: 14, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
                {c.magic_intro}
              </p>
            </div>
            <div style={cardStyle}>
              <form onSubmit={sendMagicLink}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={c.email_ph}
                  required
                  style={inputStyle}
                />
                <div style={{ height: 14 }} />
                <button type="submit" disabled={sending} style={{ ...btnPrimary, opacity: sending ? 0.5 : 1, cursor: sending ? "wait" : "pointer" }}>
                  {sending ? c.sending : c.send_link}
                </button>
                {error && (
                  <div style={errorBox}>{error}</div>
                )}
              </form>
            </div>
          </>
        )}

        {!loading && !session && sent && (
          <>
            <div style={{ padding: "48px 0 24px", textAlign: "center" }}>
              <div style={{ width: 64, height: 64, margin: "0 auto 18px", borderRadius: "50%", background: "#e7f3ec", border: "1.5px solid #1f9f5f", display: "grid", placeItems: "center" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#167a48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(24px, 5vw, 32px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                {c.check_mail}
              </h2>
              <p style={{ color: "#6b6b6b", fontSize: 16, marginTop: 14, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
                {c.mail_sent_1}<br />
                <span style={{ color: "#111", fontWeight: 600 }}>{email}</span>.<br /><br />
                {c.mail_sent_2}
              </p>
            </div>
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button onClick={() => { setSent(false); setEmail(''); }} style={btnGhostInline}>
                {c.change_email}
              </button>
            </div>
          </>
        )}

        {!loading && session && (
          <>
            <div style={{ padding: "48px 0 24px", textAlign: "center" }}>
              <h1 style={{ fontWeight: 800, fontSize: "clamp(28px, 6vw, 40px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                {c.title}
              </h1>
            </div>

            {upgradedMsg && (
              <div style={{ background: "#e7f3ec", border: "1.5px solid #1f9f5f", borderRadius: 28, padding: "20px 24px", marginBottom: 16 }}>
                <div style={{ color: "#167a48", fontWeight: 700, marginBottom: 6 }}>{c.paid_title}</div>
                <div style={{ color: "#2a2a2a", fontSize: 14 }}>
                  {c.paid_sub}
                </div>
              </div>
            )}

            <div style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
                <div>
                  <div style={labelStyle}>{c.logged_as}</div>
                  <div style={{ fontSize: 17, color: "#111", fontWeight: 600, wordBreak: "break-all" }}>{session.user.email}</div>
                </div>
                <button onClick={logout} style={btnGhostSmall}>{c.logout}</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={statBox}>
                  <div style={labelStyle}>{c.plan_label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: isPro ? "#167a48" : "#111", letterSpacing: "-0.02em" }}>{planLabel}</div>
                </div>
                <div style={statBox}>
                  <div style={labelStyle}>{c.cert_count}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>{envois.length}</div>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <Link href="/protection">
                <a style={dashCard}>
                  <div style={dashIcon}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#167a48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                  <div style={dashTitle}>{c.dash_protection_title}</div>
                  <div style={dashSub}>{c.dash_protection_sub}</div>
                </a>
              </Link>
              <Link href="/litige">
                <a style={dashCard}>
                  <div style={dashIcon}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#167a48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div style={dashTitle}>{c.dash_litige_title}</div>
                  <div style={dashSub}>{c.dash_litige_sub}</div>
                </a>
              </Link>
            </div>

            <div style={cardStyle}>
              <div style={labelStyle}>{c.badge_kicker}</div>
              <p style={{ color: "#6b6b6b", fontSize: 14, lineHeight: 1.6, margin: "8px 0 16px" }}>
                {c.badge_desc}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={badgeHandle}
                  onChange={(e) => setBadgeHandle(e.target.value)}
                  placeholder={c.badge_handle_ph}
                  style={{ ...inputStyle, flex: "1 1 180px", width: "auto" }}
                />
                <select
                  value={badgePlatform}
                  onChange={(e) => setBadgePlatform(e.target.value)}
                  style={{ ...inputStyle, flex: "0 1 180px", width: "auto", cursor: "pointer" }}
                >
                  <option value="vinted">Vinted</option>
                  <option value="depop">Depop</option>
                  <option value="grailed">Grailed</option>
                  <option value="vestiaire">Vestiaire Collective</option>
                  <option value="etsy">Etsy</option>
                  <option value="autre">{c.badge_platform_other}</option>
                </select>
              </div>
              <div style={{ height: 12 }} />
              <button
                onClick={makeBadge}
                disabled={badgeBusy || !badgeHandle.trim()}
                style={{ ...btnPrimary, opacity: badgeBusy || !badgeHandle.trim() ? 0.5 : 1, cursor: badgeBusy ? "wait" : "pointer" }}
              >
                {badgeBusy ? c.badge_generating : c.badge_btn}
              </button>
              {badgeError && <div style={errorBox}>{badgeError}</div>}
              {badgePreview && (
                <div style={{ marginTop: 18, textAlign: "center" }}>
                  <img
                    src={badgePreview.dataUrl}
                    alt={`Badge SellCov @${badgePreview.handle}`}
                    style={{ width: "100%", maxWidth: 320, margin: "0 auto 12px", borderRadius: 16, border: "1.5px solid #e6e4dc" }}
                  />
                  <button onClick={saveBadge} style={{ ...btnPrimary, maxWidth: 320 }}>
                    {c.badge_download}
                  </button>
                  <p style={{ fontSize: 12.5, color: "#6b6b6b", marginTop: 12, lineHeight: 1.6 }}>
                    {c.badge_page_note}{" "}
                    <a href={`/vendeur/${badgePreview.slug}`} style={{ color: "#167a48", fontWeight: 600, textDecoration: "underline" }}>
                      sellcov.com/vendeur/{badgePreview.slug}
                    </a>
                  </p>
                </div>
              )}
            </div>

            {!isPro && (
              <div style={cardStyle}>
                <div style={labelStyle}>{c.upgrade_kicker}</div>
                <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, margin: "8px 0 4px", letterSpacing: "-0.02em" }}>
                  49 € <span style={{ fontSize: 14, color: "#6b6b6b", fontWeight: 500 }}>{c.upgrade_price_suffix}</span>
                </div>
                <p style={{ color: "#6b6b6b", fontSize: 14.5, lineHeight: 1.6, margin: "12px 0 20px" }}>
                  {c.upgrade_desc}
                </p>
                <button onClick={startCheckout} disabled={upgrading} style={{ ...btnPrimary, opacity: upgrading ? 0.5 : 1, cursor: upgrading ? "wait" : "pointer" }}>
                  {upgrading ? c.upgrade_redirect : c.upgrade_btn}
                </button>
                {error && <div style={errorBox}>{error}</div>}
              </div>
            )}

            <div style={{ ...labelStyle, marginTop: 32, marginBottom: 14 }}>{c.last_envois}</div>

            {envois.length === 0 ? (
              <div style={{ ...cardStyle, textAlign: "center", padding: "32px 24px" }}>
                <p style={{ color: "#6b6b6b", fontSize: 14.5, marginBottom: 12 }}>
                  {c.empty_envois}
                </p>
                <Link href="/protection">
                  <span style={{ color: "#167a48", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                    {c.first_envoi_cta}
                  </span>
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {envois.slice(0, 10).map((e) => (
                  <div key={e.id} style={envoiItem}>
                    <div>
                      <div style={{ fontSize: 14.5, color: "#111", fontWeight: 600, marginBottom: 3 }}>
                        {e.article_name || c.untitled}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b6b6b" }}>
                        {new Date(e.created_at).toLocaleString(lang === "en" ? "en-US" : "fr-FR")} · {e.status}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "#a0a09a", fontFamily: "var(--font-mono), monospace", flexShrink: 0 }}>
                      {e.id.substring(0, 8)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1.5px solid #e6e4dc",
  borderRadius: 28,
  padding: "28px 26px",
  marginBottom: 16,
};

const inputStyle = {
  width: "100%",
  background: "#fff",
  border: "1.5px solid #d4d2c8",
  borderRadius: 12,
  padding: "13px 14px",
  color: "#111",
  fontSize: 15.5,
  fontFamily: "inherit",
  display: "block",
  outline: "none",
};

const btnPrimary = {
  width: "100%",
  background: "#1f9f5f",
  color: "#fff",
  border: "none",
  padding: "16px 24px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 15,
  boxShadow: "0 6px 20px rgba(31,159,95,0.22)",
  fontFamily: "inherit",
};

const btnGhostSmall = {
  background: "transparent",
  color: "#111",
  border: "1.5px solid #d4d2c8",
  padding: "8px 16px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 13,
  cursor: "pointer",
  fontFamily: "inherit",
};

const btnGhostInline = {
  background: "transparent",
  color: "#6b6b6b",
  border: "1.5px solid #d4d2c8",
  padding: "10px 18px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  fontFamily: "inherit",
};

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6b6b6b",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  marginBottom: 6,
};

const statBox = {
  padding: "16px 18px",
  background: "#f8f7f3",
  border: "1.5px solid #e6e4dc",
  borderRadius: 16,
};

const errorBox = {
  marginTop: 14,
  padding: "12px 16px",
  background: "#fdecea",
  border: "1.5px solid #f5c2bc",
  borderRadius: 12,
  color: "#c0392b",
  fontSize: 14,
  fontWeight: 500,
};

const dashCard = {
  background: "#fff",
  border: "1.5px solid #e6e4dc",
  borderRadius: 28,
  padding: "26px 24px",
  textDecoration: "none",
  display: "block",
  cursor: "pointer",
  transition: "border-color .15s, transform .15s",
};

const dashIcon = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "#e7f3ec",
  display: "grid",
  placeItems: "center",
  marginBottom: 14,
};

const dashTitle = {
  fontSize: 17,
  fontWeight: 800,
  color: "#111",
  letterSpacing: "-0.01em",
  marginBottom: 6,
};

const dashSub = {
  fontSize: 13.5,
  color: "#6b6b6b",
  lineHeight: 1.5,
};

const envoiItem = {
  padding: "15px 18px",
  background: "#fff",
  border: "1.5px solid #e6e4dc",
  borderRadius: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
};
