import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useLang } from '../contexts/LangContext';
import { saveToHistory } from './historique';
import { getSupabase } from '../lib/supabaseClient';
import { compressImage } from '../lib/imageUtils';

const PLATFORM_STYLE = {
  'Vinted':               { bg: 'rgba(9,177,186,0.12)',  color: '#2fd4dd', font: "'Georgia', serif",                weight: 700, transform: 'none',      spacing: '0px' },
  'Depop':                { bg: 'rgba(255,0,0,0.12)',    color: '#ff5555', font: "'Arial Black', sans-serif",       weight: 800, transform: 'none',      spacing: '-0.5px' },
  'Grailed':              { bg: 'rgba(255,255,255,0.08)',color: '#fff',    font: "'Arial Narrow', Arial, sans-serif",weight: 700, transform: 'uppercase', spacing: '2px' },
  'Vestiaire Collective': { bg: 'rgba(255,255,255,0.06)',color: '#ccc',    font: "'Georgia', 'Times New Roman', serif",weight: 700, transform: 'none',   spacing: '0.5px' },
  'Etsy':                 { bg: 'rgba(241,100,30,0.12)', color: '#ff8740', font: "'Helvetica Neue', sans-serif",    weight: 600, transform: 'none',      spacing: '0px' },
};

const MEASURE_FIELDS_FR = {
  'Haut / T-shirt':   ['Poitrine (cm)', 'Épaules (cm)', 'Longueur dos (cm)', 'Manches (cm)'],
  'Veste / Manteau':  ['Épaules (cm)', 'Poitrine (cm)', 'Taille (cm)', 'Longueur dos (cm)', 'Manches (cm)'],
  'Pantalon / Jean':  ['Tour de taille (cm)', 'Tour de hanches (cm)', 'Longueur jambe (cm)', 'Entrejambe (cm)'],
  'Robe / Jupe':      ['Poitrine (cm)', 'Taille (cm)', 'Hanches (cm)', 'Longueur (cm)'],
  'Chaussures':       ['Pointure EU', 'Longueur semelle (cm)'],
  'Accessoire / Sac': ['Longueur (cm)', 'Hauteur (cm)', 'Largeur (cm)'],
};

const MEASURE_FIELDS_EN = {
  'Top / T-shirt':    ['Chest (cm)', 'Shoulders (cm)', 'Back length (cm)', 'Sleeves (cm)'],
  'Jacket / Coat':    ['Shoulders (cm)', 'Chest (cm)', 'Waist (cm)', 'Back length (cm)', 'Sleeves (cm)'],
  'Pants / Jeans':    ['Waist (cm)', 'Hips (cm)', 'Leg length (cm)', 'Inseam (cm)'],
  'Dress / Skirt':    ['Chest (cm)', 'Waist (cm)', 'Hips (cm)', 'Length (cm)'],
  'Shoes':            ['EU Size', 'Sole length (cm)'],
  'Accessory / Bag':  ['Length (cm)', 'Height (cm)', 'Width (cm)'],
};

