import Head from 'next/head';
import { useEffect } from 'react';

const PAGE_HTML = `
<header>
  <div class="nav">
    <a class="logo" href="/"><span class="logo-mark">sc</span>SellCov</a>
    <nav class="nav-links">
      <a href="#how" data-i18n="nav_how">Comment</a>
      <a href="#scams" data-i18n="nav_why">Pourquoi</a>
      <a href="#pricing" data-i18n="nav_pricing">Tarifs</a>
      <a href="#faq" data-i18n="nav_faq">FAQ</a>
    </nav>
    <div class="nav-right">
      <select class="lang-select" id="lang-select" onchange="setLang(this.value)">
        <option value="fr">🇫🇷 FR</option>
        <option value="en">🇬🇧 EN</option>
        <option value="es">🇪🇸 ES</option>
        <option value="de">🇩🇪 DE</option>
      </select>
      <a href="/protection" class="btn btn-primary btn-sm" data-i18n="nav_cta">Essayer gratuit</a>
    </div>
  </div>
</header>

<section class="hero">
  <span class="badge"><span class="dot"></span><span data-i18n="badge">Bêta ouverte · Accès gratuit</span></span>
  <h1 class="h1 serif"><span data-i18n="hero_h1_1">Revends</span><span class="italic" data-i18n="hero_h1_2">sans te faire arnaquer.</span></h1>
  <p class="hero-sub" data-i18n="hero_sub" style="white-space:nowrap">Une preuve solide avant l'envoi. Un dossier complet en cas de litige.</p>
  <p class="hero-subsub" data-i18n="hero_subsub">Preuve horodatée. Défense automatique.</p>
  <div class="hero-stats">
    <span><strong data-i18n="stat1">Bêta ouverte</strong></span>
    <span><strong data-i18n="stat2">Preuves certifiées</strong></span>
    <span><strong data-i18n="stat3">Données chiffrées en France</strong></span>
  </div>
  <div class="cta-row">
    <a href="/protection" class="btn btn-primary" data-i18n="hero_cta">Protéger ma prochaine vente</a>
  </div>
  <div class="platforms"><strong>Vinted</strong>·<strong>Leboncoin</strong>·<strong>Depop</strong>·<strong>Grailed</strong>·<strong>Vestiaire Collective</strong>·<strong>Etsy</strong></div>
</section>

<section class="demo" id="demo">
  <div class="demo-frame">
    <div class="demo-steps">
      <div class="demo-step">
        <div style="display:flex;align-items:center;gap:10px;"><span class="step-num">1</span><h4 data-i18n="demo1_title">Crée l'annonce</h4></div>
        <div class="ui">
          <span class="ui-label" data-i18n="demo_photos">Photos</span>
          <div class="ui-box" style="text-align:center;color:var(--text-dim);">+ 3 photos</div>
          <span class="ui-label" data-i18n="demo_state">État</span>
          <div class="ui-box" data-i18n="demo_state_val">Très bon état</div>
          <button class="btn btn-violet btn-sm" style="margin-top:4px" data-i18n="demo1_btn">Générer l'annonce</button>
        </div>
      </div>
      <div class="demo-step">
        <div style="display:flex;align-items:center;gap:10px;"><span class="step-num">2</span><h4 data-i18n="demo2_title">Certifie l'envoi</h4></div>
        <div class="ui">
          <div class="ui-cam">
            <span class="rec-dot"><span></span>REC</span>
            <span class="ui-cam-inner">🎥 <span data-i18n="demo2_cam">Filme l'article + colis + étiquette</span></span>
          </div>
          <div class="ui-cert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            <div><div class="ui-cert-label" data-i18n="cert_label">Certificat SellCov</div><div>SC-ABC123XYZ · horodaté</div></div>
          </div>
        </div>
      </div>
      <div class="demo-step">
        <div style="display:flex;align-items:center;gap:10px;"><span class="step-num">3</span><h4 data-i18n="demo3_title">Défense automatique</h4></div>
        <div class="ui">
          <span class="ui-label" data-i18n="demo3_buyer">Acheteur</span>
          <div class="ui-box" style="color:#ff9a9a" data-i18n="demo3_complaint">« L'article est abîmé, je veux un remboursement »</div>
          <span class="ui-label" data-i18n="demo3_response_label">Réponse générée</span>
          <div class="ui-box" style="color:#bfffd8" data-i18n="demo3_response">« Preuve vidéo horodatée du 14/04 montre l'article en parfait état. Certificat SC-ABC123XYZ joint. »</div>
          <button class="btn btn-pink btn-sm" style="margin-top:4px" data-i18n="demo3_btn">Envoyer la défense</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="page" id="how" style="padding-top:40px">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="how_kicker">Comment ça marche</div>
    <h2 class="section-title serif"><span data-i18n="how_title1">Trois modules,</span><br><span class="italic" data-i18n="how_title2">une seule mission.</span></h2>
    <p class="section-sub" data-i18n="how_sub" style="white-space:nowrap">De l'annonce à la défense en cas de litige, SellCov t'accompagne sur chaque étape d'une vente.</p>
  </div>
  <div class="features">
    <div class="feature feature-violet reveal">
      <span class="tag" data-i18n="feat1_tag">Annonce</span>
      <h3 class="serif"><span data-i18n="feat1_h1">Génère ton annonce</span><br><span class="italic" data-i18n="feat1_h2">en 10 secondes.</span></h3>
      <p data-i18n="feat1_p">Photographiez l'article, recevez une annonce rédigée et prête à publier.</p>
      <div class="cta-area"><a href="/annonce" class="btn btn-violet btn-sm" data-i18n="feat1_btn">Essayer</a><span style="color:var(--text-dim);font-size:13px" data-i18n="feat1_time">~10 sec par annonce</span></div>
    </div>
    <div class="feature feature-green reveal">
      <span class="tag" data-i18n="feat2_tag">Protection</span>
      <h3 class="serif"><span data-i18n="feat2_h1">Certifie avant</span><br><span class="italic" data-i18n="feat2_h2">d'expédier.</span></h3>
      <p data-i18n="feat2_p">Trois minutes de vidéo horodatée couvrant l'article, le colis fermé et l'étiquette d'expédition. Chaque capture reçoit un certificat cryptographique unique, archivé pendant 3 mois. Une preuve recevable en cas de litige.</p>
      <div class="cta-area"><a href="/protection" class="btn btn-green btn-sm" data-i18n="feat2_btn">Protéger</a><span style="color:var(--text-dim);font-size:13px" data-i18n="feat2_time">~3 min par envoi</span></div>
    </div>
    <div class="feature feature-pink reveal">
      <span class="tag" data-i18n="feat3_tag">Litige</span>
      <h3 class="serif"><span data-i18n="feat3_h1">Défense automatique.</span><br><span class="italic" data-i18n="feat3_h2">En 1 clic.</span></h3>
      <p data-i18n="feat3_p">Dossier de défense généré automatiquement, prêt à transmettre au service litiges.</p>
      <div class="cta-area"><a href="/litige" class="btn btn-pink btn-sm" data-i18n="feat3_btn">Gérer un litige</a><span style="color:var(--text-dim);font-size:13px" data-i18n="feat3_time">~30 sec de rédaction</span></div>
    </div>
  </div>
</section>

<section class="page" id="scams" style="background:linear-gradient(180deg,transparent,rgba(245,112,170,.02),transparent)">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="scam_kicker">Les arnaques que tu vas rencontrer</div>
    <h2 class="section-title serif"><span data-i18n="scam_title1">Les 5 arnaques qui coûtent</span><br><span class="italic" data-i18n="scam_title2">le plus cher aux vendeurs.</span></h2>
    <p class="section-sub" data-i18n="scam_sub">Chaque année, de nombreux vendeurs particuliers perdent de l'argent à cause de litiges mal gérés. Voici les scénarios les plus fréquents et la façon dont SellCov vous protège.</p>
  </div>
  <div class="scams">
    <div class="scam-card reveal">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase" data-i18n="scam1_title">Arnaque n°1 · Colis "jamais reçu"</span>
      <div class="scam-quote" data-i18n="scam1_quote">« Je n'ai jamais reçu le colis. Je demande un remboursement. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="scam1_solve"><strong style="color:#fff">SellCov affiche</strong> la vidéo horodatée du dépôt en bureau de poste, le numéro de suivi et l'étiquette filmée. Défense envoyée en 30 secondes.</span></div>
    </div>
    <div class="scam-card reveal">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase" data-i18n="scam2_title">Arnaque n°2 · Article "abîmé"</span>
      <div class="scam-quote" data-i18n="scam2_quote">« L'article est arrivé troué. Je veux être remboursé. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="scam2_solve"><strong style="color:#fff">SellCov prouve</strong> l'état exact avant expédition grâce à la vidéo 360° horodatée. L'IA compare les photos de l'acheteur et détecte les incohérences.</span></div>
    </div>
    <div class="scam-card reveal">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase" data-i18n="scam3_title">Arnaque n°3 · Substitution</span>
      <div class="scam-quote" data-i18n="scam3_quote">« Ce n'est pas l'article que j'ai commandé. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="scam3_solve"><strong style="color:#fff">SellCov atteste</strong> le contenu exact du colis au moment de la fermeture. Marque, taille, couleur, détails, tout est filmé.</span></div>
    </div>
    <div class="scam-card reveal">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase" data-i18n="scam4_title">Arnaque n°4 · Colis "vide"</span>
      <div class="scam-quote" data-i18n="scam4_quote">« Le colis est arrivé vide sans l'article principal. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="scam4_solve"><strong style="color:#fff">SellCov enregistre</strong> l'article placé dans le colis puis le colis fermé avec scotch sécurisé, en une seule prise vidéo.</span></div>
    </div>
    <div class="scam-card reveal" style="grid-column:1/-1">
      <span style="color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase" data-i18n="scam5_title">Arnaque n°5 · "Ce n'est pas authentique"</span>
      <div class="scam-quote" data-i18n="scam5_quote">« Le produit est une contrefaçon, je signale à la plateforme. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="scam5_solve"><strong style="color:#fff">SellCov horodate</strong> les codes produit, étiquettes d'authenticité, factures d'achat. En cas de litige, tu joins le tout à ta défense automatique en un clic.</span></div>
    </div>
  </div>
</section>

<section class="page">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="proof_kicker">Les garanties techniques</div>
    <h2 class="section-title serif"><span data-i18n="proof_title1">Ce qui tient</span><br><span class="italic" data-i18n="proof_title2">en cas de litige.</span></h2>
  </div>
  <div class="proof">
    <div class="proof-stats">
      <div class="stat reveal"><div class="stat-big serif">3 min</div><div class="stat-label" data-i18n="proof_stat1">par vente sécurisée</div></div>
      <div class="stat reveal"><div class="stat-big serif" style="color:var(--green)">SHA-256</div><div class="stat-label" data-i18n="proof_stat2">norme cryptographique certifiée</div></div>
      <div class="stat reveal"><div class="stat-big serif" style="color:var(--violet)">3 mois</div><div class="stat-label" data-i18n="proof_stat3">d'archivage sécurisé en France</div></div>
    </div>
  </div>
</section>

<section class="page" id="pricing" style="background:linear-gradient(180deg,transparent,rgba(94,232,163,.02),transparent)">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="pricing_kicker">Nos offres</div>
    <h2 class="section-title serif"><span data-i18n="pricing_title1">Simple,</span><br><span class="italic" data-i18n="pricing_title2">sans surprise.</span></h2>
    <p class="section-sub" data-i18n="pricing_sub">Les 50 premiers vendeurs bénéficient du tarif Early Adopter. Tarif bloqué 1 an. Aucun engagement, annulable en 1 clic.</p>
  </div>
  <div class="pricing">
    <div class="plan reveal">
      <h4 data-i18n="plan1_name">Bêta</h4>
      <div class="plan-price">0 € <small data-i18n="per_month">/ mois</small></div>
      <p class="plan-desc" data-i18n="plan1_desc">Accès complet pendant la phase de lancement.</p>
      <ul>
        <li data-i18n="plan1_f1">Certificats vidéo illimités</li>
        <li data-i18n="plan1_f2">IA défense automatique</li>
        <li data-i18n="plan1_f3">Génération d'annonces</li>
        <li data-i18n="plan1_f4">Support email</li>
      </ul>
      <a href="/compte" class="btn btn-ghost" data-i18n="plan1_btn">Démarrer gratuitement</a>
    </div>
    <div class="plan featured reveal">
      <span class="plan-ribbon" data-i18n="plan2_ribbon">★ Recommandé</span>
      <h4 data-i18n="plan2_name">Early Adopter</h4>
      <div class="plan-price">4,90 € <small data-i18n="per_month">/ mois</small></div>
      <p class="plan-desc" data-i18n="plan2_desc">Réservé aux 50 premiers. Tarif garanti 1 an.</p>
      <ul>
        <li data-i18n="plan2_f1">Tout du plan Bêta</li>
        <li data-i18n="plan2_f2">Historique 3 mois</li>
        <li data-i18n="plan2_f3">Certificats prioritaires</li>
        <li data-i18n="plan2_f4">Réponse email sous 24h</li>
        <li data-i18n="plan2_f5">Accès aux nouvelles fonctionnalités en avant-première</li>
      </ul>
      <a href="/compte" class="btn btn-primary" id="early-adopter-btn" data-i18n="plan2_btn">Réserver ma place</a>
      <p class="plan-spots" id="spots-left" style="font-size:12px;color:var(--green);margin-top:8px;text-align:center"></p>
    </div>
    <div class="plan reveal">
      <h4 data-i18n="plan3_name">Pro Power Seller</h4>
      <div class="plan-price">19,90 € <small data-i18n="per_month">/ mois</small></div>
      <p class="plan-desc" data-i18n="plan3_desc">Pour les vendeurs qui font +50 ventes/mois.</p>
      <ul>
        <li data-i18n="plan3_f1">Tout du plan Early Adopter</li>
        <li data-i18n="plan3_f2">Tableau de bord : ventes certifiées, litiges, économies réalisées</li>
        <li data-i18n="plan3_f3">Gestion unifiée sur vos plateformes de vente en ligne</li>
      </ul>
      <a href="/compte" class="btn btn-ghost" data-i18n="plan3_btn">Passer au Pro</a>
    </div>
  </div>
</section>

<section class="page" id="faq">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="faq_kicker">FAQ</div>
    <h2 class="section-title serif"><span data-i18n="faq_title1">Questions</span><br><span class="italic" data-i18n="faq_title2">fréquentes.</span></h2>
  </div>
  <div class="faq">
    <details class="faq-item"><summary class="faq-q" data-i18n="faq1_q">Ma preuve vidéo a-t-elle une valeur juridique ?</summary><p class="faq-a" data-i18n="faq1_a">Oui. Chaque vidéo est horodatée via un hash cryptographique SHA-256 généré au moment de l'enregistrement. En cas de litige devant un juge de proximité, elle constitue un élément de preuve recevable. La plupart des plateformes (Vinted, Leboncoin, Depop) acceptent les preuves vidéo dans leur processus de médiation interne.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="faq2_q">Est-ce que ça fonctionne vraiment avec Vinted et Leboncoin ?</summary><p class="faq-a" data-i18n="faq2_a">Oui. SellCov est indépendant de la plateforme. Tu génères une preuve vidéo horodatée que tu peux soumettre directement au service client de n'importe quelle marketplace. Vinted, Leboncoin, Depop et Vestiaire Collective acceptent tous les preuves vidéo dans leur processus de résolution de litiges.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="faq3_q">Combien de temps ça prend par envoi ?</summary><p class="faq-a" data-i18n="faq3_a">Entre 2 et 3 minutes. Tu filmes l'article sous tous les angles, le colis fermé, l'étiquette. L'application te guide étape par étape. Le certificat est généré instantanément.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="faq4_q">Mes vidéos sont-elles privées ?</summary><p class="faq-a" data-i18n="faq4_a">Totalement. Tes vidéos sont chiffrées, stockées sur des serveurs européens (RGPD), et accessibles uniquement depuis ton compte. Elles ne sont partagées qu'à ta demande, lors d'un litige.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="faq5_q">Que se passe-t-il après la bêta gratuite ?</summary><p class="faq-a" data-i18n="faq5_a">Les 50 premiers inscrits conservent automatiquement le tarif Early Adopter à 4,90 €/mois, garanti pendant 1 an. Tu seras prévenu 30 jours avant la fin de la bêta pour choisir ton plan. Aucun engagement, annulable en 1 clic.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="faq6_q">Ça fonctionne avec Leboncoin, Depop et les autres ?</summary><p class="faq-a" data-i18n="faq6_a">Oui. SellCov est indépendant de la plateforme de vente. Tu peux utiliser tes certificats sur Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Marketplace Facebook, n'importe quelle plateforme d'occasion.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="faq7_q">Que se passe-t-il si la défense automatique échoue ?</summary><p class="faq-a" data-i18n="faq7_a">SellCov te fournit une preuve vidéo horodatée, certifiée SHA-256, archivée et recevable en médiation. Cette preuve est solide et reconnue. Elle maximise tes chances, mais comme toute preuve, elle ne garantit pas un résultat favorable à 100% — la décision finale appartient à la plateforme ou au tribunal.</p></details>
  </div>
</section>

<section class="page" style="padding-top:40px">
  <div class="magnet reveal">
    <div>
      <div class="magnet-kicker" data-i18n="magnet_kicker">Guide gratuit</div>
      <h3 data-i18n="magnet_title">Les 5 arnaques Vinted qui coûtent le plus cher (et comment les éviter).</h3>
      <p data-i18n="magnet_desc">Cas concrets, réponses types prêtes à copier-coller. Reçois le guide gratuitement par email.</p>
      <form class="magnet-form" id="lead-form" onsubmit="submitLeadForm(event)">
        <input type="email" id="lead-email" required placeholder="Ton email" data-i18n-placeholder="email_placeholder" />
        <button type="submit" class="btn btn-primary" id="lead-btn" data-i18n="magnet_btn">Recevoir le guide</button>
      </form>
      <p id="lead-msg" style="color:var(--green);font-size:13px;margin-top:10px;display:none" data-i18n="magnet_success">Guide envoyé ! Vérifie ta boîte mail.</p>
      <small style="color:var(--text-dim);font-size:12px;display:block;margin-top:12px" data-i18n="magnet_legal">Pas de spam. Désabonnement en 1 clic.</small>
    </div>
    <div class="magnet-visual">
      <div class="magnet-pdf">5</div>
      <small data-i18n="magnet_visual">5 arnaques · guide gratuit</small>
    </div>
  </div>
</section>

<section class="final" id="cta">
  <h2 class="serif"><span data-i18n="final_title1">Protège ton argent</span><br><span class="italic" data-i18n="final_title2">maintenant.</span></h2>
  <p data-i18n="final_sub">Chaque vente non protégée est un risque.</p>
  <a href="/protection" class="btn btn-primary" style="padding:16px 32px;font-size:16px" data-i18n="final_cta">Essayer gratuitement →</a>
  <div class="platforms" style="margin-top:34px"><strong>Vinted</strong>·<strong>Leboncoin</strong>·<strong>Depop</strong>·<strong>Grailed</strong>·<strong>Vestiaire Collective</strong>·<strong>Etsy</strong></div>
</section>

<footer>
  <div class="foot">
    <div class="logo"><span class="logo-mark">sc</span>SellCov</div>
    <div class="foot-links">
      <a href="#faq" data-i18n="nav_faq">FAQ</a>
      <a href="#" data-i18n="footer_contact">Contact</a>
      <a href="#">Instagram</a>
      <a href="#">TikTok</a>
      <a href="/legal" data-i18n="footer_legal">Mentions légales</a>
      <a href="/cgu" data-i18n="footer_cgu">CGU</a>
      <a href="/confidentialite" data-i18n="footer_privacy">Confidentialité</a>
    </div>
    <div class="foot-copy">© 2026 SellCov</div>
  </div>
</footer>

<script>
// ─── TRANSLATIONS ───────────────────────────────────────────────
const I18N = {
  fr: {
    nav_how:"Comment", nav_why:"Pourquoi", nav_pricing:"Tarifs", nav_faq:"FAQ", nav_cta:"Essayer gratuit",
    badge:"Bêta ouverte · Accès gratuit",
    hero_h1_1:"Revends", hero_h1_2:"sans te faire arnaquer.",
    hero_sub:"Une preuve solide avant l'envoi. Un dossier complet en cas de litige.",
    hero_subsub:"Preuve horodatée. Défense automatique.",
    stat1:"Bêta ouverte", stat2:"Preuves certifiées", stat3:"Données chiffrées en France",
    hero_cta:"Protéger ma prochaine vente",
    demo1_title:"Crée l'annonce", demo_photos:"Photos", demo_state:"État", demo_state_val:"Très bon état", demo1_btn:"Générer l'annonce",
    demo2_title:"Certifie l'envoi", demo2_cam:"Filme l'article + colis + étiquette", cert_label:"Certificat SellCov",
    demo3_title:"Défense automatique", demo3_buyer:"Acheteur", demo3_complaint:"« L'article est abîmé, je veux un remboursement »", demo3_response_label:"Réponse générée", demo3_response:"« Preuve vidéo horodatée du 14/04 montre l'article en parfait état. Certificat SC-ABC123XYZ joint. »", demo3_btn:"Envoyer la défense",
    how_kicker:"Comment ça marche", how_title1:"Trois modules,", how_title2:"une seule mission.",
    how_sub:"De l'annonce à la défense en cas de litige, SellCov t'accompagne sur chaque étape d'une vente.",
    feat1_tag:"Annonce", feat1_h1:"Génère ton annonce", feat1_h2:"en 10 secondes.", feat1_p:"Photographiez l'article, recevez une annonce rédigée et prête à publier.", feat1_btn:"Essayer", feat1_time:"~10 sec par annonce",
    feat2_tag:"Protection", feat2_h1:"Certifie avant", feat2_h2:"d'expédier.", feat2_p:"Trois minutes de vidéo horodatée couvrant l'article, le colis fermé et l'étiquette d'expédition. Chaque capture reçoit un certificat cryptographique unique, archivé pendant 3 mois. Une preuve recevable en cas de litige.", feat2_btn:"Protéger", feat2_time:"~3 min par envoi",
    feat3_tag:"Litige", feat3_h1:"Défense automatique.", feat3_h2:"En 1 clic.", feat3_p:"Dossier de défense généré automatiquement, prêt à transmettre au service litiges.", feat3_btn:"Gérer un litige", feat3_time:"~30 sec de rédaction",
    scam_kicker:"Les arnaques que tu vas rencontrer", scam_title1:"Les 5 arnaques qui coûtent", scam_title2:"le plus cher aux vendeurs.", scam_sub:"Chaque année, de nombreux vendeurs particuliers perdent de l'argent à cause de litiges mal gérés. Voici les scénarios les plus fréquents et la façon dont SellCov vous protège.",
    scam1_title:"Arnaque n°1 · Colis \"jamais reçu\"", scam1_quote:"« Je n'ai jamais reçu le colis. Je demande un remboursement. »", scam1_solve:"<strong style='color:#fff'>SellCov affiche</strong> la vidéo horodatée du dépôt en bureau de poste, le numéro de suivi et l'étiquette filmée. Défense envoyée en 30 secondes.",
    scam2_title:"Arnaque n°2 · Article \"abîmé\"", scam2_quote:"« L'article est arrivé troué. Je veux être remboursé. »", scam2_solve:"<strong style='color:#fff'>SellCov prouve</strong> l'état exact avant expédition grâce à la vidéo 360° horodatée. L'IA compare les photos de l'acheteur et détecte les incohérences.",
    scam3_title:"Arnaque n°3 · Substitution", scam3_quote:"« Ce n'est pas l'article que j'ai commandé. »", scam3_solve:"<strong style='color:#fff'>SellCov atteste</strong> le contenu exact du colis au moment de la fermeture. Marque, taille, couleur, détails, tout est filmé.",
    scam4_title:"Arnaque n°4 · Colis \"vide\"", scam4_quote:"« Le colis est arrivé vide sans l'article principal. »", scam4_solve:"<strong style='color:#fff'>SellCov enregistre</strong> l'article placé dans le colis puis le colis fermé avec scotch sécurisé, en une seule prise vidéo.",
    scam5_title:"Arnaque n°5 · \"Ce n'est pas authentique\"", scam5_quote:"« Le produit est une contrefaçon, je signale à la plateforme. »", scam5_solve:"<strong style='color:#fff'>SellCov horodate</strong> les codes produit, étiquettes d'authenticité, factures d'achat. En cas de litige, tu joins le tout à ta défense automatique en un clic.",
    proof_kicker:"Les garanties techniques", proof_title1:"Ce qui tient", proof_title2:"en cas de litige.", proof_stat1:"par vente sécurisée", proof_stat2:"norme cryptographique certifiée", proof_stat3:"d'archivage sécurisé en France",
    pricing_kicker:"Nos offres", pricing_title1:"Simple,", pricing_title2:"sans surprise.", pricing_sub:"Les 50 premiers vendeurs bénéficient du tarif Early Adopter. Tarif bloqué 1 an. Aucun engagement, annulable en 1 clic.",
    per_month:"/ mois",
    plan1_name:"Bêta", plan1_desc:"Accès complet pendant la phase de lancement.", plan1_f1:"Certificats vidéo illimités", plan1_f2:"IA défense automatique", plan1_f3:"Génération d'annonces", plan1_f4:"Support email", plan1_btn:"Démarrer gratuitement",
    plan2_ribbon:"★ Recommandé", plan2_name:"Early Adopter", plan2_desc:"Réservé aux 50 premiers. Tarif garanti 1 an.", plan2_f1:"Tout du plan Bêta", plan2_f2:"Historique 3 mois", plan2_f3:"Certificats prioritaires", plan2_f4:"Réponse email sous 24h", plan2_f5:"Accès aux nouvelles fonctionnalités en avant-première", plan2_btn:"Réserver ma place",
    plan3_name:"Pro Power Seller", plan3_desc:"Pour les vendeurs qui font +50 ventes/mois.", plan3_f1:"Tout du plan Early Adopter", plan3_f2:"Tableau de bord : ventes certifiées, litiges, économies réalisées", plan3_f3:"Gestion unifiée sur vos plateformes de vente en ligne", plan3_btn:"Passer au Pro",
    faq_kicker:"FAQ", faq_title1:"Questions", faq_title2:"fréquentes.",
    faq1_q:"Ma preuve vidéo a-t-elle une valeur juridique ?", faq1_a:"Oui. Chaque vidéo est horodatée via un hash cryptographique SHA-256. En cas de litige, elle constitue un élément de preuve recevable. La plupart des plateformes acceptent les preuves vidéo dans leur médiation interne.",
    faq2_q:"Est-ce que ça fonctionne avec Vinted et Leboncoin ?", faq2_a:"Oui. SellCov est indépendant de la plateforme. Tu génères une preuve vidéo horodatée soumissible sur n'importe quelle marketplace.",
    faq3_q:"Combien de temps ça prend par envoi ?", faq3_a:"Entre 2 et 3 minutes. Tu filmes l'article, le colis fermé, l'étiquette. L'application te guide. Le certificat est généré instantanément.",
    faq4_q:"Mes vidéos sont-elles privées ?", faq4_a:"Totalement. Tes vidéos sont chiffrées, stockées sur des serveurs européens (RGPD), accessibles uniquement depuis ton compte.",
    faq5_q:"Que se passe-t-il après la bêta gratuite ?", faq5_a:"Les 50 premiers inscrits conservent le tarif Early Adopter à 4,90 €/mois, garanti 1 an. Tu seras prévenu 30 jours avant la fin de la bêta.",
    faq6_q:"Ça fonctionne avec Leboncoin, Depop et les autres ?", faq6_a:"Oui. SellCov fonctionne sur Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Marketplace Facebook, toutes les plateformes d'occasion.",
    faq7_q:"Que se passe-t-il si la défense automatique échoue ?", faq7_a:"SellCov te fournit une preuve vidéo horodatée, certifiée SHA-256, recevable en médiation. Cette preuve maximise tes chances, mais ne garantit pas un résultat favorable à 100% — la décision finale appartient à la plateforme ou au tribunal.",
    magnet_kicker:"Guide gratuit", magnet_title:"Les 5 arnaques Vinted qui coûtent le plus cher (et comment les éviter).", magnet_desc:"Cas concrets, réponses types prêtes à copier-coller. Reçois le guide gratuitement par email.", magnet_btn:"Recevoir le guide", magnet_success:"Guide envoyé ! Vérifie ta boîte mail.", magnet_legal:"Pas de spam. Désabonnement en 1 clic.", magnet_visual:"5 arnaques · guide gratuit", email_placeholder:"Ton email",
    final_title1:"Protège ton argent", final_title2:"maintenant.", final_sub:"Chaque vente non protégée est un risque.", final_cta:"Essayer gratuitement →",
    footer_contact:"Contact", footer_legal:"Mentions légales", footer_cgu:"CGU", footer_privacy:"Confidentialité"
  },
  en: {
    nav_how:"How it works", nav_why:"Why", nav_pricing:"Pricing", nav_faq:"FAQ", nav_cta:"Try for free",
    badge:"Open Beta · Free access",
    hero_h1_1:"Sell", hero_h1_2:"without getting scammed.",
    hero_sub:"Solid proof before shipping. Full case file for any dispute.",
    hero_subsub:"Timestamped proof. Automatic defence.",
    stat1:"Open Beta", stat2:"Certified proofs", stat3:"Data encrypted in France",
    hero_cta:"Protect my next sale",
    demo1_title:"Create the listing", demo_photos:"Photos", demo_state:"Condition", demo_state_val:"Very good condition", demo1_btn:"Generate listing",
    demo2_title:"Certify the shipment", demo2_cam:"Film item + parcel + label", cert_label:"SellCov Certificate",
    demo3_title:"Automatic defence", demo3_buyer:"Buyer", demo3_complaint:"\"The item arrived damaged, I want a refund\"", demo3_response_label:"Generated reply", demo3_response:"\"Timestamped video proof from 14/04 shows item in perfect condition. Certificate SC-ABC123XYZ attached.\"", demo3_btn:"Send defence",
    how_kicker:"How it works", how_title1:"Three modules,", how_title2:"one mission.",
    how_sub:"From listing to dispute defence, SellCov covers every step of your sale.",
    feat1_tag:"Listing", feat1_h1:"Generate your listing", feat1_h2:"in 10 seconds.", feat1_p:"Photograph the item, receive a written listing ready to publish.", feat1_btn:"Try it", feat1_time:"~10 sec per listing",
    feat2_tag:"Protection", feat2_h1:"Certify before", feat2_h2:"shipping.", feat2_p:"Three minutes of timestamped video covering the item, the sealed parcel and the shipping label. Each recording gets a unique cryptographic certificate, archived for 3 months. Admissible proof for any dispute.", feat2_btn:"Protect", feat2_time:"~3 min per shipment",
    feat3_tag:"Dispute", feat3_h1:"Automatic defence.", feat3_h2:"In 1 click.", feat3_p:"Defence file auto-generated, ready to send to the platform's dispute team.", feat3_btn:"Handle dispute", feat3_time:"~30 sec to write",
    scam_kicker:"Scams you will encounter", scam_title1:"The 5 scams that cost", scam_title2:"sellers the most.", scam_sub:"Every year, many private sellers lose money due to poorly handled disputes. Here are the most common scenarios and how SellCov protects you.",
    scam1_title:"Scam #1 · Parcel \"never received\"", scam1_quote:"\"I never received the parcel. I'm requesting a refund.\"", scam1_solve:"<strong style='color:#fff'>SellCov shows</strong> the timestamped video of drop-off at the post office, the tracking number and the filmed label. Defence sent in 30 seconds.",
    scam2_title:"Scam #2 · Item \"damaged\"", scam2_quote:"\"The item arrived with a hole. I want a refund.\"", scam2_solve:"<strong style='color:#fff'>SellCov proves</strong> the exact condition before shipping via 360° timestamped video. AI compares the buyer's photos and detects inconsistencies.",
    scam3_title:"Scam #3 · Substitution", scam3_quote:"\"This is not the item I ordered.\"", scam3_solve:"<strong style='color:#fff'>SellCov certifies</strong> the exact contents of the parcel at the time of sealing. Brand, size, colour, details, all filmed.",
    scam4_title:"Scam #4 · Empty parcel", scam4_quote:"\"The parcel arrived empty without the main item.\"", scam4_solve:"<strong style='color:#fff'>SellCov records</strong> the item being placed in the parcel and the parcel being sealed with security tape, in one continuous video.",
    scam5_title:"Scam #5 · \"It's not authentic\"", scam5_quote:"\"The product is a fake, I'm reporting it to the platform.\"", scam5_solve:"<strong style='color:#fff'>SellCov timestamps</strong> product codes, authenticity labels, purchase receipts. In case of dispute, attach everything to your auto-generated defence in one click.",
    proof_kicker:"Technical guarantees", proof_title1:"What holds up", proof_title2:"in a dispute.", proof_stat1:"per secured sale", proof_stat2:"certified cryptographic standard", proof_stat3:"secure archiving in France",
    pricing_kicker:"Our plans", pricing_title1:"Simple,", pricing_title2:"no surprises.", pricing_sub:"The first 50 sellers get the Early Adopter rate. Price locked for 1 year. No commitment, cancel anytime.",
    per_month:"/ month",
    plan1_name:"Beta", plan1_desc:"Full access during the launch phase.", plan1_f1:"Unlimited video certificates", plan1_f2:"AI automatic defence", plan1_f3:"Listing generation", plan1_f4:"Email support", plan1_btn:"Start for free",
    plan2_ribbon:"★ Recommended", plan2_name:"Early Adopter", plan2_desc:"Reserved for the first 50. Rate locked for 1 year.", plan2_f1:"Everything in Beta", plan2_f2:"3-month history", plan2_f3:"Priority certificates", plan2_f4:"Email reply within 24h", plan2_f5:"Early access to new features", plan2_btn:"Reserve my spot",
    plan3_name:"Pro Power Seller", plan3_desc:"For sellers with 50+ sales/month.", plan3_f1:"Everything in Early Adopter", plan3_f2:"Dashboard: certified sales, disputes, savings", plan3_f3:"Unified management across your selling platforms", plan3_btn:"Go Pro",
    faq_kicker:"FAQ", faq_title1:"Frequently asked", faq_title2:"questions.",
    faq1_q:"Does my video proof have legal value?", faq1_a:"Yes. Each video is timestamped via a SHA-256 cryptographic hash. In case of a dispute, it constitutes admissible evidence. Most platforms accept video proof in their internal mediation process.",
    faq2_q:"Does it really work with Vinted and Leboncoin?", faq2_a:"Yes. SellCov is platform-independent. You generate a timestamped video proof that you can submit to any marketplace's customer service.",
    faq3_q:"How long does it take per shipment?", faq3_a:"Between 2 and 3 minutes. You film the item, the sealed parcel, the label. The app guides you step by step. The certificate is generated instantly.",
    faq4_q:"Are my videos private?", faq4_a:"Completely. Your videos are encrypted, stored on European servers (GDPR), and accessible only from your account.",
    faq5_q:"What happens after the free beta?", faq5_a:"The first 50 sign-ups automatically keep the Early Adopter rate at €4.90/month, guaranteed for 1 year. You'll be notified 30 days before the beta ends.",
    faq6_q:"Does it work with Leboncoin, Depop and others?", faq6_a:"Yes. SellCov works on Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Facebook Marketplace, any second-hand platform.",
    faq7_q:"What if the automatic defence fails?", faq7_a:"SellCov provides a timestamped, SHA-256 certified video proof, archived and admissible in mediation. This proof maximises your chances, but like any evidence, it cannot guarantee a 100% favourable outcome — the final decision belongs to the platform or court.",
    magnet_kicker:"Free guide", magnet_title:"The 5 Vinted scams that cost the most (and how to avoid them).", magnet_desc:"Real cases, ready-to-copy reply templates. Receive the guide free by email.", magnet_btn:"Get the guide", magnet_success:"Guide sent! Check your inbox.", magnet_legal:"No spam. Unsubscribe in 1 click.", magnet_visual:"5 scams · free guide", email_placeholder:"Your email",
    final_title1:"Protect your money", final_title2:"now.", final_sub:"Every unprotected sale is a risk.", final_cta:"Try for free →",
    footer_contact:"Contact", footer_legal:"Legal notice", footer_cgu:"T&Cs", footer_privacy:"Privacy"
  },
  es: {
    nav_how:"Cómo funciona", nav_why:"Por qué", nav_pricing:"Precios", nav_faq:"FAQ", nav_cta:"Probar gratis",
    badge:"Beta abierta · Acceso gratuito",
    hero_h1_1:"Vende", hero_h1_2:"sin que te estafen.",
    hero_sub:"Prueba sólida antes del envío. Expediente completo en caso de litigio.",
    hero_subsub:"Prueba con marca de tiempo. Defensa automática.",
    stat1:"Beta abierta", stat2:"Pruebas certificadas", stat3:"Datos cifrados en Francia",
    hero_cta:"Proteger mi próxima venta",
    demo1_title:"Crea el anuncio", demo_photos:"Fotos", demo_state:"Estado", demo_state_val:"Muy buen estado", demo1_btn:"Generar anuncio",
    demo2_title:"Certifica el envío", demo2_cam:"Filma artículo + paquete + etiqueta", cert_label:"Certificado SellCov",
    demo3_title:"Defensa automática", demo3_buyer:"Comprador", demo3_complaint:"\"El artículo llegó dañado, quiero un reembolso\"", demo3_response_label:"Respuesta generada", demo3_response:"\"Video con marca de tiempo del 14/04 muestra el artículo en perfecto estado. Certificado SC-ABC123XYZ adjunto.\"", demo3_btn:"Enviar defensa",
    how_kicker:"Cómo funciona", how_title1:"Tres módulos,", how_title2:"una sola misión.",
    how_sub:"Del anuncio a la defensa en caso de litigio, SellCov te acompaña en cada etapa.",
    feat1_tag:"Anuncio", feat1_h1:"Genera tu anuncio", feat1_h2:"en 10 segundos.", feat1_p:"Fotografía el artículo, recibe un anuncio redactado listo para publicar.", feat1_btn:"Probar", feat1_time:"~10 seg por anuncio",
    feat2_tag:"Protección", feat2_h1:"Certifica antes", feat2_h2:"de enviar.", feat2_p:"Tres minutos de video con marca de tiempo cubriendo el artículo, el paquete cerrado y la etiqueta. Cada grabación recibe un certificado criptográfico único, archivado durante 3 meses.", feat2_btn:"Proteger", feat2_time:"~3 min por envío",
    feat3_tag:"Litigio", feat3_h1:"Defensa automática.", feat3_h2:"Con 1 clic.", feat3_p:"Expediente de defensa generado automáticamente, listo para enviar al servicio de litigios.", feat3_btn:"Gestionar litigio", feat3_time:"~30 seg de redacción",
    scam_kicker:"Las estafas que vas a encontrar", scam_title1:"Las 5 estafas que más cuestan", scam_title2:"a los vendedores.", scam_sub:"Cada año, muchos vendedores particulares pierden dinero por litigios mal gestionados.",
    scam1_title:"Estafa n°1 · Paquete \"nunca recibido\"", scam1_quote:"\"Nunca recibí el paquete. Solicito un reembolso.\"", scam1_solve:"<strong style='color:#fff'>SellCov muestra</strong> el video con marca de tiempo del depósito en correos, el número de seguimiento y la etiqueta filmada.",
    scam2_title:"Estafa n°2 · Artículo \"dañado\"", scam2_quote:"\"El artículo llegó con un agujero. Quiero un reembolso.\"", scam2_solve:"<strong style='color:#fff'>SellCov prueba</strong> el estado exacto antes del envío mediante video 360° con marca de tiempo.",
    scam3_title:"Estafa n°3 · Sustitución", scam3_quote:"\"Esto no es el artículo que pedí.\"", scam3_solve:"<strong style='color:#fff'>SellCov certifica</strong> el contenido exacto del paquete en el momento del cierre.",
    scam4_title:"Estafa n°4 · Paquete \"vacío\"", scam4_quote:"\"El paquete llegó vacío sin el artículo principal.\"", scam4_solve:"<strong style='color:#fff'>SellCov graba</strong> el artículo siendo colocado en el paquete y el paquete sellado, en una sola toma.",
    scam5_title:"Estafa n°5 · \"No es auténtico\"", scam5_quote:"\"El producto es una falsificación, lo denuncio a la plataforma.\"", scam5_solve:"<strong style='color:#fff'>SellCov marca</strong> los códigos de producto, etiquetas de autenticidad y facturas de compra.",
    proof_kicker:"Garantías técnicas", proof_title1:"Lo que resiste", proof_title2:"en un litigio.", proof_stat1:"por venta asegurada", proof_stat2:"norma criptográfica certificada", proof_stat3:"archivo seguro en Francia",
    pricing_kicker:"Nuestros planes", pricing_title1:"Simple,", pricing_title2:"sin sorpresas.", pricing_sub:"Los primeros 50 vendedores se benefician de la tarifa Early Adopter. Precio bloqueado 1 año. Sin compromiso.",
    per_month:"/ mes",
    plan1_name:"Beta", plan1_desc:"Acceso completo durante la fase de lanzamiento.", plan1_f1:"Certificados de video ilimitados", plan1_f2:"IA defensa automática", plan1_f3:"Generación de anuncios", plan1_f4:"Soporte por email", plan1_btn:"Empezar gratis",
    plan2_ribbon:"★ Recomendado", plan2_name:"Early Adopter", plan2_desc:"Reservado para los 50 primeros. Tarifa garantizada 1 año.", plan2_f1:"Todo del plan Beta", plan2_f2:"Historial 3 meses", plan2_f3:"Certificados prioritarios", plan2_f4:"Respuesta por email en 24h", plan2_f5:"Acceso anticipado a nuevas funciones", plan2_btn:"Reservar mi lugar",
    plan3_name:"Pro Power Seller", plan3_desc:"Para vendedores con +50 ventas/mes.", plan3_f1:"Todo del plan Early Adopter", plan3_f2:"Panel: ventas certificadas, litigios, ahorros", plan3_f3:"Gestión unificada en tus plataformas de venta", plan3_btn:"Ir al Pro",
    faq_kicker:"FAQ", faq_title1:"Preguntas", faq_title2:"frecuentes.",
    faq1_q:"¿Tiene valor legal mi prueba en video?", faq1_a:"Sí. Cada video tiene marca de tiempo mediante hash criptográfico SHA-256. Constituye prueba admisible en mediación.",
    faq2_q:"¿Funciona realmente con Vinted y Leboncoin?", faq2_a:"Sí. SellCov es independiente de la plataforma. Generas una prueba en video que puedes enviar a cualquier marketplace.",
    faq3_q:"¿Cuánto tiempo tarda por envío?", faq3_a:"Entre 2 y 3 minutos. Filmas el artículo, el paquete cerrado, la etiqueta. La aplicación te guía paso a paso.",
    faq4_q:"¿Mis videos son privados?", faq4_a:"Completamente. Tus videos están cifrados, almacenados en servidores europeos (RGPD), accesibles solo desde tu cuenta.",
    faq5_q:"¿Qué pasa después de la beta gratuita?", faq5_a:"Los primeros 50 inscritos mantienen la tarifa Early Adopter a 4,90 €/mes, garantizada 1 año.",
    faq6_q:"¿Funciona con Leboncoin, Depop y otros?", faq6_a:"Sí. SellCov funciona en Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Facebook Marketplace.",
    faq7_q:"¿Qué pasa si la defensa automática falla?", faq7_a:"SellCov te proporciona una prueba sólida y certificada. Maximiza tus posibilidades, pero no garantiza un resultado al 100% — la decisión final corresponde a la plataforma o tribunal.",
    magnet_kicker:"Guía gratuita", magnet_title:"Las 5 estafas de Vinted que más cuestan (y cómo evitarlas).", magnet_desc:"Casos reales, respuestas tipo listas para copiar. Recibe la guía gratis por email.", magnet_btn:"Recibir la guía", magnet_success:"¡Guía enviada! Revisa tu correo.", magnet_legal:"Sin spam. Cancelar con 1 clic.", magnet_visual:"5 estafas · guía gratuita", email_placeholder:"Tu email",
    final_title1:"Protege tu dinero", final_title2:"ahora.", final_sub:"Cada venta sin protección es un riesgo.", final_cta:"Probar gratis →",
    footer_contact:"Contacto", footer_legal:"Aviso legal", footer_cgu:"T&C", footer_privacy:"Privacidad"
  },
  de: {
    nav_how:"Wie es funktioniert", nav_why:"Warum", nav_pricing:"Preise", nav_faq:"FAQ", nav_cta:"Kostenlos testen",
    badge:"Offene Beta · Kostenloser Zugang",
    hero_h1_1:"Verkaufe", hero_h1_2:"ohne betrogen zu werden.",
    hero_sub:"Solider Beweis vor dem Versand. Vollständige Akte bei Streitigkeiten.",
    hero_subsub:"Zeitgestempelter Beweis. Automatische Verteidigung.",
    stat1:"Offene Beta", stat2:"Zertifizierte Beweise", stat3:"Daten verschlüsselt in Frankreich",
    hero_cta:"Meinen nächsten Verkauf schützen",
    demo1_title:"Anzeige erstellen", demo_photos:"Fotos", demo_state:"Zustand", demo_state_val:"Sehr guter Zustand", demo1_btn:"Anzeige generieren",
    demo2_title:"Versand zertifizieren", demo2_cam:"Artikel + Paket + Etikett filmen", cert_label:"SellCov Zertifikat",
    demo3_title:"Automatische Verteidigung", demo3_buyer:"Käufer", demo3_complaint:"\"Der Artikel ist beschädigt angekommen, ich möchte eine Rückerstattung\"", demo3_response_label:"Generierte Antwort", demo3_response:"\"Zeitgestempeltes Video vom 14.04. zeigt Artikel in einwandfreiem Zustand. Zertifikat SC-ABC123XYZ beigefügt.\"", demo3_btn:"Verteidigung senden",
    how_kicker:"Wie es funktioniert", how_title1:"Drei Module,", how_title2:"eine einzige Mission.",
    how_sub:"Von der Anzeige bis zur Streitverteidigung begleitet SellCov jeden Schritt.",
    feat1_tag:"Anzeige", feat1_h1:"Erstelle deine Anzeige", feat1_h2:"in 10 Sekunden.", feat1_p:"Fotografiere den Artikel, erhalte eine fertige Anzeige zum Veröffentlichen.", feat1_btn:"Ausprobieren", feat1_time:"~10 Sek. pro Anzeige",
    feat2_tag:"Schutz", feat2_h1:"Zertifiziere vor", feat2_h2:"dem Versand.", feat2_p:"Drei Minuten zeitgestempeltes Video des Artikels, versiegelten Pakets und Versandetiketts. Jede Aufnahme erhält ein einzigartiges kryptographisches Zertifikat, archiviert für 3 Monate.", feat2_btn:"Schützen", feat2_time:"~3 Min. pro Versand",
    feat3_tag:"Streit", feat3_h1:"Automatische Verteidigung.", feat3_h2:"Mit 1 Klick.", feat3_p:"Automatisch generierte Verteidigungsakte, bereit zum Weiterleiten.", feat3_btn:"Streit bearbeiten", feat3_time:"~30 Sek. zum Schreiben",
    scam_kicker:"Betrugsmaschen die du antreffen wirst", scam_title1:"Die 5 teuersten Betrugsmaschen", scam_title2:"für Verkäufer.", scam_sub:"Jedes Jahr verlieren viele Privatverkäufer Geld durch schlecht verwaltete Streitigkeiten.",
    scam1_title:"Betrug Nr.1 · Paket \"nie erhalten\"", scam1_quote:"\"Ich habe das Paket nie erhalten. Ich fordere eine Rückerstattung.\"", scam1_solve:"<strong style='color:#fff'>SellCov zeigt</strong> das zeitgestempelte Video der Paketabgabe, die Sendungsnummer und das gefilmte Etikett.",
    scam2_title:"Betrug Nr.2 · Artikel \"beschädigt\"", scam2_quote:"\"Der Artikel kam mit einem Loch an. Ich möchte eine Rückerstattung.\"", scam2_solve:"<strong style='color:#fff'>SellCov beweist</strong> den genauen Zustand vor dem Versand per zeitgestempeltem 360°-Video.",
    scam3_title:"Betrug Nr.3 · Substitution", scam3_quote:"\"Das ist nicht der Artikel, den ich bestellt habe.\"", scam3_solve:"<strong style='color:#fff'>SellCov bestätigt</strong> den genauen Inhalt des Pakets beim Versiegeln.",
    scam4_title:"Betrug Nr.4 · Leeres Paket", scam4_quote:"\"Das Paket kam leer ohne den Hauptartikel an.\"", scam4_solve:"<strong style='color:#fff'>SellCov zeichnet</strong> das Einlegen des Artikels und das Versiegeln in einer einzigen Videoaufnahme auf.",
    scam5_title:"Betrug Nr.5 · \"Es ist nicht authentisch\"", scam5_quote:"\"Das Produkt ist eine Fälschung, ich melde es der Plattform.\"", scam5_solve:"<strong style='color:#fff'>SellCov stempelt</strong> Produktcodes, Echtheitsetiketten und Kaufbelege zeitlich.",
    proof_kicker:"Technische Garantien", proof_title1:"Was standhält", proof_title2:"bei einem Streit.", proof_stat1:"pro gesichertem Verkauf", proof_stat2:"zertifizierter kryptographischer Standard", proof_stat3:"sichere Archivierung in Frankreich",
    pricing_kicker:"Unsere Pläne", pricing_title1:"Einfach,", pricing_title2:"keine Überraschungen.", pricing_sub:"Die ersten 50 Verkäufer erhalten den Early Adopter Tarif. Preis 1 Jahr gesperrt. Keine Bindung.",
    per_month:"/ Monat",
    plan1_name:"Beta", plan1_desc:"Vollständiger Zugang während der Startphase.", plan1_f1:"Unbegrenzte Videozertifikate", plan1_f2:"KI automatische Verteidigung", plan1_f3:"Anzeigengenerierung", plan1_f4:"E-Mail-Support", plan1_btn:"Kostenlos starten",
    plan2_ribbon:"★ Empfohlen", plan2_name:"Early Adopter", plan2_desc:"Nur für die ersten 50. Tarif 1 Jahr garantiert.", plan2_f1:"Alles aus Beta", plan2_f2:"3 Monate Verlauf", plan2_f3:"Prioritätszertifikate", plan2_f4:"E-Mail-Antwort innerhalb 24h", plan2_f5:"Frühzeitiger Zugang zu neuen Funktionen", plan2_btn:"Platz reservieren",
    plan3_name:"Pro Power Seller", plan3_desc:"Für Verkäufer mit 50+ Verkäufen/Monat.", plan3_f1:"Alles aus Early Adopter", plan3_f2:"Dashboard: zertifizierte Verkäufe, Streitigkeiten, Ersparnisse", plan3_f3:"Einheitliche Verwaltung Ihrer Verkaufsplattformen", plan3_btn:"Zu Pro wechseln",
    faq_kicker:"FAQ", faq_title1:"Häufig gestellte", faq_title2:"Fragen.",
    faq1_q:"Hat mein Videobeweis rechtlichen Wert?", faq1_a:"Ja. Jedes Video wird via SHA-256-Hash zeitgestempelt. Es gilt als zulässiger Beweis in Mediationsverfahren.",
    faq2_q:"Funktioniert es wirklich mit Vinted und Leboncoin?", faq2_a:"Ja. SellCov ist plattformunabhängig. Du generierst einen zeitgestempelten Videobeweis für jeden Marktplatz.",
    faq3_q:"Wie lange dauert es pro Versand?", faq3_a:"2 bis 3 Minuten. Du filmst den Artikel, das versiegelte Paket, das Etikett. Die App führt dich Schritt für Schritt.",
    faq4_q:"Sind meine Videos privat?", faq4_a:"Vollständig. Deine Videos sind verschlüsselt, auf europäischen Servern (DSGVO) gespeichert und nur von deinem Konto zugänglich.",
    faq5_q:"Was passiert nach der kostenlosen Beta?", faq5_a:"Die ersten 50 Anmeldungen behalten automatisch den Early Adopter Tarif bei 4,90 €/Monat, 1 Jahr garantiert.",
    faq6_q:"Funktioniert es mit Leboncoin, Depop und anderen?", faq6_a:"Ja. SellCov funktioniert auf Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Facebook Marketplace.",
    faq7_q:"Was passiert wenn die automatische Verteidigung scheitert?", faq7_a:"SellCov liefert einen soliden, zertifizierten Beweis. Er maximiert deine Chancen, garantiert aber kein 100% positives Ergebnis — die endgültige Entscheidung trifft die Plattform oder das Gericht.",
    magnet_kicker:"Kostenloser Leitfaden", magnet_title:"Die 5 teuersten Vinted-Betrügereien (und wie man sie vermeidet).", magnet_desc:"Echte Fälle, kopierfertige Antwortvorlagen. Erhalte den Leitfaden kostenlos per E-Mail.", magnet_btn:"Leitfaden erhalten", magnet_success:"Leitfaden gesendet! Überprüfe dein Postfach.", magnet_legal:"Kein Spam. Abmelden mit 1 Klick.", magnet_visual:"5 Betrügereien · kostenlos", email_placeholder:"Deine E-Mail",
    final_title1:"Schütze dein Geld", final_title2:"jetzt.", final_sub:"Jeder ungeschützte Verkauf ist ein Risiko.", final_cta:"Kostenlos testen →",
    footer_contact:"Kontakt", footer_legal:"Impressum", footer_cgu:"AGB", footer_privacy:"Datenschutz"
  }
};

function setLang(lang) {
  if (!I18N[lang]) return;
  localStorage.setItem('sellcov_lang', lang);
  const t = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = lang;
}

// Init on load
(function() {
  const saved = localStorage.getItem('sellcov_lang') || 'fr';
  setLang(saved);
})();

// Early Adopter counter
async function checkSpots() {
  try {
    const res = await fetch('/api/early-adopter-count');
    const data = await res.json();
    const remaining = 50 - (data.count || 0);
    const el = document.getElementById('spots-left');
    const btn = document.getElementById('early-adopter-btn');
    if (el) {
      if (remaining <= 0) {
        el.textContent = 'Complet — toutes les places sont prises.';
        el.style.color = 'var(--pink)';
        if (btn) { btn.textContent = 'Complet'; btn.style.opacity = '0.5'; btn.style.pointerEvents = 'none'; }
      } else {
        el.textContent = remaining + ' place' + (remaining > 1 ? 's' : '') + ' restante' + (remaining > 1 ? 's' : '');
      }
    }
  } catch(e) {}
}
checkSpots();

// Lead magnet
async function submitLeadForm(e) {
  e.preventDefault();
  const email = document.getElementById('lead-email').value;
  const btn = document.getElementById('lead-btn');
  const msg = document.getElementById('lead-msg');
  btn.textContent = '...';
  btn.disabled = true;
  try {
    await fetch('/api/send-guide', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email}) });
    msg.style.display = 'block';
    document.getElementById('lead-form').reset();
  } catch(err) {
    btn.textContent = 'Recevoir le guide';
    btn.disabled = false;
  }
}
</script>
`;

