import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabaseClient';

export default function Compte() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [envois, setEnvois] = useState([]);

  useEffect(() => {
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
      .then(({ data }) => setProfile(data));
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
      setError('Connexion impossible.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Email invalide.');
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

  return (
    <>
      <Head>
        <title>Compte — SellCov</title>
        <meta name="description" content="Accède à ton espace SellCov. Gère tes envois certifiés et ton abonnement." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root{--bg:#000;--bg-soft:#0a0a0a;--bg-card:#0e0e0e;--bg-panel:#141414;--border:#1e1e1e;--border-strong:#2a2a2a;--text:#fff;--text-muted:#9a9a9a;--text-dim:#5a5a5a;--violet:#8b7fff;--green:#5ee8a3;--pink:#f570aa;--green-bg:rgba(94,232,163,.07);--pink-bg:rgba(245,112,170,.07);--radius-sm:10px;--radius:18px;--radius-lg:28px;--maxw:1200px}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh}
        a{color:inherit;text-decoration:none}
        .serif{font-family:'Playfair Display',serif;font-weight:700;letter-spacing:-.01em}
        .italic{font-style:italic;color:var(--text-muted);font-weight:500}
        header{position:fixed;top:0;left:0;right:0;z-index:100;backdrop-filter:blur(14px);background:rgba(0,0,0,.55);border-bottom:1px solid rgba(255,255,255,.04)}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;max-width:var(--maxw);margin:0 auto}
        .logo{display:flex;align-items:center;gap:10px;font-family:'Playfair Display',serif;font-weight:700;font-size:20px}
        .logo-img{height:72px;width:auto;display:block}
        .nav-back{color:var(--text-muted);font-size:14px;transition:color .2s}
        .nav-back:hover{color:#fff}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 22px;border-radius:999px;font-weight:600;font-size:15px;transition:transform .15s,box-shadow .15s,background .15s;cursor:pointer;border:none;font-family:inherit;white-space:nowrap}
        .btn-primary{background:#fff;color:#000;width:100%}
        .btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 30px rgba(255,255,255,.15)}
        .btn-primary:disabled{opacity:.6;cursor:wait}
        .btn-ghost{background:transparent;color:var(--text-muted);border:1px solid var(--border-strong);padding:8px 16px;font-size:13px;border-radius:999px}
        .btn-ghost:hover{border-color:#fff;color:#fff}
        .btn-sm{padding:9px 16px;font-size:13px}
        main{min-height:calc(100vh - 160px);padding:140px 24px 80px;display:flex;align-items:flex-start;justify-content:center}
        .container{width:100%;max-width:560px}
        .card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:36px}
        .card-title{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,40px);line-height:1.05;letter-spacing:-.02em;margin-bottom:10px}
        .card-sub{color:var(--text-muted);font-size:15px;line-height:1.55;margin-bottom:28px}
        .input{width:100%;padding:15px 18px;font-size:15px;background:#060606;border:1px solid var(--border-strong);border-radius:999px;color:#fff;font-family:inherit;margin-bottom:12px;transition:border-color .15s}
        .input::placeholder{color:var(--text-dim)}
        .input:focus{outline:none;border-color:var(--green)}
        .error-msg{margin-top:12px;padding:12px 16px;background:var(--pink-bg);border:1px solid rgba(245,112,170,.3);border-radius:10px;color:var(--pink);font-size:13px}
        .sent-card{text-align:center}
        .sent-icon{width:64px;height:64px;margin:0 auto 18px;border-radius:50%;background:var(--green-bg);border:1px solid rgba(94,232,163,.3);display:grid;place-items:center;color:var(--green)}
        .sent-email{color:#fff;font-weight:500}
        .session-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;gap:16px;flex-wrap:wrap}
        .label{font-size:11px;color:var(--text-dim);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;font-weight:500}
        .value-email{font-size:17px;color:#fff;font-weight:500;word-break:break-all}
        .stats-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px}
        .stat-box{padding:16px 18px;background:#060606;border:1px solid var(--border);border-radius:12px}
        .stat-value{font-size:18px;color:#fff;font-weight:600;font-family:'Playfair Display',serif}
        .stat-value.accent{color:var(--green)}
        .section-title{font-size:11px;color:var(--text-dim);letter-spacing:.12em;text-transform:uppercase;margin:28px 0 14px;font-weight:500}
        .empty{text-align:center;padding:36px 28px;color:var(--text-muted);font-size:14px;line-height:1.6}
        .empty-link{color:var(--green);font-weight:500;display:inline-block;margin-top:10px;transition:opacity .15s}
        .empty-link:hover{opacity:.75}
        .envoi-list{display:flex;flex-direction:column;gap:8px}
        .envoi-item{padding:15px 18px;background:#060606;border:1px solid var(--border);border-radius:12px;display:flex;justify-content:space-between;align-items:center;gap:12px;transition:border-color .15s}
        .envoi-item:hover{border-color:var(--border-strong)}
        .envoi-name{font-size:14px;color:#fff;margin-bottom:3px}
        .envoi-meta{font-size:11px;color:var(--text-dim)}
        .envoi-id{font-size:10px;color:var(--text-dim);font-family:'SFMono-Regular',Menlo,monospace;flex-shrink:0}
        .loading{text-align:center;color:var(--text-muted);padding:40px 28px;font-size:14px}
        @media(max-width:560px){
          .stats-row{grid-template-columns:1fr}
          .card{padding:28px 24px}
          main{padding:120px 16px 60px}
          .envoi-item{flex-direction:column;align-items:flex-start;gap:6px}
          .foot{flex-direction:column;gap:14px;text-align:center}
          .foot-links{justify-content:center}
        }
      `}</style>

      <header>
        <div className="nav">
          <Link href="/" className="logo">
            <img src="/logo.png" alt="SellCov" className="logo-img" />
          </Link>
          <Link href="/" className="nav-back">Retour</Link>
        </div>
      </header>

      <main>
        <div className="container">

          {loading && (
            <div className="card loading">Chargement…</div>
          )}

          {!loading && !session && !sent && (
            <div className="card">
              <h1 className="card-title serif">
                Mon <span className="italic">compte.</span>
              </h1>
              <p className="card-sub">
                Entre ton email. Tu recevras un lien de connexion sécurisé, sans mot de passe.
              </p>
              <form onSubmit={sendMagicLink}>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending}
                >
                  {sending ? 'Envoi…' : 'Recevoir le lien de connexion'}
                </button>
                {error && <div className="error-msg">{error}</div>}
              </form>
            </div>
          )}

          {!loading && !session && sent && (
            <div className="card sent-card">
              <div className="sent-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <h2 className="card-title serif" style={{fontSize:'28px'}}>
                Vérifie ta <span className="italic">boîte mail.</span>
              </h2>
              <p className="card-sub">
                Un lien de connexion vient d'être envoyé à<br />
                <span className="sent-email">{email}</span>.
                <br /><br />
                Clique dessus pour te connecter.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="btn btn-ghost"
              >
                Changer d'email
              </button>
            </div>
          )}

          {!loading && session && (
            <div>
              <div className="card">
                <div className="session-head">
                  <div>
                    <div className="label">Connecté en tant que</div>
                    <div className="value-email">{session.user.email}</div>
                  </div>
                  <button onClick={logout} className="btn btn-ghost">
                    Déconnexion
                  </button>
                </div>
                <div className="stats-row">
                  <div className="stat-box">
                    <div className="label">Plan</div>
                    <div className={'stat-value' + (profile?.plan === 'pro' ? ' accent' : '')}>
                      {profile?.plan === 'pro' ? 'Pro' : 'Gratuit'}
                    </div>
                  </div>
                  <div className="stat-box">
                    <div className="label">Envois certifiés</div>
                    <div className="stat-value">{envois.length}</div>
                  </div>
                </div>
              </div>

              <div className="section-title">Derniers envois</div>

              {envois.length === 0 ? (
                <div className="card empty">
                  Aucun envoi certifié pour l'instant.
                  <br />
                  <Link href="/protection" className="empty-link">
                    Protéger un envoi →
                  </Link>
                </div>
              ) : (
                <div className="envoi-list">
                  {envois.slice(0, 10).map((e) => (
                    <div key={e.id} className="envoi-item">
                      <div>
                        <div className="envoi-name">
                          {e.article_name || 'Envoi sans titre'}
                        </div>
                        <div className="envoi-meta">
                          {new Date(e.created_at).toLocaleString('fr-FR')} · {e.status}
                        </div>
                      </div>
                      <div className="envoi-id">{e.id.substring(0, 8)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
