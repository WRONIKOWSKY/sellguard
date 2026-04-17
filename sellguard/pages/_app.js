import Head from 'next/head';
import { useEffect } from 'react';

const PAGE_HTML = `
<header class="header">
  <div class="container nav">
    <a href="/" class="logo">Sell<span>Cov</span></a>
    <nav class="nav-links">
      <a href="/#how">Comment ça marche</a>
      <a href="/#pricing">Tarifs</a>
      <a href="/#faq">FAQ</a>
    </nav>
    <a href="/" class="btn btn-ghost btn-sm">← Retour</a>
  </div>
</header>

<main>
  <section class="hero">
    <div class="container">
      <div class="badge reveal">Bêta ouverte · Pas de carte bancaire</div>
      <h1 class="reveal">Teste SellCov sur <span class="accent-pink">ta prochaine vente</span>.</h1>
      <p class="sub reveal">Les 3 fonctions qui te protègent. En 30 secondes chacune.</p>
      <div class="cta-row reveal">
        <a href="#feature-1" class="btn btn-primary btn-lg">Commencer la démo →</a>
      </div>
    </div>
  </section>

  <section id="feature-1" class="feature reveal">
    <div class="container feature-grid">
      <div>
        <span class="chip" style="background:rgba(139,127,255,.12);color:var(--violet)">01 · Preuve vidéo</span>
        <h2>Film ton article avant l'envoi.<br/>Horodatage cryptographique.</h2>
        <p class="lead">Tu filmes l'article, l'étiquette de colis et l'emballage. La vidéo est signée avec un hash et un timestamp officiel. Valeur probante reconnue par les plateformes et les tribunaux.</p>
        <ul class="feature-list">
          <li>Capture guidée en 30 secondes</li>
          <li>Hash SHA-256 + horodatage certifié</li>
          <li>Stockage chiffré en Europe</li>
          <li>Partage en un clic à la marketplace</li>
        </ul>
        <a href="#feature-2" class="btn btn-primary">Étape suivante →</a>
      </div>
      <div class="mockup mockup-phone">
        <div class="mockup-notch"></div>
        <div class="mockup-screen">
          <div class="rec-dot"></div>
          <div class="rec-label">REC · 00:23</div>
          <div class="mockup-video">
            <div class="video-overlay">
              <div class="ov-line">📦 Nike Air Max 90</div>
              <div class="ov-line small">Taille 42 · État : bon</div>
              <div class="ov-line small">Étiquette colis : 8C72-44A9-E1</div>
              <div class="ov-hash">hash: a3f2…9b71</div>
              <div class="ov-time">17 avr. 2026 · 14:23:07 UTC</div>
            </div>
          </div>
          <div class="mockup-btn">● Arrêter</div>
        </div>
      </div>
    </div>
  </section>

  <section id="feature-2" class="feature reveal feature-alt">
    <div class="container feature-grid feature-grid-reverse">
      <div class="mockup mockup-chat">
        <div class="chat-header">
          <div>
            <strong>Litige Vinted #58213</strong>
            <span class="chat-sub">Ouvert il y a 12 minutes</span>
          </div>
          <span class="chat-status">IA active</span>
        </div>
        <div class="chat-msg chat-them">
          <p>"L'article est arrivé abîmé. Je veux un remboursement."</p>
          <span>Acheteur · 14:02</span>
        </div>
        <div class="chat-msg chat-ai">
          <div class="ai-tag">SellCov AI rédige…</div>
          <p>"Bonjour, je suis désolé de l'expérience. Je vous partage la preuve vidéo horodatée au moment de l'envoi (14:23 UTC le 17/04) qui atteste de l'état initial de l'article. Vidéo : sellcov.com/proof/a3f2-9b71. Je reste à disposition pour trouver une solution."</p>
          <span>Envoyé automatiquement · 14:06</span>
        </div>
        <div class="chat-outcome">
          <span class="dot-ok"></span> Litige classé — 94 % des cas
        </div>
      </div>
      <div>
        <span class="chip" style="background:rgba(94,232,163,.12);color:var(--green)">02 · Défense IA</span>
        <h2>L'IA plaide ta défense.<br/>Tu ne bouges pas.</h2>
        <p class="lead">En cas de litige, l'IA analyse la conversation, identifie la manœuvre d'arnaque, rédige une réponse avec les bons arguments juridiques et joint automatiquement ta preuve vidéo.</p>
        <ul class="feature-list">
          <li>Détection automatique des signaux de scam</li>
          <li>Ton professionnel, argumentation solide</li>
          <li>Références aux CGV de la marketplace</li>
          <li>Tu valides avant envoi (ou envoi auto)</li>
        </ul>
        <a href="#feature-3" class="btn btn-primary">Étape suivante →</a>
      </div>
    </div>
  </section>

  <section id="feature-3" class="feature reveal">
    <div class="container feature-grid">
      <div>
        <span class="chip" style="background:rgba(245,112,170,.12);color:var(--pink)">03 · Annonces IA</span>
        <h2>Photos → annonce qui vend.<br/>En 8 secondes.</h2>
        <p class="lead">Tu prends une photo de ton article, l'IA génère un titre accrocheur, une description optimisée SEO marketplace et suggère le juste prix basé sur les ventes similaires.</p>
        <ul class="feature-list">
          <li>Titre + description dans le ton de la plateforme</li>
          <li>Prix suggéré basé sur 12 000 ventes similaires</li>
          <li>Mots-clés optimisés pour la recherche Vinted/Grailed</li>
          <li>Publication directe en un tap</li>
        </ul>
        <a href="#cta" class="btn btn-primary">Je teste maintenant →</a>
      </div>
      <div class="mockup mockup-listing">
        <div class="listing-photo">
          <div class="photo-label">Photo uploadée</div>
        </div>
        <div class="listing-tag">✨ Annonce générée</div>
        <div class="listing-title">Veste The North Face Nuptse 700 — Noire — Taille M</div>
        <div class="listing-price">85 €<span>suggéré</span></div>
        <div class="listing-desc">"Doudoune authentique The North Face Nuptse, garnissage plume 700. Taille M. Excellent état, portée 2 saisons. Chaude et idéale pour l'hiver. Envoi sous 48h avec preuve vidéo SellCov."</div>
        <div class="listing-tags">
          <span>#thenorthface</span><span>#doudoune</span><span>#hiver</span><span>#700fill</span>
        </div>
      </div>
    </div>
  </section>

  <section id="cta" class="final-cta reveal">
    <div class="container">
      <h2>Commence dès maintenant.</h2>
      <p>3 preuves vidéo gratuites par mois, sans carte bancaire. Upgrade quand tu veux.</p>
      <form class="signup-form" action="#" method="post">
        <input type="email" placeholder="ton@email.com" required />
        <button type="submit" class="btn btn-primary">Accéder à la bêta →</button>
      </form>
      <p class="tiny">En rejoignant la bêta, tu obtiens le tarif early-adopter à vie (4,90 €/mois au lieu de 9,90 €).</p>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="container footer-grid">
    <div>
      <div class="logo">Sell<span>Cov</span></div>
      <p class="tiny">Protéger les vendeurs particuliers. Point.</p>
    </div>
    <div>
      <h4>Produit</h4>
      <a href="/app">L'app</a>
      <a href="/#pricing">Tarifs</a>
      <a href="/#faq">FAQ</a>
    </div>
    <div>
      <h4>Légal</h4>
      <a href="/mentions-legales">Mentions légales</a>
      <a href="/cgv">CGV</a>
      <a href="/confidentialite">Confidentialité</a>
    </div>
    <div>
      <h4>Contact</h4>
      <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>
    </div>
  </div>
  <div class="container footer-bottom"><p class="tiny">© 2026 SellCov. Tous droits réservés.</p></div>
</footer>
`;

