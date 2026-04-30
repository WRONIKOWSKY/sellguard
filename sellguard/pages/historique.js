import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLang } from '../contexts/LangContext';

const PLATFORM_STYLE = {
  'Vinted':               { bg: 'rgba(9,177,186,0.12)',  color: '#2fd4dd' },
  'Depop':                { bg: 'rgba(255,0,0,0.12)',    color: '#ff5555' },
  'Grailed':              { bg: 'rgba(255,255,255,0.08)',color: '#fff' },
  'Vestiaire Collective': { bg: 'rgba(255,255,255,0.06)',color: '#ccc' },
  'Etsy':                 { bg: 'rgba(241,100,30,0.12)', color: '#ff8740' },
};

// Fonction exportée utilisée par annonce.js — NE PAS MODIFIER LA SIGNATURE
export function saveToHistory(result, condition, lang) {
  try {
    const history = JSON.parse(localStorage.getItem('sg_history') || '[]');
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleString('fr-FR'),
      lang: lang || 'fr',
      item_name: result.item_name,
      item_category: result.item_category,
      condition,
      best_platform: result.best_platform,
      platforms: result.platforms,
      title: result.title,
      description: result.description,
      keywords: result.keywords,
      selling_tips: result.selling_tips,
      time_to_sell: result.time_to_sell,
    };
    const updated = [entry, ...history].slice(0, 20);
    localStorage.setItem('sg_history', JSON.stringify(updated));
  } catch (e) {}
}

