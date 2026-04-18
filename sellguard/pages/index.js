import Head from 'next/head';
import { useEffect } from 'react';

const PAGE_HTML = `
<header>
  <div class="nav">
    <a class="logo" href="/"><span class="logo-mark">sc</span>SellCov</a>
    <nav class="nav-links">
      <a href="#how">Comment</a>
      <a href="#scams">Pourquoi</a>
      <a href="#pricing">Tarifs</a>
      <a href="#faq">FAQ</a>
    </nav>
    <div class="nav-right">
      <a href="/protection" class="btn btn-primary btn-sm">Essayer gratuit</a>
    </div>
  </div>
</header>

<section class="hero">
  <span class="badge"><span class="dot"></span>Bêta ouverte · Accès gratuit</span>
  <h1 class="h1 serif">Revends<span class="italic">sans te faire arnaquer.</span></h1>
  <p class="hero-sub">Une preuve solide avant l'envoi. Un dossier complet en cas de litige.</p>
  <p class="hero-subsub">Preuve horodatée. Défense automatique.</p>
  <div class="hero-stats"><span><strong>Bêta ouverte</strong></span><span><strong>Preuves certifiées</strong></span><span><strong>Données chiffrées en France</strong></span></div>
  <div class="cta-row">
    <a href="/protection" class="btn btn-primary">Protéger ma prochaine vente</a>
  </div>
  <div class="platforms"><strong>Vinted</strong>·<strong>Leboncoin</strong>·<strong>Depop</strong>·<strong>Grailed</strong>·<strong>Vestiaire Collective</strong>·<strong>Etsy</strong></div>
</section>

<section class="demo" id="demo">
  <div class="demo-frame">
    <div class="demo-steps">
      <div class="demo-step">
        <div style="display:flex;align-items:center;gap:10px;"><span class="step-num">1</span><h4>Crée l'annonce</h4></div>
        <div class="ui">
          <span class="ui-label">Photos</span>
          <div class="ui-box" style="text-align:center;color:var(--text-dim);">+ 3 photos</div>
          <span class="ui-label">État</span>
          <div class="ui-box">Très bon état</div>
          <button class="btn btn-violet btn-sm" style="margin-top:4px">Générer l'annonce</button>
        </div>
      </div>
      <div class="demo-step">
        <div style="display:flex;align-items:center;gap:10px;"><span class="step-num">2</span><h4>Certifie l'envoi</h4></div>
        <div class="ui">
          <div class="ui-cam">
            <span class="rec-dot"><span></span>REC</span>
            <span class="ui-cam-inner">🎥 Filme l'article + colis + étiquette</span>
          </div>
          <div class="ui-cert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            <div><div class="ui-cert-label">Certificat SellCov</div><div>SC-ABC123XYZ · horodaté</div></div>
          </div>
        </div>
      </div>
      <div class="demo-step">
        <div style="display:flex;align-items:center;gap:10px;"><span class="step-num">3</span><h4>Défense automatique</h4></div>
        <div class="ui">
          <span class="ui-label">Acheteur</span>
          <div class="ui-box" style="color:#ff9a9a">« L'article est abîmé, je veux un remboursement »</div>
          <span class="ui-label">Réponse générée</span>
          <div class="ui-box" style="color:#bfffd8">« Preuve vidéo horodatée du 14/04 montre l'article en parfait état. Certificat SC-ABC123XYZ joint. »</div>
          <button class="btn btn-pink btn-sm" style="margin-top:4px">Envoyer la défense</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="page" id="how" style="padding-top:40px">
  <div class="section-head reveal">
    <div class="section-kicker">Comment ça marche</div>
    <h2 class="section-title serif">Trois modules,<br><span class="italic">une seule mission.</span></h2>
    <p class="section-sub">De l'annonce à la défense en cas de litige, SellCov t'accompagne sur chaque étape d'une vente.</p>
  </div>
  <div class="features">
    <div class="feature feature-violet reveal">
      <span class="tag">Annonce</span>
      <h3 class="serif">Génère ton annonce<br><span class="italic">en 10 secondes.</span></h3>
      <p>Photographiez l'article, recevez une annonce rédigée et prête à publier.</p>
      <div class="cta-area"><a href="/annonce" class="btn btn-violet btn-sm">Essayer</a><span style="color:var(--text-dim);font-size:13px">~10 sec par annonce</span></div>
    </div>
    <div class="feature feature-green reveal">
      <span class="tag">Protection</span>
      <h3 class="serif">Certifie avant<br><span class="italic">d'expédier.</span></h3>
      <p>Trois minutes de vidéo horodatée couvrant l'article, le colis fermé et l'étiquette d'expédition. Chaque capture reçoit un certificat cryptographique unique et reste archivée pendant douze mois. Une preuve recevable en cas de litige.</p>
      <div class="cta-area"><a href="/protection" class="btn btn-green btn-sm">Protéger</a><span style="color:var(--text-dim);font-size:13px">~3 min par envoi</span></div>
    </div>
    <div class="feature feature-pink reveal">
      <span class="tag">Litige</span>
      <h3 class="serif">Défense automatique.<br><span class="italic">En 1 clic.</span></h3>
      <p>Dossier de défense généré automatiquement, prêt à transmettre au service litiges.</p>
      <div class="cta-area"><a href="/litige" class="btn btn-pink btn-sm">Gérer un litige</a><span style="color:var(--text-dim);font-size:13px">~30 sec de rédaction</span></div>
    </div>
  </div>
</section>

<section class="page" id="scams" style="background:linear-gradient(180deg,transparent,rgba(245,112,170,.02),transparent)">
  <div class="section-head reveal">
    <div class="section-kicker">Les arnaques que tu vas rencontrer</div>
    <h2 class="section-title serif">Les 5 arnaques qui coûtent<br><span class="italic">le plus cher aux vendeurs.</span></h2>
    <p class="section-sub">Chaque année, de nombreux vendeurs particuliers perdent de l'argent à cause de litiges mal gérés. Voici les scénarios les plus fréquents et la façon dont SellCov vous protège.</p>
  </div>
  <div class="scams">
    <div class="scam-card reveal">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase">Arnaque n°1 — Colis "jamais reçu"</span>
      <div class="scam-quote">« Je n'ai jamais reçu le colis. Je demande un remboursement. »</div>
      <div class="scam-solve"><span class="check">✓</span><span><strong style="color:#fff">SellCov affiche</strong> la vidéo horodatée du dépôt en bureau de poste + numéro de suivi + étiquette filmée. Défense envoyée en 30 secondes.</span></div>
    </div>
    <div class="scam-card reveal">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase">Arnaque n°2 — Article "abîmé"</span>
      <div class="scam-quote">« L'article est arrivé taché / troué / cassé. Je veux être remboursé. »</div>
      <div class="scam-solve"><span class="check">✓</span><span><strong style="color:#fff">SellCov prouve</strong> l'état exact avant expédition grâce à la vidéo 360° horodatée. L'IA compare les photos de l'acheteur et détecte les incohérences.</span></div>
    </div>
    <div class="scam-card reveal">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase">Arnaque n°3 — Substitution</span>
      <div class="scam-quote">« Ce n'est pas l'article que j'ai commandé. »</div>
      <div class="scam-solve"><span class="check">✓</span><span><strong style="color:#fff">SellCov atteste</strong> le contenu exact du colis au moment de la fermeture. Marque, taille, couleur, détails — tout est filmé.</span></div>
    </div>
    <div class="scam-card reveal">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase">Arnaque n°4 — Colis "vide"</span>
      <div class="scam-quote">« Le colis est arrivé vide / sans l'article principal. »</div>
      <div class="scam-solve"><span class="check">✓</span><span><strong style="color:#fff">SellCov enregistre</strong> l'article placé dans le colis puis le colis fermé avec scotch sécurisé, en une seule prise vidéo.</span></div>
    </div>
    <div class="scam-card reveal" style="grid-column:1/-1">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase">Arnaque n°5 — "Ce n'est pas authentique"</span>
      <div class="scam-quote">« Le produit est une contrefaçon, je signale à la plateforme. »</div>
      <div class="scam-solve"><span class="check">✓</span><span><strong style="color:#fff">SellCov horodate</strong> les codes produit, étiquettes d'authenticité, factures d'achat. En cas de litige, tu joins le tout à ta défense automatique en un clic.</span></div>
    </div>
  </div>
</section>

<section class="page">
  <div class="section-head reveal">
    <div class="section-kicker">Les garanties techniques</div>
    <h2 class="section-title serif">Ce qui tient<br><span class="italic">en cas de litige.</span></h2>
  </div>
  <div class="proof">
    <div class="proof-stats">
      <div class="stat reveal"><div class="stat-big serif">3 min</div><div class="stat-label">par vente sécurisée</div></div>
      <div class="stat reveal"><div class="stat-big serif" style="color:var(--green)">SHA-256</div><div class="stat-label">norme cryptographique certifiée</div></div>
      <div class="stat reveal"><div class="stat-big serif" style="color:var(--violet)">12 mois</div><div class="stat-label">d'archivage sécurisé en France</div></div>
    </div>
  </div>
</section>

<section class="page" id="pricing" style="background:linear-gradient(180deg,transparent,rgba(94,232,163,.02),transparent)">
  <div class="section-head reveal">
    <div class="section-kicker">Tarifs transparents</div>
    <h2 class="section-title serif">Tu choisis<br><span class="italic">quand tu veux payer.</span></h2>
    <p class="section-sub">Les 100 premiers vendeurs bénéficient du tarif Early Adopter — à vie. Aucun engagement, annulable en 1 clic.</p>
  </div>
  <div class="pricing">
    <div class="plan reveal">
      <h4>Bêta</h4>
      <div class="plan-price">0 € <small>/ mois</small></div>
      <p class="plan-desc">Accès complet pendant la phase de lancement.</p>
      <ul><li>Certificats vidéo illimités</li><li>IA défense automatique</li><li>Génération d'annonces</li><li>Support email</li></ul>
      <a href="/protection" class="btn btn-ghost">Démarrer gratuitement</a>
    </div>
    <div class="plan featured reveal">
      <span class="plan-ribbon">★ Le plus choisi</span>
      <h4>Early Adopter</h4>
      <div class="plan-price">4,90 € <small>/ mois à vie</small></div>
      <p class="plan-desc">Réservé aux 100 premiers. Tarif bloqué à vie.</p>
      <ul><li>Tout du plan Bêta</li><li>Historique 24 mois</li><li>Certificats prioritaires</li><li>Support prioritaire</li><li>Accès beta features</li></ul>
      <a href="/protection" class="btn btn-primary">Réserver ma place</a>
    </div>
    <div class="plan reveal">
      <h4>Pro Power Seller</h4>
      <div class="plan-price">19,90 € <small>/ mois</small></div>
      <p class="plan-desc">Pour les vendeurs qui font +50 ventes/mois.</p>
      <ul><li>Tout du plan Early</li><li>Dashboard analytics</li><li>Templates d'annonces illimités</li><li>Multi-compte (Vinted + LBC + Depop)</li><li>Support dédié WhatsApp</li></ul>
      <a href="/protection" class="btn btn-ghost">Passer au Pro</a>
    </div>
  </div>
</section>

<section class="page" id="faq">
  <div class="section-head reveal">
    <div class="section-kicker">FAQ</div>
    <h2 class="section-title serif">Questions<br><span class="italic">fréquentes.</span></h2>
  </div>
  <div class="faq">
    <details class="faq-item"><summary class="faq-q">Ma preuve vidéo a-t-elle une valeur juridique ?</summary><p class="faq-a">Oui. Chaque vidéo est horodatée via un hash cryptographique SHA-256 généré au moment de l'enregistrement. En cas de litige devant un juge de proximité, elle constitue un élément de preuve recevable. La plupart des plateformes (Vinted, Leboncoin, Depop) acceptent les preuves vidéo dans leur processus de médiation interne.</p></details>
    <details class="faq-item"><summary class="faq-q">Est-ce que ça fonctionne vraiment avec Vinted et Leboncoin ?</summary><p class="faq-a">Oui. SellCov est indépendant de la plateforme — tu génères une preuve vidéo horodatée que tu peux soumettre directement au service client de n'importe quelle marketplace. Vinted, Leboncoin, Depop et Vestiaire Collective acceptent tous les preuves vidéo dans leur processus de résolution de litiges.</p></details>
    <details class="faq-item"><summary class="faq-q">Combien de temps ça prend par envoi ?</summary><p class="faq-a">Entre 2 et 3 minutes. Tu filmes l'article sous tous les angles, le colis fermé, l'étiquette. L'application te guide étape par étape. Le certificat est généré instantanément.</p></details>
    <details class="faq-item"><summary class="faq-q">Mes vidéos sont-elles privées ?</summary><p class="faq-a">Totalement. Tes vidéos sont chiffrées, stockées sur des serveurs européens (RGPD), et accessibles uniquement depuis ton compte. Elles ne sont partagées qu'à ta demande, lors d'un litige.</p></details>
    <details class="faq-item"><summary class="faq-q">Que se passe-t-il après la bêta gratuite ?</summary><p class="faq-a">Les 100 premiers inscrits conservent automatiquement le tarif Early Adopter à 4,90 €/mois à vie. Tu seras prévenu 30 jours avant la fin de la bêta pour choisir ton plan. Aucun engagement, annulable en 1 clic.</p></details>
    <details class="faq-item"><summary class="faq-q">Ça fonctionne avec Leboncoin, Depop et les autres ?</summary><p class="faq-a">Oui. SellCov est indépendant de la plateforme de vente. Tu peux utiliser tes certificats sur Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Marketplace Facebook — n'importe quelle plateforme d'occasion.</p></details>
    <details class="faq-item"><summary class="faq-q">Que se passe-t-il si la défense automatique échoue ?</summary><p class="faq-a">Tu gardes toujours accès à ta preuve vidéo et à ton certificat. Tu peux les utiliser devant un juge de proximité ou pour un signalement à la DGCCRF. Nous te remboursons ton mois si la défense IA ne produit aucun résultat probant.</p></details>
  </div>
</section>

<section class="page" style="padding-top:40px">
  <div class="magnet reveal">
    <div>
      <div class="magnet-kicker">Guide gratuit</div>
      <h3>Les 5 arnaques Vinted qui coûtent le plus cher (et comment les éviter).</h3>
      <p>Cas concrets, réponses types prêtes à copier-coller. Télécharge le PDF en échange de ton email.</p>
      <form class="magnet-form" onsubmit="event.preventDefault();alert('Merci, ton guide arrive par email.');this.reset();">
        <input type="email" required placeholder="Ton email" />
        <button type="submit" class="btn btn-primary">Recevoir le guide</button>
      </form>
      <small style="color:var(--text-dim);font-size:12px;display:block;margin-top:12px">Pas de spam. Désabonnement en 1 clic.</small>
    </div>
    <div class="magnet-visual">
      <div class="magnet-pdf">5</div>
      <small>5 arnaques · guide gratuit</small>
    </div>
  </div>
</section>

<section class="final" id="cta">
  <h2 class="serif">Protège ton argent<br><span class="italic">maintenant.</span></h2>
  <p>Chaque vente non protégée est un risque.</p>
  <a href="/protection" class="btn btn-primary" style="padding:16px 32px;font-size:16px">Essayer gratuitement →</a>
  <div class="platforms" style="margin-top:34px"><strong>Vinted</strong>·<strong>Leboncoin</strong>·<strong>Depop</strong>·<strong>Grailed</strong>·<strong>Vestiaire Collective</strong>·<strong>Etsy</strong></div>
</section>

<footer>
  <div class="foot">
    <div class="logo"><span class="logo-mark">sc</span>SellCov</div>
    <div class="foot-links">
      <a href="#faq">FAQ</a>
      <a href="#">Contact</a>
      <a href="#">Instagram</a>
      <a href="#">TikTok</a>
      <a href="#">Mentions légales</a>
      <a href="#">CGU</a>
      <a href="#">Confidentialité</a>
    </div>
    <div class="foot-copy">© 2026 SellCov</div>
  </div>
</footer>
`;