export default function App() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('show');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>SellCov — L'app : preuve vidéo + défense IA</title>
        <meta name="description" content="Découvre les 3 fonctions SellCov : preuve vidéo horodatée, défense IA automatique, génération d'annonces marketplace. Démo interactive." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        :root{
          --bg:#0a0a0f; --bg-2:#11111a; --fg:#eef0f6; --muted:#8a8fa3;
          --violet:#8b7fff; --green:#5ee8a3; --pink:#f570aa;
          --border:rgba(255,255,255,.08); --radius:14px;
        }
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:var(--bg);color:var(--fg);font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.55}
        a{color:inherit;text-decoration:none}
        img{max-width:100%;display:block}
        .container{max-width:1180px;margin:0 auto;padding:0 24px}
        h1,h2,h3{font-family:'Playfair Display',Georgia,serif;font-weight:700;letter-spacing:-.02em;line-height:1.1}
        h1{font-size:clamp(40px,5.5vw,68px)}
        h2{font-size:clamp(28px,3.6vw,42px);margin-bottom:18px}
        h3{font-size:20px;margin-bottom:10px}
        p{color:var(--muted)}
        .accent-violet{color:var(--violet)} .accent-green{color:var(--green)} .accent-pink{color:var(--pink)}
        .tiny{font-size:13px;color:var(--muted)}

        /* Header */
        .header{position:sticky;top:0;z-index:50;backdrop-filter:blur(12px);background:rgba(10,10,15,.72);border-bottom:1px solid var(--border)}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:18px 24px}
        .nav-links{display:flex;gap:28px}
        .nav-links a{font-size:14px;color:var(--muted);transition:color .2s}
        .nav-links a:hover{color:var(--fg)}
        .logo{font-family:'Playfair Display',serif;font-size:24px;font-weight:700}
        .logo span{color:var(--violet)}

        /* Buttons */
        .btn{display:inline-block;padding:12px 22px;border-radius:999px;font-weight:600;font-size:15px;transition:transform .15s,opacity .2s;cursor:pointer;border:none;font-family:inherit}
        .btn:hover{transform:translateY(-1px)}
        .btn-primary{background:linear-gradient(135deg,var(--violet),var(--pink));color:#fff}
        .btn-ghost{background:transparent;color:var(--fg);border:1px solid var(--border)}
        .btn-ghost:hover{background:rgba(255,255,255,.04)}
        .btn-sm{padding:9px 18px;font-size:14px}
        .btn-lg{padding:16px 30px;font-size:16px}

        /* Hero */
        .hero{padding:100px 0 60px;text-align:center;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:900px;height:700px;background:radial-gradient(circle,rgba(139,127,255,.15),transparent 60%);pointer-events:none}
        .badge{display:inline-block;padding:8px 16px;border:1px solid var(--border);border-radius:999px;font-size:13px;color:var(--muted);margin-bottom:28px;background:rgba(255,255,255,.02)}
        .hero .sub{max-width:560px;margin:24px auto 34px;font-size:18px;color:var(--muted)}
        .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}

        /* Features */
        section{padding:80px 0;border-top:1px solid var(--border)}
        .feature-alt{background:linear-gradient(180deg,transparent,rgba(139,127,255,.03),transparent)}
        .feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
        .feature-grid-reverse .mockup{order:-1}
        @media(max-width:900px){.feature-grid,.feature-grid-reverse{grid-template-columns:1fr;gap:40px}.feature-grid-reverse .mockup{order:0}.nav-links{display:none}}
        .chip{display:inline-block;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:600;margin-bottom:18px}
        .lead{color:var(--muted);font-size:16px;margin:18px 0 22px;max-width:480px}
        .feature-list{list-style:none;margin-bottom:28px}
        .feature-list li{padding:10px 0 10px 28px;position:relative;color:var(--muted);font-size:15px;border-bottom:1px dashed var(--border)}
        .feature-list li::before{content:'✓';position:absolute;left:0;color:var(--green);font-weight:700}

        /* Mockup - phone */
        .mockup{position:relative;max-width:360px;justify-self:center;width:100%}
        .mockup-phone{background:#000;border-radius:38px;padding:16px 12px 20px;border:8px solid #1a1a22;box-shadow:0 40px 80px -20px rgba(139,127,255,.25);aspect-ratio:9/19}
        .mockup-notch{width:100px;height:22px;background:#000;border-radius:0 0 14px 14px;margin:0 auto 10px}
        .mockup-screen{background:#11111a;border-radius:22px;height:calc(100% - 32px);padding:16px;display:flex;flex-direction:column;position:relative;overflow:hidden}
        .rec-dot{position:absolute;top:16px;left:16px;width:12px;height:12px;background:#ff4558;border-radius:50%;animation:pulse 1.4s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .rec-label{position:absolute;top:14px;left:34px;font-size:12px;font-weight:700;letter-spacing:.06em}
        .mockup-video{flex:1;margin-top:32px;background:linear-gradient(135deg,#1a1a30,#2a1a3a);border-radius:14px;position:relative;overflow:hidden}
        .video-overlay{position:absolute;inset:0;padding:14px;display:flex;flex-direction:column;justify-content:flex-end;gap:4px;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.7))}
        .ov-line{font-size:13px;font-weight:600}
        .ov-line.small{font-size:11px;color:var(--muted);font-weight:500}
        .ov-hash,.ov-time{font-family:monospace;font-size:10px;color:var(--green);margin-top:4px}
        .ov-time{color:var(--muted)}
        .mockup-btn{margin-top:14px;padding:10px;text-align:center;background:#ff4558;border-radius:999px;font-size:13px;font-weight:600;color:#fff}

        /* Mockup - chat */
        .mockup-chat{max-width:440px;background:var(--bg-2);border:1px solid var(--border);border-radius:18px;padding:0;overflow:hidden}
        .chat-header{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border)}
        .chat-header strong{display:block;font-size:14px;margin-bottom:2px}
        .chat-sub{font-size:12px;color:var(--muted)}
        .chat-status{font-size:11px;padding:4px 10px;background:rgba(94,232,163,.12);color:var(--green);border-radius:999px;font-weight:600}
        .chat-msg{padding:14px 20px}
        .chat-msg p{color:var(--fg);font-size:14px;margin-bottom:6px}
        .chat-msg span{font-size:11px;color:var(--muted)}
        .chat-them{background:rgba(255,255,255,.02)}
        .chat-ai{background:rgba(139,127,255,.06);border-left:3px solid var(--violet)}
        .ai-tag{font-size:11px;color:var(--violet);font-weight:600;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em}
        .chat-outcome{padding:14px 20px;background:rgba(94,232,163,.06);border-top:1px solid var(--border);font-size:13px;font-weight:600;color:var(--green);display:flex;align-items:center;gap:10px}
        .dot-ok{width:8px;height:8px;background:var(--green);border-radius:50%}

        /* Mockup - listing */
        .mockup-listing{max-width:420px;background:var(--bg-2);border:1px solid var(--border);border-radius:18px;padding:20px;position:relative}
        .listing-photo{aspect-ratio:4/3;background:linear-gradient(135deg,#2a1a3a,#1a1a30);border-radius:12px;position:relative;margin-bottom:16px}
        .photo-label{position:absolute;bottom:10px;left:10px;font-size:11px;padding:4px 10px;background:rgba(0,0,0,.6);border-radius:999px}
        .listing-tag{display:inline-block;padding:5px 12px;background:rgba(245,112,170,.12);color:var(--pink);font-size:12px;font-weight:600;border-radius:999px;margin-bottom:10px}
        .listing-title{font-size:16px;font-weight:600;margin-bottom:8px}
        .listing-price{font-family:'Playfair Display',serif;font-size:32px;font-weight:700;color:var(--green);margin-bottom:12px}
        .listing-price span{font-size:12px;color:var(--muted);font-family:'Inter',sans-serif;font-weight:400;margin-left:8px}
        .listing-desc{color:var(--muted);font-size:13px;line-height:1.6;margin-bottom:12px}
        .listing-tags{display:flex;gap:6px;flex-wrap:wrap}
        .listing-tags span{font-size:12px;padding:3px 10px;background:rgba(255,255,255,.04);border-radius:999px;color:var(--muted)}

        /* Final CTA */
        .final-cta{text-align:center;padding:100px 0}
        .final-cta h2{margin-bottom:12px;text-align:center}
        .final-cta p{margin-bottom:30px;font-size:17px}
        .signup-form{display:flex;gap:10px;justify-content:center;max-width:460px;margin:0 auto 18px;flex-wrap:wrap}
        .signup-form input{flex:1;min-width:240px;padding:14px 18px;border-radius:999px;border:1px solid var(--border);background:var(--bg-2);color:var(--fg);font-family:inherit;font-size:15px}
        .signup-form input:focus{outline:none;border-color:var(--violet)}

        /* Footer */
        .footer{border-top:1px solid var(--border);padding:48px 0 24px}
        .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;padding-bottom:32px}
        .footer h4{font-family:'Inter',sans-serif;font-size:14px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:14px;font-weight:600}
        .footer a{display:block;color:var(--muted);font-size:14px;margin-bottom:8px}
        .footer a:hover{color:var(--fg)}
        .footer-bottom{padding-top:24px;border-top:1px solid var(--border);text-align:center}
        @media(max-width:800px){.footer-grid{grid-template-columns:1fr 1fr}}

        /* Reveal */
        .reveal{opacity:0;transform:translateY(24px);transition:opacity .7s,transform .7s}
        .reveal.show{opacity:1;transform:none}
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />
    </>
  );
}
