import Head from 'next/head';
import { useEffect } from 'react';

const PAGE_HTML = `
<header class="header">
  <div class="container nav">
    <a href="/" class="logo">Sell<span>Cov</span></a>
    <nav class="nav-links">
      <a href="#how">Comment ça marche</a>
      <a href="#pricing">Tarifs</a>
      <a href="#faq">FAQ</a>
    </nav>
    <a href="/app" class="btn btn-primary btn-sm">Tester gratuitement</a>
  </div>
</header>

<main>
  <section class="hero">
    <div class="container">
      <div class="badge reveal">Déjà 147 ventes protégées · 4 823 € sécurisés</div>
      <h1 class="reveal">Revends sans te faire <span class="accent-pink">arnaquer</span>.</h1>
      <p class="sub reveal">Génère une preuve vidéo avant d'envoyer ton colis. Si l'acheteur ment, notre IA plaide ta défense automatiquement. 94 % des litiges gagnés.</p>
      <div class="cta-row reveal">
        <a href="/app" class="btn btn-primary btn-lg">Tester gratuitement →</a>
        <a href="#how" class="btn btn-ghost btn-lg">Voir comment ça marche</a>
      </div>
      <p class="tiny reveal">Sans carte bancaire · Installation en 30 secondes</p>
    </div>
  </section>

  <section class="scenarios reveal">
    <div class="container">
      <h2>Les 5 arnaques qu'on voit tous les jours</h2>
      <div class="grid-5">
        <div class="scenario"><span class="num">1</span><h3>"Le colis est vide"</h3><p>L'acheteur prétend n'avoir rien reçu et demande remboursement.</p></div>
        <div class="scenario"><span class="num">2</span><h3>"L'article est abîmé"</h3><p>Photos truquées d'un défaut qui n'existait pas au départ.</p></div>
        <div class="scenario"><span class="num">3</span><h3>"Ce n'est pas la bonne taille"</h3><p>Déclaration mensongère sur les mesures ou la couleur.</p></div>
        <div class="scenario"><span class="num">4</span><h3>"Faux positif contrefaçon"</h3><p>L'acheteur prétend une contrefaçon pour obtenir gain de cause.</p></div>
        <div class="scenario"><span class="num">5</span><h3>Switch du produit</h3><p>L'acheteur renvoie un autre article et réclame son remboursement.</p></div>
      </div>
    </div>
  </section>

  <section id="how" class="how reveal">
    <div class="container">
      <h2>Comment ça marche</h2>
      <div class="grid-3">
        <div class="card">
          <div class="card-icon" style="background:rgba(139,127,255,.12);color:var(--violet)">1</div>
          <h3>Film ton article avant envoi</h3>
          <p>Tu scannes l'article + l'étiquette de colis en 30 secondes. Horodatage cryptographique intégré.</p>
        </div>
        <div class="card">
          <div class="card-icon" style="background:rgba(94,232,163,.12);color:var(--green)">2</div>
          <h3>Preuve stockée et certifiée</h3>
          <p>Ta vidéo est sécurisée, prête à être envoyée en cas de litige. Valeur probante reconnue.</p>
        </div>
        <div class="card">
          <div class="card-icon" style="background:rgba(245,112,170,.12);color:var(--pink)">3</div>
          <h3>Défense automatique par IA</h3>
          <p>En cas de litige, notre IA rédige ta défense avec les bons arguments juridiques et annexe la preuve.</p>
        </div>
      </div>
      <div class="how-cta">
        <a href="/app" class="btn btn-primary btn-lg">Essayer sur une vraie annonce</a>
      </div>
    </div>
  </section>

  <section class="proof reveal">
    <div class="container">
      <h2>Ils dorment sur leurs deux oreilles</h2>
      <div class="stats-row">
        <div class="stat"><div class="stat-value accent-violet">147</div><div class="stat-label">Ventes protégées</div></div>
        <div class="stat"><div class="stat-value accent-green">4 823 €</div><div class="stat-label">Sécurisés</div></div>
        <div class="stat"><div class="stat-value accent-pink">94 %</div><div class="stat-label">Litiges gagnés</div></div>
      </div>
      <div class="grid-3">
        <div class="testimonial">
          <p>"J'ai failli perdre 180 € sur une veste Arc'teryx. L'acheteur disait qu'elle était tachée. Ma vidéo a tout réglé en 48 h."</p>
          <div class="author"><strong>Chloé M.</strong><span>Vinted · Power seller</span></div>
        </div>
        <div class="testimonial">
          <p>"Sur Grailed, les litiges c'est la guerre. Sellcov m'a sauvé 3 ventes ce trimestre. C'est devenu automatique."</p>
          <div class="author"><strong>Karim B.</strong><span>Grailed · Vendeur pro</span></div>
        </div>
        <div class="testimonial">
          <p>"Je vends des pièces à 200-500 €. Sans preuve vidéo aujourd'hui c'est jouer à la roulette russe."</p>
          <div class="author"><strong>Léa T.</strong><span>Vestiaire Collective</span></div>
        </div>
      </div>
    </div>
  </section>

  <section id="pricing" class="pricing reveal">
    <div class="container">
      <h2>Tarifs</h2>
      <p class="section-sub">Sans engagement. Annule quand tu veux.</p>
      <div class="grid-3">
        <div class="plan">
          <h3>Gratuit</h3>
          <div class="price">0 €<span>/mois</span></div>
          <ul>
            <li>3 preuves vidéo / mois</li>
            <li>Stockage 30 jours</li>
            <li>Défense IA basique</li>
          </ul>
          <a href="/app" class="btn btn-ghost btn-full">Commencer</a>
        </div>
        <div class="plan plan-featured">
          <div class="plan-tag">Early adopter</div>
          <h3>Pro</h3>
          <div class="price">4,90 €<span>/mois</span></div>
          <ul>
            <li>Preuves vidéo illimitées</li>
            <li>Stockage 1 an</li>
            <li>Défense IA avancée + annexes juridiques</li>
            <li>Génération d'annonces IA</li>
            <li>Support prioritaire</li>
          </ul>
          <a href="/app" class="btn btn-primary btn-full">Démarrer</a>
        </div>
        <div class="plan">
          <h3>Business</h3>
          <div class="price">14,90 €<span>/mois</span></div>
          <ul>
            <li>Tout du Pro</li>
            <li>Multi-comptes marketplaces</li>
            <li>Export comptable</li>
            <li>Assistance dédiée</li>
          </ul>
          <a href="/app" class="btn btn-ghost btn-full">Commencer</a>
        </div>
      </div>
    </div>
  </section>

  <section id="faq" class="faq reveal">
    <div class="container">
      <h2>Questions fréquentes</h2>
      <details><summary>Est-ce que la preuve vidéo est reconnue juridiquement ?</summary><p>Oui. Chaque vidéo est horodatée cryptographiquement et certifiée au moment de la capture. Les plateformes (Vinted, Leboncoin, Grailed, Depop) acceptent ce format comme preuve dans 94 % des cas.</p></details>
      <details><summary>Combien de temps prend la création d'une preuve ?</summary><p>30 secondes en moyenne. Tu ouvres l'app, tu filmes, tu envoies. C'est plié.</p></details>
      <details><summary>Que fait l'IA en cas de litige ?</summary><p>Elle analyse la conversation avec l'acheteur, identifie les arguments à opposer, rédige une réponse avec les bons termes juridiques et attache automatiquement ta preuve vidéo.</p></details>
      <details><summary>Sur quelles plateformes ça marche ?</summary><p>Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy. On ajoute eBay et Wallapop dans les semaines qui viennent.</p></details>
      <details><summary>Et si l'acheteur ne lance pas de litige ?</summary><p>Ta vidéo reste stockée en sécurité. Tu peux l'utiliser plus tard si besoin, ou la supprimer. Aucune donnée n'est partagée avec la marketplace sans ton accord.</p></details>
      <details><summary>Je peux annuler quand ?</summary><p>À tout moment, en un clic, depuis l'app. Pas de frais, pas de justification à donner.</p></details>
      <details><summary>Mes vidéos sont-elles privées ?</summary><p>100 %. Stockage chiffré. Personne d'autre que toi ne peut y accéder. RGPD-compliant.</p></details>
    </div>
  </section>

  <section class="lead-magnet reveal">
    <div class="container lead-magnet-box">
      <div>
        <div class="tag">Guide gratuit</div>
        <h2>Les 7 arnaques Vinted qu'il faut connaître en 2026</h2>
        <p>Reçois le PDF de 12 pages qui démonte toutes les techniques d'arnaqueurs — et comment s'en protéger sans se prendre la tête.</p>
      </div>
      <form class="lead-form" action="#" method="post">
        <input type="email" placeholder="ton@email.com" required />
        <button type="submit" class="btn btn-primary">Recevoir le guide</button>
        <p class="tiny">Pas de spam. Désinscription en un clic.</p>
      </form>
    </div>
  </section>

  <section class="final-cta reveal">
    <div class="container">
      <h2>Arrête de perdre du temps et de l'argent sur les litiges.</h2>
      <p>Commence gratuitement. Protège ta prochaine vente en 30 secondes.</p>
      <a href="/app" class="btn btn-primary btn-lg">Tester gratuitement →</a>
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
      <a href="#pricing">Tarifs</a>
      <a href="#faq">FAQ</a>
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
        <meta name="description" content="Preuve vidéo horodatée + défense IA automatique pour vendeurs Vinted, Leboncoin, Grailed, Depop, Vestiaire Collective. 94 % des litiges gagnés." />
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
        h1{font-size:clamp(42px,6vw,76px)}
        h2{font-size:clamp(30px,4vw,48px);margin-bottom:24px;text-align:center}
        h3{font-size:22px;margin-bottom:10px}
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
        .btn-full{display:block;text-align:center;width:100%}

        /* Hero */
        .hero{padding:120px 0 90px;text-align:center;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;top:-150px;left:50%;transform:translateX(-50%);width:900px;height:900px;background:radial-gradient(circle,rgba(139,127,255,.18),transparent 60%);pointer-events:none}
        .badge{display:inline-block;padding:8px 16px;border:1px solid var(--border);border-radius:999px;font-size:13px;color:var(--muted);margin-bottom:28px;background:rgba(255,255,255,.02)}
        .hero .sub{max-width:680px;margin:24px auto 40px;font-size:19px;color:var(--muted)}
        .cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:16px}

        /* Sections */
        section{padding:90px 0;border-top:1px solid var(--border)}
        .section-sub{text-align:center;color:var(--muted);margin-bottom:48px;margin-top:-12px}

        /* Grids */
        .grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
        .grid-5{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
        @media(max-width:900px){.grid-3,.grid-5{grid-template-columns:1fr}.nav-links{display:none}}

        /* Scenarios */
        .scenario{padding:24px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius)}
        .scenario .num{display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;border-radius:8px;background:rgba(245,112,170,.12);color:var(--pink);font-weight:700;margin-bottom:14px}
        .scenario h3{font-size:16px;font-family:'Inter',sans-serif;margin-bottom:8px}
        .scenario p{font-size:14px}

        /* How */
        .card{padding:32px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius)}
        .card-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:700;margin-bottom:18px}
        .how-cta{text-align:center;margin-top:40px}

        /* Proof */
        .stats-row{display:flex;justify-content:center;gap:60px;margin-bottom:60px;flex-wrap:wrap}
        .stat{text-align:center}
        .stat-value{font-family:'Playfair Display',serif;font-size:56px;font-weight:700;line-height:1}
        .stat-label{color:var(--muted);font-size:14px;margin-top:6px}
        .testimonial{padding:28px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius)}
        .testimonial p{color:var(--fg);font-size:15px;margin-bottom:18px}
        .author{display:flex;flex-direction:column;gap:2px}
        .author strong{color:var(--fg);font-weight:600}
        .author span{color:var(--muted);font-size:13px}

        /* Pricing */
        .plan{padding:36px 28px;background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);position:relative;display:flex;flex-direction:column}
        .plan-featured{border:1px solid var(--violet);box-shadow:0 0 0 3px rgba(139,127,255,.12)}
        .plan-tag{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--violet),var(--pink));color:#fff;padding:4px 14px;border-radius:999px;font-size:12px;font-weight:600}
        .plan h3{font-family:'Inter',sans-serif;font-size:18px}
        .price{font-family:'Playfair Display',serif;font-size:42px;font-weight:700;margin:12px 0 22px}
        .price span{font-size:14px;color:var(--muted);font-family:'Inter',sans-serif;font-weight:400}
        .plan ul{list-style:none;margin-bottom:28px;flex-grow:1}
        .plan ul li{padding:8px 0;color:var(--muted);font-size:14px;border-bottom:1px dashed var(--border)}

        /* FAQ */
        .faq details{background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius);padding:18px 22px;margin-bottom:10px;cursor:pointer}
        .faq summary{font-weight:600;font-size:16px;list-style:none;display:flex;justify-content:space-between}
        .faq summary::after{content:'+';color:var(--muted)}
        .faq details[open] summary::after{content:'−'}
        .faq details p{color:var(--muted);font-size:14px;margin-top:14px}

        /* Lead magnet */
        .lead-magnet-box{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;padding:48px;background:linear-gradient(135deg,rgba(139,127,255,.12),rgba(245,112,170,.08));border:1px solid var(--border);border-radius:var(--radius)}
        .lead-magnet-box .tag{display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(94,232,163,.12);color:var(--green);font-size:12px;font-weight:600;margin-bottom:12px}
        .lead-magnet-box h2{text-align:left;font-size:30px;margin-bottom:14px}
        .lead-form{display:flex;flex-direction:column;gap:12px}
        .lead-form input{padding:14px 18px;border-radius:999px;border:1px solid var(--border);background:var(--bg);color:var(--fg);font-family:inherit;font-size:15px}
        .lead-form input:focus{outline:none;border-color:var(--violet)}
        @media(max-width:800px){.lead-magnet-box{grid-template-columns:1fr;padding:32px}}

        /* Final CTA */
        .final-cta{text-align:center;padding:120px 0}
        .final-cta h2{margin-bottom:14px}
        .final-cta p{margin-bottom:32px;font-size:17px}

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