export default function Home() {
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
        <title>SellCov — Revends sans te faire arnaquer</title>
        <meta name="description" content="Preuve vidéo horodatée + défense IA pour vendre en sécurité sur Vinted, Leboncoin, Depop, Vestiaire Collective, Grailed et Etsy." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root{--bg:#000;--bg-soft:#0a0a0a;--bg-card:#0e0e0e;--bg-panel:#141414;--border:#1e1e1e;--border-strong:#2a2a2a;--text:#fff;--text-muted:#9a9a9a;--text-dim:#5a5a5a;--violet:#8b7fff;--green:#5ee8a3;--pink:#f570aa;--violet-bg:rgba(139,127,255,.09);--green-bg:rgba(94,232,163,.07);--pink-bg:rgba(245,112,170,.07);--radius-sm:10px;--radius:18px;--radius-lg:28px;--maxw:1200px}
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.55;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        a{color:inherit;text-decoration:none}
        img{display:block;max-width:100%}
        .serif{font-family:'Playfair Display',serif;font-weight:700;letter-spacing:-.01em}
        .italic{font-style:italic;color:var(--text-muted);font-weight:500}
        header{position:fixed;top:0;left:0;right:0;z-index:100;backdrop-filter:blur(14px);background:rgba(0,0,0,.55);border-bottom:1px solid rgba(255,255,255,.04)}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;max-width:var(--maxw);margin:0 auto}
        .logo{display:flex;align-items:center;gap:10px;font-family:'Playfair Display',serif;font-weight:700;font-size:20px}
        .logo-mark{width:32px;height:32px;border:1.5px solid #fff;border-radius:50%;display:grid;place-items:center;font-size:11px;letter-spacing:.5px;font-family:'Inter',sans-serif;font-weight:600}
        .nav-links{display:flex;gap:32px}
        .nav-links a{color:var(--text-muted);font-size:15px;transition:color .2s}
        .nav-links a:hover{color:#fff}
        .nav-right{display:flex;align-items:center;gap:12px}
        .lang{border:1px solid var(--border-strong);background:transparent;color:var(--text-muted);padding:8px 14px;border-radius:999px;font-size:13px;cursor:pointer}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 22px;border-radius:999px;font-weight:600;font-size:15px;transition:transform .15s,box-shadow .15s,background .15s;cursor:pointer;border:none;font-family:inherit;white-space:nowrap}
        .btn-primary{background:#fff;color:#000}
        .btn-primary:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(255,255,255,.15)}
        .btn-ghost{background:transparent;color:#fff;border:1px solid var(--border-strong)}
        .btn-ghost:hover{border-color:#fff}
        .btn-violet{background:var(--violet);color:#000}
        .btn-green{background:var(--green);color:#000}
        .btn-pink{background:var(--pink);color:#000}
        .btn-sm{padding:9px 16px;font-size:13px}
        @media (max-width:820px){.nav-links{display:none}}
        .hero{position:relative;padding:140px 24px 60px;text-align:center;overflow:hidden}
        .hero::before{content:"";position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:900px;height:900px;background:radial-gradient(circle,rgba(94,232,163,.08) 0%,rgba(0,0,0,0) 60%);pointer-events:none;z-index:0}
        .hero > *{position:relative;z-index:1}
        .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(94,232,163,.08);border:1px solid rgba(94,232,163,.25);padding:7px 14px;border-radius:999px;font-size:13px;color:var(--green);margin-bottom:40px}
        .badge .dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
        .h1{font-size:clamp(48px,8vw,104px);line-height:.95;letter-spacing:-.03em;margin-bottom:18px}
        .h1 .italic{display:block;font-size:.92em}
        .hero-sub{font-size:clamp(17px,2vw,20px);color:#fff;max-width:640px;margin:0 auto 10px;line-height:1.45}
        .hero-subsub{color:var(--text-muted);max-width:600px;margin:0 auto 28px;font-size:15px}
        .hero-stats{display:inline-flex;gap:24px;padding:10px 20px;border:1px solid var(--border);border-radius:999px;margin-bottom:34px;font-size:13px;color:var(--text-muted);flex-wrap:wrap;justify-content:center}
        .hero-stats strong{color:#fff;font-weight:600}
        .cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:46px}
        .platforms{color:var(--text-dim);font-size:14px;letter-spacing:.02em}
        .platforms strong{color:var(--text-muted);font-weight:500;margin:0 4px}
        .demo{padding:40px 24px 80px;max-width:1100px;margin:0 auto}
        .demo-frame{position:relative;border-radius:var(--radius-lg);background:linear-gradient(180deg,#0f0f0f 0%,#050505 100%);border:1px solid var(--border);padding:44px 28px;overflow:hidden}
        .demo-frame::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 0%,rgba(94,232,163,.06),transparent 50%);pointer-events:none}
        .demo-steps{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
        @media(max-width:820px){.demo-steps{grid-template-columns:1fr}}
        .demo-step{background:#0a0a0a;border:1px solid var(--border);border-radius:var(--radius);padding:22px;display:flex;flex-direction:column;gap:12px;min-height:280px}
        .demo-step .step-num{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.06);display:grid;place-items:center;font-size:12px;color:var(--text-muted);font-weight:600}
        .demo-step h4{font-size:15px;font-weight:600}
        .demo-step .ui{flex:1;border:1px dashed var(--border-strong);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px;background:#060606}
        .ui-label{font-size:11px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em}
        .ui-box{background:#111;border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:13px;color:var(--text-muted)}
        .ui-cam{aspect-ratio:16/10;background:#050505;border:1px solid var(--border);border-radius:10px;display:grid;place-items:center;position:relative}
        .rec-dot{position:absolute;top:10px;left:10px;display:flex;gap:6px;align-items:center;font-size:10px;color:#ff6565;font-weight:600;letter-spacing:.1em}
        .rec-dot span{width:8px;height:8px;border-radius:50%;background:#ff4444;animation:blink 1.2s infinite}
        @keyframes blink{50%{opacity:.3}}
        .ui-cam-inner{color:var(--text-dim);font-size:11px}
        .ui-cert{background:linear-gradient(135deg,rgba(94,232,163,.15),rgba(94,232,163,.03));border:1px solid rgba(94,232,163,.25);border-radius:10px;padding:12px;font-family:'Inter',sans-serif;font-size:12px;color:var(--green);display:flex;align-items:center;gap:10px}
        .ui-cert svg{flex-shrink:0}
        .ui-cert-label{color:var(--text-dim);font-size:10px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:2px}
        section.page{padding:100px 24px}
        .section-head{text-align:center;max-width:720px;margin:0 auto 60px}
        .section-kicker{color:var(--text-dim);font-size:12px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:14px}
        .section-title{font-size:clamp(36px,5vw,60px);line-height:1;letter-spacing:-.02em;margin-bottom:18px}
        .section-sub{color:var(--text-muted);font-size:17px}
        .features{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:var(--maxw);margin:0 auto}
        .features .feature:last-child{grid-column:1/-1}
        @media(max-width:820px){.features{grid-template-columns:1fr}.features .feature:last-child{grid-column:auto}}
        .feature{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:34px;min-height:320px;display:flex;flex-direction:column;gap:16px;position:relative;overflow:hidden}
        .feature .tag{font-size:11px;letter-spacing:.15em;text-transform:uppercase;font-weight:600}
        .feature h3{font-size:clamp(28px,3vw,38px);line-height:1.05;letter-spacing:-.02em}
        .feature p{color:var(--text-muted);font-size:15px;flex:1}
        .feature-violet{background:linear-gradient(180deg,var(--violet-bg),transparent 70%),var(--bg-card)}
        .feature-violet .tag{color:var(--violet)}
        .feature-green{background:linear-gradient(180deg,var(--green-bg),transparent 70%),var(--bg-card)}
        .feature-green .tag{color:var(--green)}
        .feature-pink{background:linear-gradient(180deg,var(--pink-bg),transparent 70%),var(--bg-card)}
        .feature-pink .tag{color:var(--pink)}
        .feature .cta-area{display:flex;align-items:center;gap:14px;margin-top:4px}
        .scams{max-width:var(--maxw);margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
        @media(max-width:820px){.scams{grid-template-columns:1fr}}
        .scam-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:26px;display:flex;flex-direction:column;gap:14px;transition:border-color .2s,transform .2s}
        .scam-card:hover{border-color:var(--border-strong);transform:translateY(-2px)}
        .scam-quote{background:#060606;border-left:3px solid var(--pink);padding:14px 16px;border-radius:6px;font-style:italic;color:#e5e5e5;font-size:15px}
        .scam-solve{display:flex;gap:12px;align-items:flex-start;font-size:14px}
        .scam-solve .check{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:var(--green-bg);border:1px solid rgba(94,232,163,.35);display:grid;place-items:center;color:var(--green)}
        .scam-solve span{color:var(--text-muted)}
        .proof{max-width:var(--maxw);margin:0 auto}
        .proof-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:40px}
        @media(max-width:820px){.proof-stats{grid-template-columns:1fr}}
        .stat{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:30px;text-align:center}
        .stat-big{font-family:'Playfair Display',serif;font-size:56px;line-height:1;margin-bottom:8px}
        .stat-label{color:var(--text-muted);font-size:13px;letter-spacing:.05em}
        .pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:var(--maxw);margin:0 auto}
        @media(max-width:820px){.pricing{grid-template-columns:1fr}}
        .plan{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:32px;display:flex;flex-direction:column;gap:18px;position:relative}
        .plan.featured{border-color:var(--green);background:linear-gradient(180deg,var(--green-bg),transparent 80%),var(--bg-card)}
        .plan-ribbon{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--green);color:#000;padding:4px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.05em}
        .plan h4{font-size:18px;font-weight:600}
        .plan .plan-price{font-family:'Playfair Display',serif;font-size:46px;line-height:1}
        .plan .plan-price small{font-family:'Inter',sans-serif;font-size:14px;color:var(--text-muted);font-weight:400}
        .plan-desc{color:var(--text-muted);font-size:14px;min-height:42px}
        .plan ul{list-style:none;display:flex;flex-direction:column;gap:10px;font-size:14px;color:#ddd;flex:1}
        .plan li{display:flex;gap:10px;align-items:flex-start}
        .plan li::before{content:"✓";color:var(--green);font-weight:700;flex-shrink:0}
        .faq{max-width:820px;margin:0 auto}
        .faq-item{border-bottom:1px solid var(--border);padding:22px 0;cursor:pointer}
        .faq-q{display:flex;justify-content:space-between;align-items:center;gap:24px;font-size:17px;font-weight:500}
        .faq-q::after{content:"+";font-size:24px;color:var(--text-muted);transition:transform .2s;line-height:1}
        .faq-item[open] .faq-q::after{transform:rotate(45deg)}
        .faq-a{color:var(--text-muted);font-size:15px;margin-top:12px;line-height:1.6}
        .magnet{max-width:920px;margin:0 auto;background:linear-gradient(180deg,rgba(139,127,255,.08),rgba(0,0,0,0) 80%),var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:48px;display:grid;grid-template-columns:1.2fr 1fr;gap:34px;align-items:center}
        @media(max-width:820px){.magnet{grid-template-columns:1fr;padding:32px}}
        .magnet-kicker{color:var(--violet);font-size:12px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:12px}
        .magnet h3{font-size:32px;line-height:1.05;letter-spacing:-.02em;font-family:'Playfair Display',serif;margin-bottom:12px}
        .magnet p{color:var(--text-muted);margin-bottom:22px}
        .magnet-form{display:flex;gap:10px;flex-wrap:wrap}
        .magnet-form input{flex:1;min-width:200px;background:#060606;border:1px solid var(--border-strong);color:#fff;padding:14px 18px;border-radius:999px;font-family:inherit;font-size:15px}
        .magnet-form input::placeholder{color:var(--text-dim)}
        .magnet-form input:focus{outline:none;border-color:var(--violet)}
        .magnet-visual{background:#060606;border:1px solid var(--border);border-radius:18px;padding:22px;text-align:center}
        .magnet-pdf{width:90px;height:120px;margin:0 auto 14px;background:linear-gradient(135deg,#222,#0a0a0a);border:1px solid var(--border-strong);border-radius:8px;display:grid;place-items:center;color:var(--violet);font-family:'Playfair Display',serif;font-size:24px;position:relative}
        .magnet-pdf::after{content:"PDF";position:absolute;bottom:8px;font-size:9px;color:var(--text-dim);font-family:'Inter',sans-serif;letter-spacing:.1em}
        .magnet-visual small{color:var(--text-dim);font-size:12px}
        .final{text-align:center;padding:120px 24px 100px;position:relative;overflow:hidden}
        .final::before{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:1000px;height:600px;background:radial-gradient(ellipse,rgba(94,232,163,.07) 0%,rgba(0,0,0,0) 60%);pointer-events:none}
        .final > *{position:relative}
        .final h2{font-size:clamp(46px,7vw,90px);line-height:.95;letter-spacing:-.03em;margin-bottom:18px}
        .final p{color:var(--text-muted);margin-bottom:30px}
        footer{border-top:1px solid var(--border);padding:40px 24px 28px}
        .foot{max-width:var(--maxw);margin:0 auto;display:grid;grid-template-columns:1fr 2fr 1fr;gap:30px;align-items:start}
        @media(max-width:820px){.foot{grid-template-columns:1fr;gap:22px}}
        .foot-links{display:flex;gap:26px;flex-wrap:wrap;font-size:14px;color:var(--text-muted);justify-content:center}
        .foot-links a:hover{color:#fff}
        .foot-copy{color:var(--text-dim);font-size:13px;text-align:right}
        @media(max-width:820px){.foot-copy{text-align:center}.foot-links{justify-content:flex-start}}
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
        .reveal.show{opacity:1;transform:none}
      `}</style>

      <div dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />
    </>
  );
}
