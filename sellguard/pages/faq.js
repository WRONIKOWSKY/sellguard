import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

const FAQ_DATA = {
  fr: {
    title: "Questions fréquentes",
    subtitle: "Tout ce qu'il faut savoir sur SellCov.",
    back: "← Retour",
    items: [
      {
        q: "Ma preuve vidéo a-t-elle une valeur juridique ?",
        a: "Oui. Chaque vidéo est horodatée via un hash cryptographique SHA-256. Elle constitue un élément de preuve recevable. La plupart des plateformes acceptent les preuves vidéo dans leur médiation interne."
      },
      {
        q: "Combien de temps ça prend par envoi ?",
        a: "Moins de 2 minutes."
      },
      {
        q: "Mes vidéos sont-elles privées ?",
        a: "Totalement. Tes vidéos sont chiffrées, stockées sur des serveurs européens (RGPD), accessibles uniquement depuis ton compte."
      },
      {
        q: "Que se passe-t-il si la défense automatique échoue ?",
        a: "SellCov te fournit une preuve vidéo horodatée, certifiée SHA-256, recevable en médiation. Cette preuve est solide et reconnue. Elle maximise tes chances, mais ne garantit pas un résultat favorable à 100%. La décision finale appartient à la plateforme ou au tribunal."
      }
    ]
  },
  en: {
    title: "Frequently asked questions",
    subtitle: "Everything you need to know about SellCov.",
    back: "← Back",
    items: [
      {
        q: "Does my video proof have legal value?",
        a: "Yes. Each video is timestamped via a SHA-256 hash. It constitutes admissible evidence. Most platforms accept video proof in their internal mediation."
      },
      {
        q: "How long does it take per shipment?",
        a: "Less than 2 minutes."
      },
      {
        q: "Are my videos private?",
        a: "Completely. Your videos are encrypted, stored on European servers (GDPR), accessible only from your account."
      },
      {
        q: "What if the automatic defence fails?",
        a: "SellCov provides a timestamped, SHA-256 certified video proof, admissible in mediation. This proof is solid and recognised. It maximises your chances, but cannot guarantee a 100% favourable outcome. The final decision belongs to the platform or court."
      }
    ]
  },
  es: {
    title: "Preguntas frecuentes",
    subtitle: "Todo lo que necesitas saber sobre SellCov.",
    back: "← Volver",
    items: [
      {
        q: "¿Tiene valor legal mi prueba en video?",
        a: "Sí. Cada video tiene marca de tiempo mediante hash SHA-256. Constituye prueba admisible en mediación."
      },
      {
        q: "¿Cuánto tiempo tarda por envío?",
        a: "Menos de 2 minutos."
      },
      {
        q: "¿Mis videos son privados?",
        a: "Completamente. Cifrados, almacenados en servidores europeos (RGPD), accesibles solo desde tu cuenta."
      },
      {
        q: "¿Qué pasa si la defensa automática falla?",
        a: "SellCov te proporciona una prueba sólida y certificada. Maximiza tus posibilidades, pero no garantiza un resultado al 100%. La decisión final corresponde a la plataforma o tribunal."
      }
    ]
  },
  it: {
    title: "Domande frequenti",
    subtitle: "Tutto quello che devi sapere su SellCov.",
    back: "← Indietro",
    items: [
      {
        q: "La mia prova video ha valore giuridico?",
        a: "Sì. Ogni video è marcato temporalmente tramite hash crittografico SHA-256. Costituisce un elemento di prova ammissibile. La maggior parte delle piattaforme accetta prove video nella loro mediazione interna."
      },
      {
        q: "Quanto tempo richiede per spedizione?",
        a: "Meno di 2 minuti."
      },
      {
        q: "I miei video sono privati?",
        a: "Totalmente. I tuoi video sono crittografati, archiviati su server europei (GDPR), accessibili solo dal tuo account."
      },
      {
        q: "Cosa succede se la difesa automatica fallisce?",
        a: "SellCov ti fornisce una prova video con timestamp, certificata SHA-256, ammissibile in mediazione. Questa prova è solida e riconosciuta. Massimizza le tue possibilità, ma non garantisce un risultato favorevole al 100%. La decisione finale spetta alla piattaforma o al tribunale."
      }
    ]
  }
};