export default function Home() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
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
        .lang-select{background:transparent;border:1px solid var(--border-strong);color:var(--text-muted);padding:7px 12px;border-radius:999px;font-size:13px;cursor:pointer;font-family:inherit;appearance:none;-webkit-appearance:none}
        .lang-select:focus{outline:none;border-color:var(--green)}
        .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 22px;border-radius:999px;font-weight:600;font-size:15px;transition:transform .15s,box-shadow .15s,background .15s;cursor:pointer;border:none;font-family:inherit;white-space:nowrap}
        .btn-primary{background:#fff;color:#000}
        .btn-primary:hover{transform:translateY(-1px);box-shadow:0 10px 30px rgba(255,255,255,.15)}
        .btn-ghost{background:transparent;color:#fff;border:1px solid var(--border-strong)}
        .btn-ghost:hover{border-color:#fff}
        .btn-violet{background:var(--violet);color:#000}
        .btn-green{background:var(--green);color:#000}
        .btn-pink{background:var(--pink);color:#000}
        .btn-sm{padding:9px 16px;font-size:13px}
        @media(max-width:820px){.nav-links{display:none}}
        .hero{position:relative;padding:140px 24px 60px;text-align:center;overflow:hidden}
        .hero::before{content:"";position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:900px;height:900px;background:radial-gradient(circle,rgba(94,232,163,.08) 0%,rgba(0,0,0,0) 60%);pointer-events:none;z-index:0}
        .hero > *{position:relative;z-index:1}
        .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(94,232,163,.08);border:1px solid rgba(94,232,163,.25);padding:7px 14px;border-radius:999px;font-size:13px;color:var(--green);margin-bottom:40px}
        .badge .dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
        .h1{font-size:clamp(48px,8vw,104px);line-height:.95;letter-spacing:-.03em;margin-bottom:18px}
        .h1 .italic{display:block;font-size:.92em}
        .hero-sub{font-size:clamp(15px,1.6vw,18px);color:#fff;max-width:900px;margin:0 auto 10px;line-height:1.45;white-space:nowrap}
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
        .section-head{text-align:center;max-width:1100px;margin:0 auto 60px}
        .section-kicker{color:var(--text-dim);font-size:12px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:14px}
        .section-title{font-size:clamp(36px,5vw,60px);line-height:1;letter-spacing:-.02em;margin-bottom:18px}
        .section-sub{color:var(--text-muted);font-size:17px;white-space:nowrap}
        .features{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:var(--maxw);margin:0 auto}
        .features .feature:last-child{grid-column:1/-1}
        @media(max-width:820px){.features{grid-template-columns:1fr}.features .feature:last-child{grid-column:auto}.section-sub{white-space:normal}.hero-sub{white-space:normal}}
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