export default function Historique() {
  const { lang } = useLang();
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState({});

  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem('sg_history') || '[]');
      setHistory(h);
    } catch (e) {}
  }, []);

  function deleteEntry(id) {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    localStorage.setItem('sg_history', JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  }

  function clearAll() {
    setHistory([]);
    setSelected(null);
    localStorage.removeItem('sg_history');
  }

  function copy(key, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied((c) => ({ ...c, [key]: true }));
      setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1500);
    });
  }

  const title = lang === 'en' ? 'My listings' : lang === 'es' ? 'Mis anuncios' : lang === 'it' ? 'I miei annunci' : 'Mes annonces';
  const empty_title = lang === 'en' ? 'No listings yet' : lang === 'es' ? 'Sin anuncios todavía' : lang === 'it' ? 'Nessun annuncio' : "Pas encore d'annonces";
  const empty_sub = lang === 'en' ? 'Generate your first listing in the Listing tab.' : lang === 'es' ? 'Genera tu primer anuncio en la pestaña Anuncio.' : lang === 'it' ? "Genera il tuo primo annuncio nella scheda Annuncio." : "Génère ta première annonce dans l'onglet Annonce.";
  const clear_btn = lang === 'en' ? 'Clear all' : lang === 'es' ? 'Borrar todo' : lang === 'it' ? 'Cancella tutto' : 'Tout effacer';
  const delete_btn = lang === 'en' ? 'Delete' : lang === 'es' ? 'Eliminar' : lang === 'it' ? 'Elimina' : 'Supprimer';
  const back_btn = lang === 'en' ? '← Back' : lang === 'es' ? '← Volver' : lang === 'it' ? '← Indietro' : '← Retour';
  const copy_btn = lang === 'en' ? 'Copy' : lang === 'es' ? 'Copiar' : lang === 'it' ? 'Copia' : 'Copier';
  const copied_btn = lang === 'en' ? 'Copied ✓' : lang === 'es' ? 'Copiado ✓' : lang === 'it' ? 'Copiato ✓' : 'Copié ✓';
  const title_l = lang === 'en' ? 'TITLE' : lang === 'es' ? 'TÍTULO' : lang === 'it' ? 'TITOLO' : 'TITRE';
  const desc_l = 'DESCRIPTION';
  const kw_l = lang === 'en' ? 'KEYWORDS' : lang === 'es' ? 'PALABRAS CLAVE' : lang === 'it' ? 'PAROLE CHIAVE' : 'MOTS-CLÉS';
  const tips_l = lang === 'en' ? 'TIPS' : lang === 'es' ? 'CONSEJOS' : lang === 'it' ? 'CONSIGLI' : 'CONSEILS';
  const countLabel = (n) => {
    if (lang === 'en') return n + ' listing' + (n > 1 ? 's' : '') + ' generated';
    if (lang === 'es') return n + ' anuncio' + (n > 1 ? 's' : '') + ' generado' + (n > 1 ? 's' : '');
    if (lang === 'it') return n + ' annunc' + (n > 1 ? 'i' : 'io') + ' generat' + (n > 1 ? 'i' : 'o');
    return n + ' annonce' + (n > 1 ? 's' : '') + ' générée' + (n > 1 ? 's' : '');
  };

  const sharedStyles = (
    <>
      <Head>
        <title>SellCov — {selected ? selected.item_name : title}</title>
        <meta name="description" content="Retrouve toutes les annonces que tu as générées avec SellCov." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root{--bg:#000;--bg-soft:#0a0a0a;--bg-card:#0e0e0e;--bg-panel:#141414;--border:#1e1e1e;--border-strong:#2a2a2a;--text:#fff;--text-muted:#9a9a9a;--text-dim:#5a5a5a;--violet:#8b7fff;--green:#5ee8a3;--pink:#f570aa;--green-bg:rgba(94,232,163,.07);--pink-bg:rgba(245,112,170,.07);--violet-bg:rgba(139,127,255,.09);--radius-sm:10px;--radius:18px;--radius-lg:28px;--maxw:1200px}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh}
        a{color:inherit;text-decoration:none}
        .serif{font-family:'Playfair Display',serif;font-weight:700;letter-spacing:-.01em}
        .italic{font-style:italic;color:var(--text-muted);font-weight:500}
        header{position:fixed;top:0;left:0;right:0;z-index:100;backdrop-filter:blur(14px);background:rgba(0,0,0,.55);border-bottom:1px solid rgba(255,255,255,.04)}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;max-width:var(--maxw);margin:0 auto}
        .logo{display:flex;align-items:center;gap:10px;font-family:'Playfair Display',serif;font-weight:700;font-size:20px}
        .logo-mark{width:32px;height:32px;border:1.5px solid #fff;border-radius:50%;display:grid;place-items:center;font-size:11px;letter-spacing:.5px;font-family:'Inter',sans-serif;font-weight:600}
        .nav-back{color:var(--text-muted);font-size:14px;transition:color .2s}
        .nav-back:hover{color:#fff}
        .btn-ghost{background:rgba(255,255,255,.04);color:var(--text-muted);border:1px solid var(--border-strong);padding:8px 16px;font-size:13px;border-radius:999px;cursor:pointer;font-family:inherit;transition:border-color .15s,color .15s}
        .btn-ghost:hover{border-color:#fff;color:#fff}
        .btn-copy{background:rgba(255,255,255,.06);color:var(--text-muted);border:none;padding:5px 12px;font-size:12px;border-radius:999px;cursor:pointer;font-family:inherit;transition:background .15s}
        .btn-copy:hover{background:rgba(255,255,255,.1);color:#fff}
        .btn-danger{background:var(--pink-bg);color:var(--pink);border:1px solid rgba(245,112,170,.3);padding:6px 14px;font-size:12px;border-radius:999px;cursor:pointer;font-family:inherit;transition:background .15s}
        .btn-danger:hover{background:rgba(245,112,170,.15)}
        .btn-danger-full{width:100%;padding:13px;font-size:13px;font-weight:600;border-radius:14px;border:1px solid rgba(245,112,170,.3);background:var(--pink-bg);color:var(--pink);cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .15s}
        .btn-danger-full:hover{background:rgba(245,112,170,.15)}
        main{min-height:calc(100vh - 160px);padding:140px 24px 80px;display:flex;align-items:flex-start;justify-content:center}
        .container{width:100%;max-width:640px}
        .page-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;gap:16px;flex-wrap:wrap}
        .page-title{font-family:'Playfair Display',serif;font-size:clamp(30px,4vw,42px);line-height:1.05;letter-spacing:-.02em;display:flex;align-items:center;gap:12px}
        .page-icon{width:36px;height:36px;border-radius:10px;background:var(--bg-card);border:1px solid var(--border);display:grid;place-items:center;color:var(--text-muted)}
        .page-count{font-size:13px;color:var(--text-muted);margin-top:6px}
        .empty{text-align:center;padding:80px 24px}
        .empty-icon{width:72px;height:72px;border-radius:20px;background:var(--bg-card);border:1px solid var(--border);display:grid;place-items:center;margin:0 auto 18px;color:var(--text-dim)}
        .empty-title{font-size:17px;font-weight:600;color:#fff;margin-bottom:6px;font-family:'Playfair Display',serif;letter-spacing:-.01em}
        .empty-sub{font-size:14px;color:var(--text-muted);line-height:1.6}
        .entry-list{display:flex;flex-direction:column;gap:10px}
        .entry{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:16px 18px;cursor:pointer;display:flex;align-items:center;gap:14px;transition:border-color .15s,transform .15s}
        .entry:hover{border-color:var(--border-strong);transform:translateY(-1px)}
        .entry-body{flex:1;min-width:0}
        .entry-name{font-size:15px;font-weight:700;color:#fff;margin-bottom:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .entry-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .chip{font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px}
        .chip-price{font-size:12px;color:var(--text-muted)}
        .chip-lang{font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;letter-spacing:.05em}
        .chip-lang.fr{background:var(--green-bg);color:var(--green);border:1px solid rgba(94,232,163,.25)}
        .chip-lang.en{background:var(--violet-bg);color:var(--violet);border:1px solid rgba(139,127,255,.25)}
        .chip-lang.es{background:rgba(245,158,11,.08);color:#fbbf24;border:1px solid rgba(245,158,11,.25)}
        .chip-lang.it{background:rgba(244,114,182,.08);color:var(--pink);border:1px solid rgba(244,114,182,.25)}
        .chip-date{font-size:11px;color:var(--text-dim)}
        .entry-arrow{color:var(--text-dim);font-size:18px;flex-shrink:0}
        .detail-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;gap:16px;flex-wrap:wrap}
        .detail-title{font-family:'Playfair Display',serif;font-size:26px;line-height:1.05;letter-spacing:-.02em}
        .detail-meta{font-size:13px;color:var(--text-muted);margin-top:4px}
        .plat-card{border-radius:14px;padding:14px 18px;margin-bottom:12px;border:1px solid var(--border)}
        .plat-head{display:flex;justify-content:space-between;align-items:center}
        .plat-chip{font-size:13px;font-weight:600;padding:4px 12px;border-radius:999px;background:#060606;display:inline-block}
        .plat-price{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#fff;text-align:right}
        .card{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px 18px;margin-bottom:10px}
        .card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:12px}
        .card-label{font-size:11px;font-weight:700;color:var(--text-dim);letter-spacing:.12em;text-transform:uppercase}
        .card-title-text{font-size:15px;font-weight:700;color:#fff;line-height:1.7}
        .card-desc-text{font-size:13px;color:#fff;line-height:1.7}
        .kw-tag{display:inline-block;font-size:12px;padding:5px 12px;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:999px;margin:0 6px 8px 0;color:var(--text-muted)}
        .tips-card{background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.2);border-radius:14px;padding:14px 18px;margin-bottom:16px}
        .tips-label{font-size:11px;font-weight:700;color:#f9a95c;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px}
        .tip-item{display:flex;gap:10px;margin-bottom:8px}
        .tip-item:last-child{margin-bottom:0}
        .tip-bullet{color:#f9a95c;flex-shrink:0}
        .tip-text{font-size:13px;color:var(--text-muted);line-height:1.55}
        @media(max-width:560px){
          main{padding:120px 16px 60px}
          .page-head,.detail-head{flex-direction:column;align-items:stretch}
          .foot{flex-direction:column;gap:14px;text-align:center}
          .foot-links{justify-content:center}
        }
      `}</style>

      <header>
        <div className="nav">
          <Link href="/" className="logo">
            <span className="logo-mark">sc</span>SellCov
          </Link>
          <Link href="/" className="nav-back">← Retour</Link>
        </div>
      </header>
    </>
  );

  // VUE DÉTAIL
  if (selected) {
    const best = selected.platforms?.find((p) => p.name === selected.best_platform) || selected.platforms?.[0];
    return (
      <>
        {sharedStyles}
        <main>
          <div className="container">
            <div className="detail-head">
              <div>
                <h2 className="detail-title serif">{selected.item_name}</h2>
                <p className="detail-meta">{selected.item_category} · {selected.condition || '—'} · {selected.date}</p>
              </div>
              <button className="btn-ghost" onClick={() => setSelected(null)}>{back_btn}</button>
            </div>

            {best && (
              <div
                className="plat-card"
                style={{ background: PLATFORM_STYLE[best.name]?.bg || 'var(--bg-card)' }}
              >
                <div className="plat-head">
                  <span
                    className="plat-chip"
                    style={{ color: PLATFORM_STYLE[best.name]?.color || '#fff' }}
                  >{best.name}</span>
                  <p className="plat-price">{best.price_min}–{best.price_max}€</p>
                </div>
              </div>
            )}

            {[[title_l, 'title', selected.title], [desc_l, 'desc', selected.description]].map(([label, key, value]) => (
              <div key={key} className="card">
                <div className="card-head">
                  <span className="card-label">{label}</span>
                  <button className="btn-copy" onClick={() => copy(key, value)}>
                    {copied[key] ? copied_btn : copy_btn}
                  </button>
                </div>
                <p className={key === 'title' ? 'card-title-text' : 'card-desc-text'}>{value}</p>
              </div>
            ))}

            <div className="card">
              <p className="card-label" style={{ marginBottom: 12 }}>{kw_l}</p>
              <div>
                {selected.keywords?.map((k) => (
                  <span key={k} className="kw-tag">#{k}</span>
                ))}
              </div>
            </div>

            {selected.selling_tips?.length > 0 && (
              <div className="tips-card">
                <p className="tips-label">{tips_l}</p>
                {selected.selling_tips.map((tip, i) => (
                  <div key={i} className="tip-item">
                    <span className="tip-bullet">·</span>
                    <p className="tip-text">{tip}</p>
                  </div>
                ))}
              </div>
            )}

            <button className="btn-danger-full" onClick={() => deleteEntry(selected.id)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
              </svg>
              {delete_btn}
            </button>
          </div>
        </main>
      </>
    );
  }

  // VUE LISTE
  return (
    <>
      {sharedStyles}
      <main>
        <div className="container">
          <div className="page-head">
            <div>
              <h1 className="page-title serif">
                <span className="page-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </span>
                {title}
              </h1>
              {history.length > 0 && <p className="page-count">{countLabel(history.length)}</p>}
            </div>
            {history.length > 0 && (
              <button className="btn-danger" onClick={clearAll}>{clear_btn}</button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
              <p className="empty-title">{empty_title}</p>
              <p className="empty-sub">{empty_sub}</p>
            </div>
          ) : (
            <div className="entry-list">
              {history.map((entry) => {
                const best = entry.platforms?.find((p) => p.name === entry.best_platform) || entry.platforms?.[0];
                const langKey = entry.lang || 'fr';
                return (
                  <div key={entry.id} className="entry" onClick={() => setSelected(entry)}>
                    <div className="entry-body">
                      <p className="entry-name">{entry.item_name}</p>
                      <div className="entry-meta">
                        {best && (
                          <span
                            className="chip"
                            style={{
                              background: PLATFORM_STYLE[best.name]?.bg || 'rgba(255,255,255,0.06)',
                              color: PLATFORM_STYLE[best.name]?.color || 'var(--text-muted)',
                            }}
                          >{best.name}</span>
                        )}
                        {best && <span className="chip-price">{best.price_min}–{best.price_max}€</span>}
                        <span className={'chip-lang ' + langKey}>{langKey.toUpperCase()}</span>
                        <span className="chip-date">{entry.date}</span>
                      </div>
                    </div>
                    <span className="entry-arrow">→</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