export default function FAQ() {
  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('sellcov_lang')) || 'fr';
    if (FAQ_DATA[saved]) renderLang(saved);

    function renderLang(lang) {
      const data = FAQ_DATA[lang];
      if (!data) return;
      document.getElementById('faq-title').textContent = data.title;
      document.getElementById('faq-subtitle').textContent = data.subtitle;
      document.getElementById('faq-back').textContent = data.back;
      const list = document.getElementById('faq-list');
      list.innerHTML = data.items.map(item => `
        <details class="faq-item">
          <summary class="faq-q">${item.q}</summary>
          <p class="faq-a">${item.a}</p>
        </details>
      `).join('');
    }

    window.changeFaqLang = function(lang) {
      localStorage.setItem('sellcov_lang', lang);
      renderLang(lang);
    };

    const sel = document.getElementById('faq-lang');
    if (sel) sel.value = saved;
  }, []);

  return (
    <>
      <Head>
        <title>FAQ — SellCov</title>
        <meta name="description" content="Questions fréquentes sur SellCov." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root{--bg:#000;--bg-card:#0e0e0e;--border:#1e1e1e;--text:#fff;--text-muted:#9a9a9a;--text-dim:#5a5a5a;--green:#5ee8a3;--maxw:820px}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,sans-serif;background:#000;color:#fff;line-height:1.55;-webkit-font-smoothing:antialiased}
        a{color:inherit;text-decoration:none}
        .serif{font-family:'Playfair Display',serif;font-weight:700;letter-spacing:-.01em}
        header{position:fixed;top:0;left:0;right:0;z-index:100;backdrop-filter:blur(14px);background:rgba(0,0,0,.55);border-bottom:1px solid rgba(255,255,255,.04)}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;max-width:1200px;margin:0 auto}
        .logo{display:flex;align-items:center;gap:10px;font-family:'Playfair Display',serif;font-weight:700;font-size:20px}
        .logo-mark{width:32px;height:32px;border:1.5px solid #fff;border-radius:50%;display:grid;place-items:center;font-size:11px;font-family:'Inter',sans-serif;font-weight:600}
        .lang-select{background:transparent;border:1px solid #2a2a2a;color:var(--text-muted);padding:7px 12px;border-radius:999px;font-size:13px;cursor:pointer;font-family:inherit}
        .faq-page{max-width:var(--maxw);margin:0 auto;padding:140px 24px 100px}
        .faq-back{display:inline-block;color:var(--text-muted);font-size:14px;margin-bottom:30px;transition:color .2s}
        .faq-back:hover{color:#fff}
        .faq-page h1{font-family:'Playfair Display',serif;font-size:clamp(40px,6vw,64px);line-height:1;letter-spacing:-.02em;margin-bottom:14px}
        .faq-page .subtitle{color:var(--text-muted);font-size:17px;margin-bottom:50px}
        .faq-list{display:flex;flex-direction:column}
        .faq-item{border-bottom:1px solid var(--border);padding:22px 0;cursor:pointer}
        .faq-q{display:flex;justify-content:space-between;align-items:center;gap:24px;font-size:17px;font-weight:500;list-style:none}
        .faq-q::after{content:"+";font-size:24px;color:var(--text-muted);transition:transform .2s;line-height:1}
        .faq-q::-webkit-details-marker{display:none}
        .faq-item[open] .faq-q::after{transform:rotate(45deg)}
        .faq-a{color:var(--text-muted);font-size:15px;margin-top:12px;line-height:1.6}
      `}</style>

      <header>
        <div className="nav">
          <Link href="/"><span className="logo"><span className="logo-mark">sc</span>SellCov</span></Link>
          <select className="lang-select" id="faq-lang" onChange={(e) => typeof window !== 'undefined' && window.changeFaqLang(e.target.value)}>
            <option value="fr">🇫🇷 FR</option>
            <option value="en">🇬🇧 EN</option>
            <option value="es">🇪🇸 ES</option>
            <option value="it">🇮🇹 IT</option>
          </select>
        </div>
      </header>

      <main className="faq-page">
        <Link href="/"><span className="faq-back" id="faq-back">← Retour</span></Link>
        <h1 id="faq-title">Questions fréquentes</h1>
        <p className="subtitle" id="faq-subtitle">Tout ce qu'il faut savoir sur SellCov.</p>
        <div className="faq-list" id="faq-list"></div>
      </main>
    </>
  );
}