export default function Annonce() {
  const { lang, t } = useLang();
  const a = t.annonce;
  const tx = (obj) => obj[lang] || obj.en || obj.fr;
  const MEASURE_FIELDS = (lang === 'en' || lang === 'es' || lang === 'it') ? MEASURE_FIELDS_EN : MEASURE_FIELDS_FR;

  const [condition, setCondition] = useState('');
  const [extra, setExtra] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [copied, setCopied] = useState({});
  const [measureCategory, setMeasureCategory] = useState('');
  const [measures, setMeasures] = useState({});
  const fileRef = useRef();

  function handleFiles(fileList) {
    Array.from(fileList).forEach((file) => {
      if (!file) return;
      compressImage(file, 1200, 0.75, (dataUrl) => {
        setImages((prev) => prev.concat([{ preview: dataUrl, base64: dataUrl.split(',')[1], mime: 'image/jpeg', name: file.name }]));
      });
    });
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function setMeasure(field, value) {
    setMeasures((m) => ({ ...m, [field]: value }));
  }

  function buildMeasuresText() {
    if (!measureCategory) return '';
    const fields = MEASURE_FIELDS[measureCategory] || [];
    const filled = fields.filter((f) => measures[f]);
    if (!filled.length) return '';
    const prefix = tx({fr:'Mesures : ', en:'Measurements: ', es:'Medidas: ', it:'Misure: '});
    return prefix + filled.map((f) => {
      const label = f.replace(' (cm)', '').replace(' EU', '').replace(' (EU)', '');
      const unit = (f.toLowerCase().includes('eu') || f.toLowerCase().includes('size')) ? '' : 'cm';
      return label + ' ' + measures[f] + unit;
    }).join(', ');
  }

  async function analyze() {
    if (!images.length && !extra.trim()) return;
    setLoading(true); setError(null); setResult(null);
    const measuresText = buildMeasuresText();
    const fullExtra = [extra, measuresText].filter(Boolean).join(' — ');
    const imageBase64 = images.length > 0 ? images[0].base64 : null;
    const imageMime = images.length > 0 ? images[0].mime : 'image/jpeg';

    try {
      const sb = getSupabase();
      const sessRes = await sb.auth.getSession();
      const session = sessRes?.data?.session;
      if (!session) {
        setError('Tu dois être connecté pour générer une annonce. Va sur /compte.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + session.access_token
        },
        body: JSON.stringify({ imageBase64, imageMime, condition, extra: fullExtra, lang })
      });
      const data = await res.json();
      if (res.status === 429) throw new Error('Quota journalier atteint (10 analyses / jour). Reset à minuit UTC.');
      if (!res.ok) throw new Error(data.error || 'Erreur');
      setResult(data);
      setActiveTab(data.best_platform);
      saveToHistory(data, condition, lang);

      const cat = (data.item_category || '').toLowerCase();
      const fields = (lang === 'en' || lang === 'es' || lang === 'it') ? MEASURE_FIELDS_EN : MEASURE_FIELDS_FR;
      const autoMatch = Object.keys(fields).find((k) => {
        const kl = k.toLowerCase();
        if (cat.includes('vest') || cat.includes('jacket') || cat.includes('manteau') || cat.includes('coat')) return kl.includes('vest') || kl.includes('jack') || kl.includes('mant');
        if (cat.includes('pant') || cat.includes('jean') || cat.includes('trouser')) return kl.includes('pant') || kl.includes('jean');
        if (cat.includes('robe') || cat.includes('dress') || cat.includes('jupe') || cat.includes('skirt')) return kl.includes('robe') || kl.includes('dress') || kl.includes('jupe');
        if (cat.includes('chaussure') || cat.includes('shoe') || cat.includes('sneaker') || cat.includes('boot')) return kl.includes('chaussure') || kl.includes('shoe');
        if (cat.includes('sac') || cat.includes('bag') || cat.includes('accessoire') || cat.includes('accessory')) return kl.includes('sac') || kl.includes('bag') || kl.includes('access');
        if (cat.includes('t-shirt') || cat.includes('top') || cat.includes('sweat') || cat.includes('pull') || cat.includes('shirt')) return kl.includes('haut') || kl.includes('top');
        return false;
      });
      if (autoMatch && !measureCategory) setMeasureCategory(autoMatch);
    } catch (e) {
      const msg = e.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError(tx({fr:'Erreur de connexion. Vérifie ta connexion internet et réessaie.', en:'Connection error. Check your internet and try again.', es:'Error de conexión. Verifica tu conexión e inténtalo de nuevo.', it:'Errore di connessione. Controlla la connessione e riprova.'}));
      } else if (msg.includes('503') || msg.includes('overloaded')) {
        setError(tx({fr:'Le serveur est occupé. Attends quelques secondes et réessaie.', en:'Server is busy. Wait a few seconds and try again.', es:'El servidor está ocupado. Espera unos segundos e inténtalo de nuevo.', it:'Il server è occupato. Attendi qualche secondo e riprova.'}));
      } else if (msg.includes('413') || msg.includes('too large')) {
        setError(tx({fr:'La photo est trop grande. Essaie avec une image plus légère.', en:'Photo is too large. Try with a lighter image.', es:'La foto es demasiado grande. Intenta con una imagen más ligera.', it:"La foto è troppo grande. Prova con un'immagine più leggera."}));
      } else {
        setError(tx({fr:'Une erreur est survenue. Réessaie ou contacte le support.', en:'An error occurred. Please try again.', es:'Ha ocurrido un error. Inténtalo de nuevo.', it:'Si è verificato un errore. Riprova.'}));
      }
    }
    setLoading(false);
  }

  function copy(key, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied((c) => ({ ...c, [key]: true }));
      setTimeout(() => setCopied((c) => ({ ...c, [key]: false })), 1500);
    });
  }

  function reset() {
    setResult(null); setImages([]); setExtra(''); setError(null); setActiveTab(null);
    setMeasureCategory(''); setMeasures({}); setCondition(a.conditions[2] || '');
  }

  const activePlatform = result && result.platforms ? result.platforms.find((p) => p.name === activeTab) : null;

  const selectCondPh = tx({fr:"Sélectionne l'état", en:'Select condition', es:'Seleccionar estado', it:'Seleziona condizione'});
  const addMorePhotos = lang === 'en' ? 'Add more photos' : lang === 'es' ? 'Añadir más fotos' : lang === 'it' ? 'Aggiungi altre foto' : "Ajouter d'autres photos";
  const shareLabel = tx({fr:'Partager', en:'Share', es:'Compartir', it:'Condividi'});
  const copiedAlert = tx({fr:'Annonce copiée !', en:'Listing copied!', es:'¡Anuncio copiado!', it:'Annuncio copiato!'});
  const buyerMsgHeader = tx({fr:"MESSAGE POUR L'ACHETEUR", en:'MESSAGE FOR BUYER', es:'MENSAJE PARA EL COMPRADOR', it:"MESSAGGIO PER L'ACQUIRENTE"});
  const buyerMsg = tx({
    fr: "Merci pour ton achat ! Ton colis a été soigneusement emballé et filmé avant envoi avec SellCov. Une preuve vidéo horodatée est conservée en cas de litige. Bonne réception !",
    en: "Thank you for your purchase! Your parcel was carefully packed and filmed before shipping with SellCov. A timestamped video proof is kept in case of dispute. Enjoy your item!",
    es: "¡Gracias por tu compra! Tu paquete fue cuidadosamente empaquetado y filmado antes del envío con SellCov. Se conserva una prueba de vídeo con marca temporal en caso de disputa. ¡Disfruta tu artículo!",
    it: "Grazie per il tuo acquisto! Il tuo pacco è stato accuratamente imballato e filmato prima della spedizione con SellCov. Una prova video con timestamp viene conservata in caso di controversia. Buona ricezione!"
  });
  const copyBtnLabel = tx({fr:'Copier', en:'Copy', es:'Copiar', it:'Copia'});
  const copiedBtnLabel = tx({fr:'Copié ✓', en:'Copied ✓', es:'Copiado ✓', it:'Copiato ✓'});
  const publishHeader = tx({fr:'PUBLIER MAINTENANT', en:'PUBLISH NOW', es:'PUBLICAR AHORA', it:'PUBBLICA ORA'});
  const publishDesc = tx({fr:"Ton annonce est copiée. Clique sur une plateforme pour l'ouvrir et coller.", en:'Your listing is copied to clipboard. Click a platform to open it and paste.', es:'Tu anuncio está copiado. Haz clic en una plataforma para abrirla y pegar.', it:'Il tuo annuncio è copiato. Clicca su una piattaforma per aprirla e incollare.'});
  const publishOpeningLabel = tx({fr:'Copié ! Ouverture...', en:'Copied! Opening...', es:'¡Copiado! Abriendo...', it:'Copiato! Apertura...'});
  const postOnLabel = tx({fr:'Poster sur ', en:'Post on ', es:'Publicar en ', it:'Pubblica su '});

  const publishPlatforms = [
    { name: 'Vinted',    url: 'https://www.vinted.fr/items/new' },
    { name: 'Depop',     url: 'https://www.depop.com/sell' },
    { name: 'Grailed',   url: 'https://www.grailed.com/sell' },
    { name: 'Vestiaire', url: 'https://www.vestiairecollective.com/sell' },
    { name: 'Etsy',      url: 'https://www.etsy.com/your/shops/me/tools/listings/create' },
  ];

  function buildShareText() {
    return result.title + '\n\n' + result.description + '\n\n' + (buildMeasuresText() ? buildMeasuresText() + '\n\n' : '') + (result.keywords || []).map((k) => '#' + k).join(' ');
  }

  function shareListing() {
    const text = buildShareText();
    if (navigator.share) {
      navigator.share({ title: result.item_name, text });
    } else {
      navigator.clipboard.writeText(text);
      alert(copiedAlert);
    }
  }

  function publishTo(pl) {
    const fullText = result.title + '\n\n' + result.description + '\n\n' + (result.keywords || []).map((k) => '#' + k).join(' ');
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied((c) => ({ ...c, publish: pl.name }));
      setTimeout(() => setCopied((c) => ({ ...c, publish: false })), 2000);
      window.open(pl.url, '_blank');
    });
  }

  return (
    <>
      <Head>
        <title>SellCov — {a.title}</title>
        <meta name="description" content="Génère une annonce prête à publier pour Vinted, Leboncoin, Depop, Grailed, Vestiaire et Etsy." />
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
        .logo-img{height:72px;width:auto;display:block}
        .nav-back{color:var(--text-muted);font-size:14px;transition:color .2s}
        .nav-back:hover{color:#fff}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 22px;border-radius:999px;font-weight:600;font-size:15px;transition:transform .15s,box-shadow .15s,background .15s,opacity .15s;cursor:pointer;border:none;font-family:inherit;white-space:nowrap}
        .btn-primary{background:#fff;color:#000;width:100%;padding:16px 22px}
        .btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 30px rgba(255,255,255,.15)}
        .btn-primary:disabled{background:rgba(255,255,255,.06);color:rgba(255,255,255,.25);cursor:not-allowed}
        .btn-ghost{background:rgba(255,255,255,.04);color:var(--text-muted);border:1px solid var(--border-strong);padding:8px 16px;font-size:13px;border-radius:999px;cursor:pointer;font-family:inherit}
        .btn-ghost:hover{border-color:#fff;color:#fff}
        .btn-copy{background:rgba(255,255,255,.06);color:var(--text-muted);border:none;padding:5px 12px;font-size:12px;border-radius:999px;cursor:pointer;font-family:inherit;transition:background .15s}
        .btn-copy:hover{background:rgba(255,255,255,.1);color:#fff}
        .btn-share{background:var(--violet-bg);color:var(--violet);border:1px solid rgba(139,127,255,.25);padding:8px 16px;font-size:13px;border-radius:999px;cursor:pointer;font-family:inherit;transition:background .15s}
        .btn-share:hover{background:rgba(139,127,255,.18)}
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
        .input-sm{padding:10px 14px;font-size:14px}
        .dropzone{border:1.5px dashed var(--border-strong);border-radius:14px;cursor:pointer;background:#060606;transition:border-color .15s}
        .dropzone:hover{border-color:var(--text-muted)}
        .dropzone:hover{border-color:var(--green)}
        .dropzone-empty{padding:60px 20px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px}
        .dropzone-cta{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:14px 28px;border-radius:12px;border:1.5px solid var(--violet);background:transparent;color:var(--violet);font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:background .15s}
        .dropzone-cta:hover{background:var(--violet-bg)}
        .dropzone-cta-icon{font-size:20px;line-height:1}
        .dropzone-sub{font-size:13px;color:var(--text-dim);margin-top:14px}
        .dropzone-filled{padding:12px}
        .img-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:100%}
        .img-wrap{position:relative}
        .img-wrap img{width:100%;height:80px;object-fit:cover;border-radius:8px;border:1px solid var(--border)}
        .img-wrap.primary img{border:2px solid var(--violet)}
        .img-badge{position:absolute;top:3px;left:3px;font-size:9px;background:var(--violet);color:#000;padding:1px 6px;border-radius:4px;font-weight:700;letter-spacing:.05em}
        .img-remove{position:absolute;top:-6px;right:-6px;width:22px;height:22px;border-radius:50%;background:var(--pink);color:#000;border:2px solid #000;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;line-height:1}
        .img-remove:hover{transform:scale(1.08)}
        .img-more{font-size:12px;color:var(--text-muted);margin-top:10px;text-align:center}
        .measures-group{background:var(--violet-bg);border:1px solid rgba(139,127,255,.2);border-radius:14px;padding:16px 18px}
        .measures-title{font-size:13px;font-weight:600;color:#fff;display:block;margin-bottom:10px}
        .measures-hint{font-weight:400;color:var(--text-muted)}
        .measures-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .measures-mini-label{font-size:11px;color:var(--text-dim);display:block;margin-bottom:4px}
        .measures-summary{margin-top:12px;padding:8px 12px;background:rgba(139,127,255,.1);border-radius:8px;font-size:12px;color:var(--violet)}
        .error-box{margin-top:14px;padding:12px 16px;background:var(--pink-bg);border:1px solid rgba(245,112,170,.3);border-radius:12px;color:var(--pink);font-size:13px}
        .result-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;gap:16px;flex-wrap:wrap}
        .result-title{font-family:'Playfair Display',serif;font-size:26px;line-height:1.05;letter-spacing:-.02em}
        .result-cat{font-size:13px;color:var(--text-muted);margin-top:4px}
        .result-actions{display:flex;gap:8px;flex-wrap:wrap}
        .ai-card{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px 18px;margin-bottom:16px;display:flex;align-items:flex-start;gap:12px}
        .ai-card-icon{width:28px;height:28px;border-radius:50%;background:var(--green-bg);border:1px solid rgba(94,232,163,.3);display:grid;place-items:center;flex-shrink:0;color:var(--green)}
        .ai-card-title{font-size:13px;font-weight:600;color:#fff;margin-bottom:3px}
        .ai-card-text{font-size:12px;color:var(--text-muted);line-height:1.5}
        .measures-inline{background:var(--violet-bg);border:1px solid rgba(139,127,255,.25);border-radius:12px;padding:10px 14px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:12px}
        .measures-inline p{font-size:13px;color:var(--violet);margin:0}
        .tabs-row{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
        .tab{font-size:13px;padding:8px 16px;border-radius:999px;border:1px solid var(--border-strong);background:rgba(255,255,255,.03);cursor:pointer;font-family:inherit;transition:all .15s}
        .tab:hover{border-color:rgba(255,255,255,.2)}
        .tab.active{border:1.5px solid rgba(255,255,255,.5);background:rgba(255,255,255,.1);color:#fff}
        .plat-card{border-radius:14px;padding:14px 18px;margin-bottom:12px;border:1px solid var(--border)}
        .plat-head{display:flex;justify-content:space-between;align-items:center}
        .plat-chip{font-size:13px;padding:4px 12px;border-radius:999px;background:#060606;display:inline-block}
        .plat-price{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:#fff;text-align:right}
        .plat-score{font-size:11px;color:var(--text-dim);text-align:right;margin-top:2px}
        .plat-reason{font-size:13px;color:var(--text-muted);margin-top:10px;line-height:1.5}
        .card{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:14px 18px;margin-bottom:10px}
        .card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:12px}
        .card-label{font-size:11px;font-weight:700;color:var(--text-dim);letter-spacing:.12em;text-transform:uppercase}
        .card-title-text{font-size:15px;font-weight:700;color:#fff;line-height:1.7}
        .card-desc-text{font-size:13px;color:#fff;line-height:1.7}
        .kw-tag{display:inline-block;font-size:12px;padding:5px 12px;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:999px;margin:0 6px 8px 0;color:var(--text-muted)}
        .tips-card{background:rgba(251,146,60,.06);border:1px solid rgba(251,146,60,.2);border-radius:14px;padding:14px 18px;margin-bottom:10px}
        .tips-label{font-size:11px;font-weight:700;color:#f9a95c;letter-spacing:.12em;text-transform:uppercase;margin-bottom:12px}
        .tip-item{display:flex;gap:10px;margin-bottom:8px}
        .tip-item:last-child{margin-bottom:0}
        .tip-bullet{color:#f9a95c;flex-shrink:0}
        .tip-text{font-size:13px;color:var(--text-muted);line-height:1.55}
        .buyer-card{background:var(--green-bg);border:1px solid rgba(94,232,163,.25);border-radius:14px;padding:14px 18px;margin-bottom:10px}
        .buyer-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:12px}
        .buyer-label{font-size:11px;font-weight:700;color:var(--green);letter-spacing:.12em;text-transform:uppercase}
        .buyer-text{font-size:13px;color:#bfffd8;line-height:1.7}
        .btn-buyer-copy{font-size:12px;color:var(--green);background:transparent;border:1px solid rgba(94,232,163,.3);border-radius:999px;padding:4px 12px;cursor:pointer;font-family:inherit;transition:background .15s}
        .btn-buyer-copy:hover{background:rgba(94,232,163,.1)}
        .publish-card{background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:14px;padding:16px 18px;margin-top:14px}
        .publish-label{font-size:11px;font-weight:700;color:var(--text-dim);letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px}
        .publish-desc{font-size:12px;color:var(--text-muted);margin-bottom:14px;line-height:1.5}
        .publish-btns{display:flex;flex-wrap:wrap;gap:8px}
        .btn-publish{font-size:12px;font-weight:600;padding:9px 16px;border-radius:999px;border:1px solid var(--border-strong);cursor:pointer;font-family:inherit;transition:transform .15s,opacity .15s}
        .btn-publish:hover{transform:translateY(-1px);opacity:.9}

        .reco-card{border:1px solid var(--border-strong) !important;border-radius:20px !important;padding:24px !important;margin-bottom:24px !important;display:flex !important;flex-direction:column !important;gap:16px !important}
        .reco-badge{display:inline-block !important;align-self:flex-start !important;font-size:11px !important;font-weight:700 !important;letter-spacing:.12em !important;color:var(--green) !important;background:rgba(94,232,163,.1) !important;border:1px solid rgba(94,232,163,.3) !important;padding:6px 12px !important;border-radius:999px !important}
        .reco-platform{display:flex !important;justify-content:space-between !important;align-items:flex-start !important;gap:16px !important;flex-wrap:wrap !important}
        .reco-platform-name{font-size:24px !important}
        .reco-meta{display:flex !important;flex-direction:column !important;gap:2px !important;text-align:right !important}
        .reco-price{font-family:'Playfair Display',serif !important;font-size:26px !important;font-weight:700 !important;color:#fff !important;line-height:1 !important}
        .reco-score{font-size:11px !important;color:var(--text-dim) !important}
        .reco-reason{font-size:14px !important;color:var(--text-muted) !important;line-height:1.55 !important;font-style:italic !important;border-left:2px solid var(--border-strong) !important;padding-left:12px !important;margin:4px 0 8px !important}
        .reco-section{background:rgba(255,255,255,.03) !important;border:1px solid var(--border-strong) !important;border-radius:12px !important;padding:14px 16px !important}
        .reco-section-head{display:flex !important;justify-content:space-between !important;align-items:center !important;gap:12px !important;margin-bottom:10px !important}
        .reco-section-label{font-size:11px !important;font-weight:700 !important;color:var(--text-dim) !important;letter-spacing:.12em !important;text-transform:uppercase !important}
        .reco-copy{font-size:12px !important;font-weight:600 !important;padding:5px 12px !important;background:rgba(255,255,255,.08) !important;color:#fff !important;border:1px solid var(--border-strong) !important;border-radius:999px !important;cursor:pointer !important;font-family:inherit !important}
        .reco-copy:hover{background:rgba(255,255,255,.14) !important}
        .reco-section-content{font-size:14px !important;color:#fff !important;line-height:1.6 !important}
        .reco-desc{color:#e5e5e5 !important;font-size:13px !important}
        .reco-buyer{color:#bfffd8 !important;font-size:13px !important;font-style:italic !important}
        .reco-tags{display:flex !important;flex-wrap:wrap !important;gap:6px !important}
        .reco-tag{display:inline-block !important;font-size:12px !important;padding:5px 11px !important;background:rgba(255,255,255,.06) !important;border:1px solid var(--border) !important;border-radius:999px !important;color:var(--text-muted) !important}
        .reco-tips{background:rgba(251,146,60,.06) !important;border:1px solid rgba(251,146,60,.2) !important;border-radius:12px !important;padding:14px 16px !important}
        .reco-tips-label{font-size:13px !important;font-weight:600 !important;color:#f9a95c !important;margin-bottom:10px !important}
        .reco-tip{display:flex !important;gap:10px !important;font-size:13px !important;color:var(--text-muted) !important;line-height:1.5 !important;margin-bottom:6px !important}
        .reco-tip-dot{color:#f9a95c !important;flex-shrink:0 !important}
        .reco-cta{font-size:16px !important;font-weight:700 !important;padding:16px 24px !important;border-radius:14px !important;border:none !important;cursor:pointer !important;font-family:inherit !important;margin-top:6px !important;width:100% !important}
        .alt-section{margin-bottom:20px !important}
        .alt-section-label{font-size:11px !important;font-weight:700 !important;color:var(--text-dim) !important;letter-spacing:.12em !important;text-transform:uppercase !important;margin-bottom:10px !important}
        .alt-cards{display:grid !important;grid-template-columns:1fr 1fr !important;gap:10px !important}
        .alt-card{display:flex !important;flex-direction:column !important;align-items:flex-start !important;gap:6px !important;background:var(--bg-card) !important;border:1px solid var(--border-strong) !important;border-radius:12px !important;padding:14px 16px !important;cursor:pointer !important;font-family:inherit !important;text-align:left !important;position:relative !important}
        .alt-card-name{font-size:15px !important}
        .alt-card-meta{font-size:12px !important;color:var(--text-muted) !important}
        .alt-card-arrow{position:absolute !important;top:14px !important;right:16px !important;color:var(--text-dim) !important;font-size:14px !important}
        @media(max-width:560px){.alt-cards{grid-template-columns:1fr !important}}
        .fallback-section{margin-top:18px !important;padding-top:18px !important;border-top:1px solid var(--border) !important}
        .fallback-label{font-size:11px !important;font-weight:700 !important;color:var(--text-dim) !important;letter-spacing:.12em !important;text-transform:uppercase !important;margin-bottom:10px !important}
        .fallback-btns{display:flex !important;gap:8px !important;flex-wrap:wrap !important}
        .fallback-btn{font-size:13px !important;font-weight:600 !important;padding:8px 16px !important;background:transparent !important;border:1px solid var(--border-strong) !important;border-radius:999px !important;cursor:pointer !important;font-family:inherit !important}
        @media(max-width:560px){
          main{padding:120px 16px 60px}
          .result-head{flex-direction:column;align-items:stretch}
          .img-grid{grid-template-columns:repeat(3,1fr)}
          .measures-grid{grid-template-columns:1fr}
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
          {!result ? (
            <>
              <div className="intro">
                <h1 className="page-title serif">{a.title}</h1>
              </div>

              {/* MULTI-PHOTO UPLOAD */}
              <div className="field">
                <label className="field-label">{a.photo_label}</label>
                <div
                  style={{
                    border: '1.5px dashed #2a2a2a',
                    borderRadius: 14,
                    cursor: 'pointer',
                    background: '#060606',
                    padding: images.length > 0 ? 12 : '40px 24px',
                    textAlign: 'center',
                    minHeight: images.length > 0 ? 'auto' : 160,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => fileRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                >
                  {images.length === 0 ? (
                    <>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 28, color: '#9a9a9a' }}>+</div>
                      <p style={{ fontSize: 15, color: '#fff', fontWeight: 500, marginBottom: 4 }}>{a.photo_hint}</p>
                      <p style={{ fontSize: 13, color: '#9a9a9a' }}>{a.photo_sub}</p>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, width: '100%' }}>
                        {images.map((img, i) => (
                          <div key={i} style={{ position: 'relative' }}>
                            <img src={img.preview} alt="" style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8, border: i === 0 ? '2px solid #8b7fff' : '1px solid #1e1e1e', display: 'block' }} />
                            <button
                              onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                              aria-label="Retirer"
                              style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: '#f570aa', color: '#000', border: '2px solid #000', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 1 }}
                            >×</button>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: 12, color: '#9a9a9a', marginTop: 10 }}>+ {addMorePhotos}</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              <div className="field">
                <label className="field-label">{a.condition_label}</label>
                <select className="select" value={condition} onChange={(e) => setCondition(e.target.value)}>
                  <option value="">{selectCondPh}</option>
                  {a.conditions.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="field">
                <label className="field-label">
                  {a.extra_label} <span className="field-hint">(optionnel)</span>
                </label>
                <textarea
                  className="textarea"
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  rows={2}
                  placeholder={a.extra_ph}
                />
              </div>

              <div className="field">
                <div className="measures-group">
                  <label className="measures-title">
                    {a.measures_label} <span className="measures-hint">({a.measures_hint})</span>
                  </label>
                  <select
                    className="select"
                    value={measureCategory}
                    onChange={(e) => { setMeasureCategory(e.target.value); setMeasures({}); }}
                    style={{ marginBottom: measureCategory ? 12 : 0 }}
                  >
                    <option value="">{a.measures_ph}</option>
                    {Object.keys(MEASURE_FIELDS).map((cat) => <option key={cat}>{cat}</option>)}
                  </select>
                  {measureCategory && (
                    <div className="measures-grid">
                      {MEASURE_FIELDS[measureCategory].map((field) => (
                        <div key={field}>
                          <label className="measures-mini-label">{field}</label>
                          <input
                            type="number"
                            className="input input-sm"
                            value={measures[field] || ''}
                            onChange={(e) => setMeasure(field, e.target.value)}
                            placeholder="—"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {measureCategory && buildMeasuresText() && (
                    <div className="measures-summary">
                      <p style={{ margin: 0 }}>{buildMeasuresText()}</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={analyze}
                disabled={loading || (!images.length && !extra.trim())}
              >
                {loading ? a.generating : a.generate_btn}
              </button>

              {error && <div className="error-box">{error}</div>}
            </>
          ) : (
            <>
              {/* Header : nom article + actions */}
              <div className="result-head">
                <div>
                  <h2 className="result-title serif">{result.item_name}</h2>
                  <p className="result-cat">{result.item_category} · {condition}</p>
                </div>
                <div className="result-actions">
                  <button className="btn-share" onClick={shareListing}>{shareLabel}</button>
                  <button className="btn-ghost" onClick={reset}>{a.back}</button>
                </div>
              </div>

              {buildMeasuresText() && (
                <div className="measures-inline">
                  <p>{buildMeasuresText()}</p>
                  <button className="btn-copy" onClick={() => copy('measures', buildMeasuresText())}>
                    {copied['measures'] ? a.copied : a.copy}
                  </button>
                </div>
              )}

              {activePlatform && (() => {
                const ps = PLATFORM_STYLE[activePlatform.name] || {};
                const isRecommended = activePlatform.name === result.best_platform;
                const matchName = activePlatform.name === 'Vestiaire Collective' ? 'Vestiaire' : activePlatform.name;
                const publishUrl = (publishPlatforms.find((p) => p.name === matchName) || {}).url;
                const otherRecommended = (result.platforms || []).filter((p) => p.name !== activePlatform.name);
                const recommendedNames = (result.platforms || []).map((p) => p.name);
                const otherFallback = publishPlatforms.filter((pl) => {
                  const n = pl.name === 'Vestiaire' ? 'Vestiaire Collective' : pl.name;
                  return !recommendedNames.includes(n);
                });

                return (
                  <>
                    {/* Hero card : plateforme recommandée + tout le contenu */}
                    <div
                      style={{
                        background: '#0e0e0e',
                        border: '1px solid #2a2a2a',
                        borderRadius: 20,
                        padding: 24,
                        marginBottom: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                      }}
                    >
                      {isRecommended && (
                        <div style={{ display:'inline-block', alignSelf:'flex-start', fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'#5ee8a3', background:'rgba(94,232,163,.08)', border:'1px solid rgba(94,232,163,.25)', padding:'6px 12px', borderRadius:999 }}>{tx({fr:'RECOMMANDÉ POUR CE PRODUIT', en:'RECOMMENDED FOR THIS PRODUCT', es:'RECOMENDADO PARA ESTE PRODUCTO', it:'CONSIGLIATO PER QUESTO PRODOTTO'})}</div>
                      )}

                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:16, flexWrap:'wrap' }}>
                        <span
                          style={{
                            fontSize:24,
                            color: ps.color || '#fff',
                            fontWeight: ps.weight || 700,
                            fontFamily: ps.font || 'inherit',
                            letterSpacing: ps.spacing || '0px',
                            textTransform: ps.transform || 'none',
                          }}
                        >{activePlatform.name}</span>
                        <div style={{ display:'flex', flexDirection:'column', gap:2, textAlign:'right' }}>
                          <span style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:'#fff', lineHeight:1 }}>{activePlatform.price_min}–{activePlatform.price_max}€</span>
                          <span style={{ fontSize:11, color:'#5a5a5a' }}>Score {activePlatform.score}/10 · {result.time_to_sell}</span>
                        </div>
                      </div>

                      <p style={{ fontSize:14, color:'#9a9a9a', lineHeight:1.55, fontStyle:'italic', borderLeft:'2px solid #2a2a2a', paddingLeft:12, margin:'4px 0 8px' }}>{activePlatform.reason}</p>

                      {/* Section : Titre */}
                      <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid #2a2a2a', borderRadius:12, padding:'14px 16px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:10 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:'#5a5a5a', letterSpacing:'.12em', textTransform:'uppercase' }}>{a.title_l}</span>
                          <button onClick={() => copy('title', result.title)} style={{ fontSize:12, fontWeight:600, padding:'5px 12px', background:'rgba(255,255,255,.08)', color:'#fff', border:'1px solid #2a2a2a', borderRadius:999, cursor:'pointer', fontFamily:'inherit' }}>
                            {copied['title'] ? '✓ ' + a.copied : '⧉ ' + a.copy}
                          </button>
                        </div>
                        <p style={{ fontSize:15, color:'#fff', lineHeight:1.6, fontWeight:600 }}>{result.title}</p>
                      </div>

                      {/* Section : Description */}
                      <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid #2a2a2a', borderRadius:12, padding:'14px 16px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:10 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:'#5a5a5a', letterSpacing:'.12em', textTransform:'uppercase' }}>{a.desc_l}</span>
                          <button onClick={() => copy('desc', result.description)} style={{ fontSize:12, fontWeight:600, padding:'5px 12px', background:'rgba(255,255,255,.08)', color:'#fff', border:'1px solid #2a2a2a', borderRadius:999, cursor:'pointer', fontFamily:'inherit' }}>
                            {copied['desc'] ? '✓ ' + a.copied : '⧉ ' + a.copy}
                          </button>
                        </div>
                        <p style={{ fontSize:13, color:'#e5e5e5', lineHeight:1.6 }}>{result.description}</p>
                      </div>

                      {/* Section : Hashtags */}
                      <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid #2a2a2a', borderRadius:12, padding:'14px 16px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:10 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:'#5a5a5a', letterSpacing:'.12em', textTransform:'uppercase' }}>{a.kw_l}</span>
                          <button onClick={() => copy('kw', (result.keywords || []).map((k) => '#' + k).join(' '))} style={{ fontSize:12, fontWeight:600, padding:'5px 12px', background:'rgba(255,255,255,.08)', color:'#fff', border:'1px solid #2a2a2a', borderRadius:999, cursor:'pointer', fontFamily:'inherit' }}>
                            {copied['kw'] ? '✓ ' + a.copied : '⧉ ' + a.copy}
                          </button>
                        </div>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                          {(result.keywords || []).map((k) => (
                            <span key={k} style={{ display:'inline-block', fontSize:12, padding:'5px 11px', background:'rgba(255,255,255,.06)', border:'1px solid #1e1e1e', borderRadius:999, color:'#9a9a9a' }}>#{k}</span>
                          ))}
                        </div>
                      </div>

                      {/* Section : Message acheteur */}
                      <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid #2a2a2a', borderRadius:12, padding:'14px 16px' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:10 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:'#5a5a5a', letterSpacing:'.12em', textTransform:'uppercase' }}>{buyerMsgHeader}</span>
                          <button onClick={() => copy('buyermsg', buyerMsg)} style={{ fontSize:12, fontWeight:600, padding:'5px 12px', background:'rgba(255,255,255,.08)', color:'#fff', border:'1px solid #2a2a2a', borderRadius:999, cursor:'pointer', fontFamily:'inherit' }}>
                            {copied['buyermsg'] ? '✓ ' + copiedBtnLabel : '⧉ ' + copyBtnLabel}
                          </button>
                        </div>
                        <p style={{ fontSize:13, color:'#e5e5e5', lineHeight:1.6, fontStyle:'italic' }}>{buyerMsg}</p>
                      </div>

                      {/* Conseils */}
                      {(result.selling_tips || []).length > 0 && (
                        <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid #2a2a2a', borderRadius:12, padding:'14px 16px' }}>
                          <p style={{ fontSize:11, fontWeight:700, color:'#5a5a5a', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>{tx({fr:'Conseils pour ', en:'Tips for ', es:'Consejos para ', it:'Consigli per '}) + activePlatform.name}</p>
                          {(result.selling_tips || []).map((tip, i) => (
                            <div key={i} style={{ display:'flex', gap:10, fontSize:13, color:'#9a9a9a', lineHeight:1.5, marginBottom:6 }}><span style={{ color:'#5a5a5a', flexShrink:0 }}>·</span><span>{tip}</span></div>
                          ))}
                        </div>
                      )}

                      {/* Big CTA principal */}
                      {publishUrl && (
                        <button
                          onClick={() => publishTo({ name: matchName, url: publishUrl })}
                          style={{
                            fontSize:16, fontWeight:700, padding:'16px 24px', borderRadius:14, border:'none', cursor:'pointer', fontFamily:'inherit', marginTop:6, width:'100%',
                            background: ps.color || '#fff',
                            color: '#000',
                          }}
                        >
                          {copied['publish'] === matchName
                            ? publishOpeningLabel
                            : `${postOnLabel}${activePlatform.name}`}
                        </button>
                      )}
                    </div>

                    {/* Voir aussi : autres plateformes recommandées */}
                    {otherRecommended.length > 0 && (
                      <div style={{ marginBottom:20 }}>
                        <p style={{ fontSize:11, fontWeight:700, color:'#5a5a5a', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>{tx({fr:'VOIR AUSSI', en:'SEE ALSO', es:'VER TAMBIÉN', it:'VEDI ANCHE'})}</p>
                        <div style={{ display:'grid', gridTemplateColumns: otherRecommended.length > 1 ? '1fr 1fr' : '1fr', gap:10 }}>
                          {otherRecommended.map((p) => {
                            const aps = PLATFORM_STYLE[p.name] || {};
                            return (
                              <button key={p.name} onClick={() => setActiveTab(p.name)} style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', gap:6, background:'#0e0e0e', border:'1px solid #2a2a2a', borderRadius:12, padding:'14px 16px', cursor:'pointer', fontFamily:'inherit', textAlign:'left', position:'relative' }}>
                                <span
                                  style={{
                                    fontSize:15,
                                    color: aps.color || '#fff',
                                    fontWeight: aps.weight || 700,
                                    fontFamily: aps.font || 'inherit',
                                    letterSpacing: aps.spacing || '0px',
                                    textTransform: aps.transform || 'none',
                                  }}
                                >{p.name}</span>
                                <span style={{ fontSize:12, color:'#9a9a9a' }}>{p.price_min}–{p.price_max}€ · Score {p.score}/10</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Fallback : autres plateformes pas recommandées */}
                    {otherFallback.length > 0 && (
                      <div style={{ marginTop:18, paddingTop:18, borderTop:'1px solid #1e1e1e' }}>
                        <p style={{ fontSize:11, fontWeight:700, color:'#5a5a5a', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>{tx({fr:'PUBLIER SUR UNE AUTRE PLATEFORME', en:'POST ON ANOTHER PLATFORM', es:'PUBLICAR EN OTRA PLATAFORMA', it:'PUBBLICA SU UN\'ALTRA PIATTAFORMA'})}</p>
                        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                          {otherFallback.map((pl) => {
                            const fps = PLATFORM_STYLE[pl.name === 'Vestiaire' ? 'Vestiaire Collective' : pl.name] || {};
                            return (
                              <button
                                key={pl.name}
                                onClick={() => publishTo(pl)}
                                style={{ fontSize:13, fontWeight:600, padding:'8px 16px', background:'transparent', border:'1px solid ' + (fps.color || '#2a2a2a'), color: fps.color || '#fff', borderRadius:999, cursor:'pointer', fontFamily:'inherit' }}
                              >
                                {copied['publish'] === pl.name ? publishOpeningLabel : pl.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </div>
      </main>
    </>
  );
}
