import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useLang } from '../contexts/LangContext';
import { getSupabase } from '../lib/supabaseClient';
import { compressImage } from '../lib/imageUtils';

export default function Litige() {
  const { t, lang } = useLang();
  const l = t.litige;

  const [type, setType] = useState('');
  const [buyerMessage, setBuyerMessage] = useState('');
  const [certRef, setCertRef] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      if (!file) return;
      compressImage(file, 1200, 0.75, (dataUrl) => {
        setImagePreviews(p => [...p, dataUrl]);
        setImages(i => [...i, { base64: dataUrl.split(',')[1], mime: 'image/jpeg' }]);
      });
    });
  }

  async function analyze() {
    if (!buyerMessage.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const sb = getSupabase();
      const sessRes = await sb.auth.getSession();
      const session = sessRes?.data?.session;
      if (!session) {
        setError('Tu dois être connecté pour gérer un litige. Va sur /compte.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/litige', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session.access_token
        },
        body: JSON.stringify({ type, buyerMessage, certRef, images })
      });
      const data = await res.json();
      if (res.status === 429) throw new Error('Quota journalier atteint (10 litiges / jour). Reset à minuit UTC.');
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setResult(data);
    } catch (e) {
      const msg = e.message || '';
      if (msg.includes('Quota')) {
        setError(msg);
      } else if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError('Erreur de connexion. Vérifie ta connexion internet et réessaie.');
      } else if (msg.includes('503') || msg.includes('overloaded')) {
        setError('Le serveur est occupé. Attends quelques secondes et réessaie.');
      } else {
        setError('Une erreur est survenue. Réessaie.');
      }
    }
    setLoading(false);
  }

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function reset() {
    setResult(null); setImages([]); setImagePreviews([]); setBuyerMessage(''); setCertRef(''); setError(null);
  }

  const fraudClass = result?.fraud_score >= 7
    ? 'fraud-high'
    : result?.fraud_score >= 4
    ? 'fraud-mid'
    : 'fraud-low';

  const fraudLabel = result?.fraud_score >= 7
    ? (lang === 'en' ? 'Likely fraud' : lang === 'es' ? 'Fraude probable' : lang === 'it' ? 'Frode probabile' : 'Fraude probable')
    : result?.fraud_score >= 4
    ? (lang === 'en' ? 'Suspicious' : lang === 'es' ? 'Sospechoso' : lang === 'it' ? 'Sospetto' : 'Suspect')
    : (lang === 'en' ? 'Seems legitimate' : lang === 'es' ? 'Parece legítimo' : lang === 'it' ? 'Sembra legittimo' : 'Semble légitime');

  const selectPlaceholder = lang === 'en' ? 'Select type' : lang === 'es' ? 'Seleccionar tipo' : lang === 'it' ? 'Seleziona tipo' : 'Sélectionner le type';

  return (
    <>
      <Head>
        <title>SellCov {l.title}</title>
        <meta name="description" content="Génère une défense automatique pour répondre aux litiges acheteurs." />
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
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 22px;border-radius:999px;font-weight:600;font-size:15px;transition:transform .15s,box-shadow .15s,background .15s,opacity .15s;cursor:pointer;border:none;font-family:inherit;white-space:nowrap}
        .btn-primary{background:#fff;color:#000;width:100%;padding:15px 22px}
        .btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 30px rgba(255,255,255,.15)}
        .btn-primary:disabled{background:rgba(255,255,255,.06);color:rgba(255,255,255,.25);cursor:not-allowed}
        .btn-ghost{background:rgba(255,255,255,.04);color:var(--text-muted);border:1px solid var(--border-strong);padding:8px 16px;font-size:13px;border-radius:999px}
        .btn-ghost:hover{border-color:#fff;color:#fff}
        .btn-copy{background:rgba(255,255,255,.06);color:var(--text-muted);border:none;padding:5px 12px;font-size:12px;border-radius:999px;cursor:pointer;font-family:inherit;transition:background .15s}
        .btn-copy:hover{background:rgba(255,255,255,.1);color:#fff}
        main{min-height:calc(100vh - 160px);padding:140px 24px 80px;display:flex;align-items:flex-start;justify-content:center}
        .container{width:100%;max-width:640px}
        .intro{margin-bottom:36px}
        .page-title{font-family:'Playfair Display',serif;font-size:clamp(34px,4.5vw,46px);line-height:1.02;letter-spacing:-.02em;margin-bottom:12px}
        .page-sub{color:var(--text-muted);font-size:15px;line-height:1.6}
        .field{margin-bottom:18px}
        .field-label{display:block;font-size:12px;font-weight:600;color:var(--text-muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}
        .field-hint{font-weight:400;color:var(--text-dim);text-transform:none;letter-spacing:0}
        .input,.select,.textarea{width:100%;padding:14px 18px;font-size:15px;background:#060606;border:1px solid var(--border-strong);border-radius:14px;color:#fff;font-family:inherit;transition:border-color .15s;outline:none}
        .input:focus,.select:focus,.textarea:focus{border-color:var(--green)}
        .input::placeholder,.textarea::placeholder{color:var(--text-dim)}
        .select{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9a9a' stroke-width='2.5'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e");background-repeat:no-repeat;background-position:right 18px center;padding-right:42px}
        .textarea{resize:none;line-height:1.6}
        .dropzone{border:1.5px dashed var(--border-strong);border-radius:14px;padding:20px;cursor:pointer;background:#060606;text-align:center;min-height:80px;display:flex;align-items:center;justify-content:center;transition:border-color .15s}
        .dropzone:hover{border-color:var(--green)}
        .dropzone-empty{font-size:13px;color:var(--text-dim)}
        .dropzone-previews{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
        .dropzone-previews img{height:70px;border-radius:8px;object-fit:cover}
        .error-box{margin-top:14px;padding:12px 16px;background:var(--pink-bg);border:1px solid rgba(245,112,170,.3);border-radius:12px;color:var(--pink);font-size:13px}
        .result-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;gap:16px;flex-wrap:wrap}
        .result-title{font-family:'Playfair Display',serif;font-size:28px;line-height:1;letter-spacing:-.02em}
        .card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:22px 24px;margin-bottom:14px}
        .card-label{font-size:11px;font-weight:600;color:var(--text-dim);letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px}
        .card-body{font-size:14px;color:#fff;line-height:1.7}
        .card-body-muted{font-size:14px;color:var(--text-muted);line-height:1.7}
        .fraud-card{border-radius:var(--radius);padding:20px 24px;margin-bottom:14px;border:1px solid}
        .fraud-card.fraud-high{background:rgba(220,38,38,.08);border-color:rgba(220,38,38,.3)}
        .fraud-card.fraud-high .fraud-text{color:#f87171}
        .fraud-card.fraud-mid{background:rgba(245,112,170,.08);border-color:rgba(245,112,170,.3)}
        .fraud-card.fraud-mid .fraud-text{color:var(--pink)}
        .fraud-card.fraud-low{background:var(--green-bg);border-color:rgba(94,232,163,.3)}
        .fraud-card.fraud-low .fraud-text{color:var(--green)}
        .fraud-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:16px;flex-wrap:wrap}
        .fraud-label{font-size:13px;font-weight:700}
        .fraud-score{font-family:'Playfair Display',serif;font-size:24px;font-weight:700}
        .fraud-analysis{font-size:13px;color:var(--text-muted);line-height:1.55}
        .arg-item{display:flex;gap:12px;padding:12px 16px;background:#060606;border:1px solid var(--border);border-radius:12px;margin-bottom:10px}
        .arg-item:last-child{margin-bottom:0}
        .arg-check{flex-shrink:0;width:20px;height:20px;border-radius:50%;background:var(--green-bg);border:1px solid rgba(94,232,163,.3);display:grid;place-items:center;color:var(--green);font-size:12px;margin-top:1px}
        .arg-text{font-size:13px;color:var(--text-muted);line-height:1.6}
        .response-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;gap:16px}
        .response-body{font-size:14px;color:#fff;line-height:1.8;white-space:pre-wrap}
        .steps-card{background:var(--violet-bg);border:1px solid rgba(139,127,255,.25);border-radius:var(--radius);padding:20px 24px}
        .steps-label{font-size:11px;font-weight:700;color:var(--violet);letter-spacing:.12em;text-transform:uppercase;margin-bottom:14px}
        .step-item{display:flex;gap:12px;margin-bottom:10px}
        .step-item:last-child{margin-bottom:0}
        .step-num{font-size:13px;font-weight:700;color:var(--violet);flex-shrink:0}
        .step-text{font-size:13px;color:#cdc8ff;line-height:1.6}
        footer{border-top:1px solid var(--border);padding:30px 24px 24px}
        .foot{max-width:var(--maxw);margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;font-size:13px;color:var(--text-dim)}
        .foot-links{display:flex;gap:22px;flex-wrap:wrap;color:var(--text-muted)}
        .foot-links a:hover{color:#fff}
        @media(max-width:560px){
          main{padding:120px 16px 60px}
          .card,.fraud-card,.steps-card{padding:18px 20px}
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

      <main>
        <div className="container">
          {!result ? (
            <>
              <div className="intro">
                <h1 className="page-title serif">
                  {l.title}
                </h1>
                <p className="page-sub">{l.subtitle}</p>
              </div>

              <div className="field">
                <label className="field-label">{l.type_label}</label>
                <select className="select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="">{selectPlaceholder}</option>
                  {l.types.map(ty => <option key={ty}>{ty}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="field-label">{l.msg_label}</label>
                <textarea
                  className="textarea"
                  value={buyerMessage}
                  onChange={e => setBuyerMessage(e.target.value)}
                  rows={5}
                  placeholder={l.msg_ph}
                />
              </div>

              <div className="field">
                <label className="field-label">
                  {l.photos_label} <span className="field-hint">({l.photos_hint})</span>
                </label>
                <div
                  className="dropzone"
                  onClick={() => fileRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                >
                  {imagePreviews.length > 0 ? (
                    <div className="dropzone-previews">
                      {imagePreviews.map((src, i) => <img key={i} src={src} alt="" />)}
                    </div>
                  ) : (
                    <p className="dropzone-empty">{l.photos_add}</p>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => handleFiles(e.target.files)}
                />
              </div>

              <div className="field">
                <label className="field-label">
                  {l.cert_label} <span className="field-hint">({l.cert_hint})</span>
                </label>
                <input
                  className="input"
                  value={certRef}
                  onChange={e => setCertRef(e.target.value)}
                  placeholder={l.cert_ph}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={analyze}
                disabled={loading || !buyerMessage.trim()}
              >
                {loading ? l.analyzing : l.analyze_btn}
              </button>

              {error && <div className="error-box">{error}</div>}
            </>
          ) : (
            <>
              <div className="result-head">
                <h2 className="result-title serif">{l.title}</h2>
                <button className="btn-ghost" onClick={reset} style={{cursor:'pointer',fontFamily:'inherit'}}>
                  {l.back}
                </button>
              </div>

              {result.fraud_score !== undefined && (
                <div className={'fraud-card ' + fraudClass}>
                  <div className="fraud-head">
                    <p className="fraud-label fraud-text">
                      {l.fraud_label} {fraudLabel}
                    </p>
                    <span className="fraud-score fraud-text">{result.fraud_score}/10</span>
                  </div>
                  <p className="fraud-analysis">{result.fraud_analysis}</p>
                </div>
              )}

              <div className="card">
                <p className="card-label">{l.verdict_l}</p>
                <p className="card-body">{result.verdict}</p>
              </div>

              <div className="card">
                <p className="card-label">{l.args_l}</p>
                {result.arguments?.map((arg, i) => (
                  <div key={i} className="arg-item">
                    <span className="arg-check">✓</span>
                    <p className="arg-text">{arg}</p>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="response-head">
                  <p className="card-label" style={{marginBottom:0}}>{l.response_l}</p>
                  <button className="btn-copy" onClick={() => copy(result.response)}>
                    {copied ? l.copied : l.copy}
                  </button>
                </div>
                <p className="response-body">{result.response}</p>
              </div>

              <div className="steps-card">
                <p className="steps-label">{l.steps_l}</p>
                {result.next_steps?.map((step, i) => (
                  <div key={i} className="step-item">
                    <span className="step-num">{i + 1}.</span>
                    <p className="step-text">{step}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <footer>
        <div className="foot">
          <div>© 2026 SellCov</div>
          <div className="foot-links">
            <Link href="/cgu">CGU</Link>
            <Link href="/confidentialite">Confidentialité</Link>
            <a href="mailto:hello@sellcov.com">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
