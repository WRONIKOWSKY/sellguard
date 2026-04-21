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
      <select class="lang-select" id="lang-select" onchange="window.setLang(this.value)">
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
  <p class="hero-sub" data-i18n="hero_sub">Une preuve solide avant l'envoi. Un dossier complet en cas de litige.</p>
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
  <div class="phone-wrap">
    <div class="phone-frame">
      <div class="phone-btn phone-btn-mute"></div>
      <div class="phone-btn phone-btn-volup"></div>
      <div class="phone-btn phone-btn-voldown"></div>
      <div class="phone-btn phone-btn-power"></div>
      <div class="phone-island">
        <span class="phone-island-cam"></span>
        <span class="phone-island-sensor"></span>
      </div>
      <div class="phone-screen">
        <div class="phone-glare"></div>
        <iframe
          src="https://player.vimeo.com/video/1184594647?autoplay=1&loop=1&muted=1&background=1&autopause=0&dnt=1"
          frameborder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowfullscreen
          title="SellCov">
        </iframe>
      </div>
    </div>
  </div>
</section>

<section class="page" id="how" style="padding-top:40px">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="how_kicker">Comment ça marche</div>
    <h2 class="section-title serif"><span data-i18n="how_t1">Trois modules,</span><br><span class="italic" data-i18n="how_t2">une seule mission.</span></h2>
    <p class="section-sub nowrap" data-i18n="how_sub">De l'annonce à la défense en cas de litige, SellCov t'accompagne sur chaque étape d'une vente.</p>
  </div>
  <div class="features">
    <div class="feature feature-violet reveal">
      <span class="tag" data-i18n="f1_tag">Annonce</span>
      <h3 class="serif"><span data-i18n="f1_h1">Génère ton annonce</span><br><span class="italic" data-i18n="f1_h2">en 10 secondes.</span></h3>
      <p data-i18n="f1_p">Photographiez l'article, recevez une annonce rédigée et prête à publier.</p>
      <div class="cta-area"><a href="/annonce" class="btn btn-violet btn-sm" data-i18n="f1_btn">Essayer</a><span style="color:var(--text-dim);font-size:13px" data-i18n="f1_time">~10 sec par annonce</span></div>
    </div>
    <div class="feature feature-green reveal">
      <span class="tag" data-i18n="f2_tag">Protection</span>
      <h3 class="serif"><span data-i18n="f2_h1">Certifie avant</span><br><span class="italic" data-i18n="f2_h2">d'expédier.</span></h3>
      <p data-i18n="f2_p">Trois minutes de vidéo horodatée couvrant l'article, le colis fermé et l'étiquette d'expédition. Chaque capture reçoit un certificat cryptographique unique, archivé pendant 3 mois. Une preuve recevable en cas de litige.</p>
      <div class="cta-area"><a href="/protection" class="btn btn-green btn-sm" data-i18n="f2_btn">Protéger</a><span style="color:var(--text-dim);font-size:13px" data-i18n="f2_time">~3 min par envoi</span></div>
    </div>
    <div class="feature feature-pink reveal">
      <span class="tag" data-i18n="f3_tag">Litige</span>
      <h3 class="serif"><span data-i18n="f3_h1">Défense automatique.</span><br><span class="italic" data-i18n="f3_h2">En 1 clic.</span></h3>
      <p data-i18n="f3_p">Dossier de défense généré automatiquement, prêt à transmettre au service litiges.</p>
      <div class="cta-area"><a href="/litige" class="btn btn-pink btn-sm" data-i18n="f3_btn">Gérer un litige</a><span style="color:var(--text-dim);font-size:13px" data-i18n="f3_time">~30 sec de rédaction</span></div>
    </div>
  </div>
</section>

<section class="page" id="scams" style="background:linear-gradient(180deg,transparent,rgba(245,112,170,.02),transparent)">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="sc_kicker">Les arnaques que tu vas rencontrer</div>
    <h2 class="section-title serif"><span data-i18n="sc_t1">Les 5 arnaques qui coûtent</span><br><span class="italic" data-i18n="sc_t2">le plus cher aux vendeurs.</span></h2>
    <p class="section-sub" data-i18n="sc_sub">Chaque année, de nombreux vendeurs particuliers perdent de l'argent à cause de litiges mal gérés. Voici les scénarios les plus fréquents et la façon dont SellCov vous protège.</p>
  </div>
  <div class="scams">
    <div class="scam-card reveal">
      <span class="scam-label" data-i18n="s1_title">Arnaque n°1 · Colis "jamais reçu"</span>
      <div class="scam-quote" data-i18n="s1_quote">« Je n'ai jamais reçu le colis. Je demande un remboursement. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="s1_solve"><strong style="color:#fff">SellCov affiche</strong> la vidéo horodatée du dépôt en bureau de poste, le numéro de suivi et l'étiquette filmée. Défense envoyée en 30 secondes.</span></div>
    </div>
    <div class="scam-card reveal">
      <span class="scam-label" data-i18n="s2_title">Arnaque n°2 · Article "abîmé"</span>
      <div class="scam-quote" data-i18n="s2_quote">« L'article est arrivé troué. Je veux être remboursé. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="s2_solve"><strong style="color:#fff">SellCov prouve</strong> l'état exact avant expédition grâce à la vidéo 360° horodatée. L'IA compare les photos de l'acheteur et détecte les incohérences.</span></div>
    </div>
    <div class="scam-card reveal">
      <span class="scam-label" data-i18n="s3_title">Arnaque n°3 · Substitution</span>
      <div class="scam-quote" data-i18n="s3_quote">« Ce n'est pas l'article que j'ai commandé. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="s3_solve"><strong style="color:#fff">SellCov atteste</strong> le contenu exact du colis au moment de la fermeture. Marque, taille, couleur, détails, tout est filmé.</span></div>
    </div>
    <div class="scam-card reveal">
      <span class="scam-label" data-i18n="s4_title">Arnaque n°4 · Colis "vide"</span>
      <div class="scam-quote" data-i18n="s4_quote">« Le colis est arrivé vide sans l'article principal. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="s4_solve"><strong style="color:#fff">SellCov enregistre</strong> l'article placé dans le colis puis le colis fermé avec scotch sécurisé, en une seule prise vidéo.</span></div>
    </div>
    <div class="scam-card reveal" style="grid-column:1/-1">
      <span class="scam-label" data-i18n="s5_title">Arnaque n°5 · "Ce n'est pas authentique"</span>
      <div class="scam-quote" data-i18n="s5_quote">« Le produit est une contrefaçon, je signale à la plateforme. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="s5_solve"><strong style="color:#fff">SellCov horodate</strong> les codes produit, étiquettes d'authenticité, factures d'achat. En cas de litige, tu joins le tout à ta défense automatique en un clic.</span></div>
    </div>
  </div>
</section>

<section class="page">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="pr_kicker">Les garanties techniques</div>
    <h2 class="section-title serif"><span data-i18n="pr_t1">Ce qui tient</span><br><span class="italic" data-i18n="pr_t2">en cas de litige.</span></h2>
  </div>
  <div class="proof">
    <div class="proof-stats">
      <div class="stat reveal"><div class="stat-big serif">3 min</div><div class="stat-label" data-i18n="pr_s1">par vente sécurisée</div></div>
      <div class="stat reveal"><div class="stat-big serif" style="color:var(--green)">SHA-256</div><div class="stat-label" data-i18n="pr_s2">norme cryptographique certifiée</div></div>
      <div class="stat reveal"><div class="stat-big serif" style="color:var(--violet)">3 mois</div><div class="stat-label" data-i18n="pr_s3">d'archivage sécurisé en France</div></div>
    </div>
  </div>
</section>

<section class="page" id="pricing" style="background:linear-gradient(180deg,transparent,rgba(94,232,163,.02),transparent)">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="pl_kicker">Nos offres</div>
    <h2 class="section-title serif"><span data-i18n="pl_t1">Simple,</span><br><span class="italic" data-i18n="pl_t2">sans surprise.</span></h2>
    <p class="section-sub" data-i18n="pl_sub">Les 50 premiers vendeurs bénéficient du tarif Early Adopter. Tarif bloqué 1 an. Aucun engagement, annulable en 1 clic.</p>
  </div>
  <div class="pricing">
    <div class="plan reveal">
      <h4 data-i18n="p1_name">Bêta</h4>
      <div class="plan-price">0 € <small data-i18n="per_mo">/ mois</small></div>
      <p class="plan-desc" data-i18n="p1_desc">Accès complet pendant la phase de lancement.</p>
      <ul>
        <li data-i18n="p1_f1">Certificats vidéo illimités</li>
        <li data-i18n="p1_f2">IA défense automatique</li>
        <li data-i18n="p1_f3">Génération d'annonces</li>
        <li data-i18n="p1_f4">Support email</li>
      </ul>
      <a href="/compte" class="btn btn-ghost" data-i18n="p1_btn">Démarrer gratuitement</a>
    </div>
    <div class="plan featured reveal">
      <span class="plan-ribbon" data-i18n="p2_ribbon">★ Recommandé</span>
      <h4 data-i18n="p2_name">Early Adopter</h4>
      <div class="plan-price">4,90 € <small data-i18n="per_mo">/ mois</small></div>
      <p class="plan-desc" data-i18n="p2_desc">Réservé aux 50 premiers. Tarif garanti 1 an.</p>
      <ul>
        <li data-i18n="p2_f1">Tout du plan Bêta</li>
        <li data-i18n="p2_f2">Historique 3 mois</li>
        <li data-i18n="p2_f3">Certificats prioritaires</li>
        <li data-i18n="p2_f4">Réponse email sous 24h</li>
        <li data-i18n="p2_f5">Accès aux nouvelles fonctionnalités en avant-première</li>
      </ul>
      <a href="/compte" class="btn btn-primary" id="early-adopter-btn" data-i18n="p2_btn">Réserver ma place</a>
      <p id="spots-left" style="font-size:12px;color:var(--green);margin-top:8px;text-align:center;min-height:18px"></p>
    </div>
    <div class="plan reveal">
      <h4 data-i18n="p3_name">Pro Power Seller</h4>
      <div class="plan-price">19,90 € <small data-i18n="per_mo">/ mois</small></div>
      <p class="plan-desc" data-i18n="p3_desc">Pour les vendeurs qui font +50 ventes/mois.</p>
      <ul>
        <li data-i18n="p3_f1">Tout du plan Early Adopter</li>
        <li data-i18n="p3_f2">Tableau de bord : ventes certifiées, litiges, économies</li>
        <li data-i18n="p3_f3">Gestion unifiée sur vos plateformes de vente en ligne</li>
      </ul>
      <a href="/compte" class="btn btn-ghost" data-i18n="p3_btn">Passer au Pro</a>
    </div>
  </div>
</section>

<section class="page" id="faq">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="fq_kicker">FAQ</div>
    <h2 class="section-title serif"><span data-i18n="fq_t1">Questions</span><br><span class="italic" data-i18n="fq_t2">fréquentes.</span></h2>
  </div>
  <div class="faq">
    <details class="faq-item"><summary class="faq-q" data-i18n="q1">Ma preuve vidéo a-t-elle une valeur juridique ?</summary><p class="faq-a" data-i18n="a1">Oui. Chaque vidéo est horodatée via un hash cryptographique SHA-256. Elle constitue un élément de preuve recevable. La plupart des plateformes acceptent les preuves vidéo dans leur médiation interne.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="q2">Est-ce que ça fonctionne vraiment avec Vinted et Leboncoin ?</summary><p class="faq-a" data-i18n="a2">Oui. SellCov est indépendant de la plateforme. Tu génères une preuve vidéo horodatée soumissible sur n'importe quelle marketplace.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="q3">Combien de temps ça prend par envoi ?</summary><p class="faq-a" data-i18n="a3">Entre 2 et 3 minutes. Tu filmes l'article, le colis fermé, l'étiquette. L'application te guide étape par étape.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="q4">Mes vidéos sont-elles privées ?</summary><p class="faq-a" data-i18n="a4">Totalement. Tes vidéos sont chiffrées, stockées sur des serveurs européens (RGPD), accessibles uniquement depuis ton compte.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="q5">Que se passe-t-il après la bêta gratuite ?</summary><p class="faq-a" data-i18n="a5">Les 50 premiers inscrits conservent le tarif Early Adopter à 4,90 €/mois, garanti 1 an. Tu seras prévenu 30 jours avant la fin de la bêta.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="q6">Ça fonctionne avec Leboncoin, Depop et les autres ?</summary><p class="faq-a" data-i18n="a6">Oui. SellCov fonctionne sur Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Facebook Marketplace, toutes les plateformes d'occasion.</p></details>
    <details class="faq-item"><summary class="faq-q" data-i18n="q7">Que se passe-t-il si la défense automatique échoue ?</summary><p class="faq-a" data-i18n="a7">SellCov te fournit une preuve vidéo horodatée, certifiée SHA-256, recevable en médiation. Cette preuve est solide et reconnue. Elle maximise tes chances, mais ne garantit pas un résultat favorable à 100%. La décision finale appartient à la plateforme ou au tribunal.</p></details>
  </div>
</section>

<section class="page" style="padding-top:40px">
  <div class="magnet reveal">
    <div>
      <div class="magnet-kicker" data-i18n="mg_kicker">Guide gratuit</div>
      <h3 data-i18n="mg_title">Les 5 arnaques Vinted qui coûtent le plus cher (et comment les éviter).</h3>
      <p data-i18n="mg_desc">Cas concrets, réponses types prêtes à copier-coller. Reçois le guide gratuitement par email.</p>
      <form class="magnet-form" id="lead-form" onsubmit="window.submitLeadForm(event)">
        <input type="email" id="lead-email" required placeholder="Ton email" data-i18n-ph="mg_ph" />
        <button type="submit" class="btn btn-primary" id="lead-btn" data-i18n="mg_btn">Recevoir le guide</button>
      </form>
      <p id="lead-msg" style="color:var(--green);font-size:13px;margin-top:10px;display:none" data-i18n="mg_ok">Guide envoyé ! Vérifie ta boîte mail.</p>
      <small style="color:var(--text-dim);font-size:12px;display:block;margin-top:12px" data-i18n="mg_legal">Pas de spam. Désabonnement en 1 clic.</small>
    </div>
    <div class="magnet-visual">
      <div class="magnet-pdf">5</div>
      <small data-i18n="mg_visual">5 arnaques · guide gratuit</small>
    </div>
  </div>
</section>

<section class="final" id="cta">
  <h2 class="serif"><span data-i18n="fin_t1">Protège ton argent</span><br><span class="italic" data-i18n="fin_t2">maintenant.</span></h2>
  <p data-i18n="fin_sub">Chaque vente non protégée est un risque.</p>
  <a href="/protection" class="btn btn-primary" style="padding:16px 32px;font-size:16px" data-i18n="fin_cta">Essayer gratuitement →</a>
  <div class="platforms" style="margin-top:34px"><strong>Vinted</strong>·<strong>Leboncoin</strong>·<strong>Depop</strong>·<strong>Grailed</strong>·<strong>Vestiaire Collective</strong>·<strong>Etsy</strong></div>
</section>

<footer>
  <div class="foot">
    <div class="logo"><span class="logo-mark">sc</span>SellCov</div>
    <div class="foot-links">
      <a href="#faq" data-i18n="fq_kicker">FAQ</a>
      <a href="mailto:hello@sellcov.com" data-i18n="ft_contact">Contact</a>
      <a href="#" aria-label="Instagram (à venir)">Instagram</a>
      <a href="#" aria-label="TikTok (à venir)">TikTok</a>
      <a href="/cgu" data-i18n="ft_legal">Mentions légales</a>
      <a href="/cgu" data-i18n="ft_cgu">CGU</a>
      <a href="/confidentialite" data-i18n="ft_priv">Confidentialité</a>
    </div>
    <div class="foot-copy">© 2026 SellCov</div>
  </div>
</footer>
`;

const I18N = {
  fr:{
    nav_how:"Comment",nav_why:"Pourquoi",nav_pricing:"Tarifs",nav_faq:"FAQ",nav_cta:"Essayer gratuit",
    badge:"Bêta ouverte · Accès gratuit",
    hero_h1_1:"Revends",hero_h1_2:"sans te faire arnaquer.",
    hero_sub:"Une preuve solide avant l'envoi. Un dossier complet en cas de litige.",
    hero_subsub:"Preuve horodatée. Défense automatique.",
    stat1:"Bêta ouverte",stat2:"Preuves certifiées",stat3:"Données chiffrées en France",
    hero_cta:"Protéger ma prochaine vente",
    how_kicker:"Comment ça marche",how_t1:"Trois modules,",how_t2:"une seule mission.",
    how_sub:"De l'annonce à la défense en cas de litige, SellCov t'accompagne sur chaque étape d'une vente.",
    f1_tag:"Annonce",f1_h1:"Génère ton annonce",f1_h2:"en 10 secondes.",f1_p:"Photographiez l'article, recevez une annonce rédigée et prête à publier.",f1_btn:"Essayer",f1_time:"~10 sec par annonce",
    f2_tag:"Protection",f2_h1:"Certifie avant",f2_h2:"d'expédier.",f2_p:"Trois minutes de vidéo horodatée couvrant l'article, le colis fermé et l'étiquette d'expédition. Chaque capture reçoit un certificat cryptographique unique, archivé pendant 3 mois. Une preuve recevable en cas de litige.",f2_btn:"Protéger",f2_time:"~3 min par envoi",
    f3_tag:"Litige",f3_h1:"Défense automatique.",f3_h2:"En 1 clic.",f3_p:"Dossier de défense généré automatiquement, prêt à transmettre au service litiges.",f3_btn:"Gérer un litige",f3_time:"~30 sec de rédaction",
    sc_kicker:"Les arnaques que tu vas rencontrer",sc_t1:"Les 5 arnaques qui coûtent",sc_t2:"le plus cher aux vendeurs.",sc_sub:"Chaque année, de nombreux vendeurs particuliers perdent de l'argent à cause de litiges mal gérés. Voici les scénarios les plus fréquents et la façon dont SellCov vous protège.",
    s1_title:"Arnaque n°1 · Colis \"jamais reçu\"",s1_quote:"« Je n'ai jamais reçu le colis. Je demande un remboursement. »",s1_solve:"<strong style='color:#fff'>SellCov affiche</strong> la vidéo horodatée du dépôt en bureau de poste, le numéro de suivi et l'étiquette filmée. Défense envoyée en 30 secondes.",
    s2_title:"Arnaque n°2 · Article \"abîmé\"",s2_quote:"« L'article est arrivé troué. Je veux être remboursé. »",s2_solve:"<strong style='color:#fff'>SellCov prouve</strong> l'état exact avant expédition grâce à la vidéo 360° horodatée. L'IA compare les photos de l'acheteur et détecte les incohérences.",
    s3_title:"Arnaque n°3 · Substitution",s3_quote:"« Ce n'est pas l'article que j'ai commandé. »",s3_solve:"<strong style='color:#fff'>SellCov atteste</strong> le contenu exact du colis au moment de la fermeture. Marque, taille, couleur, détails, tout est filmé.",
    s4_title:"Arnaque n°4 · Colis \"vide\"",s4_quote:"« Le colis est arrivé vide sans l'article principal. »",s4_solve:"<strong style='color:#fff'>SellCov enregistre</strong> l'article placé dans le colis puis le colis fermé avec scotch sécurisé, en une seule prise vidéo.",
    s5_title:"Arnaque n°5 · \"Ce n'est pas authentique\"",s5_quote:"« Le produit est une contrefaçon, je signale à la plateforme. »",s5_solve:"<strong style='color:#fff'>SellCov horodate</strong> les codes produit, étiquettes d'authenticité, factures d'achat. En cas de litige, tu joins le tout à ta défense en un clic.",
    pr_kicker:"Les garanties techniques",pr_t1:"Ce qui tient",pr_t2:"en cas de litige.",pr_s1:"par vente sécurisée",pr_s2:"norme cryptographique certifiée",pr_s3:"d'archivage sécurisé en France",
    pl_kicker:"Nos offres",pl_t1:"Simple,",pl_t2:"sans surprise.",pl_sub:"Les 50 premiers vendeurs bénéficient du tarif Early Adopter. Tarif bloqué 1 an. Aucun engagement, annulable en 1 clic.",
    per_mo:"/ mois",
    p1_name:"Bêta",p1_desc:"Accès complet pendant la phase de lancement.",p1_f1:"Certificats vidéo illimités",p1_f2:"IA défense automatique",p1_f3:"Génération d'annonces",p1_f4:"Support email",p1_btn:"Démarrer gratuitement",
    p2_ribbon:"★ Recommandé",p2_name:"Early Adopter",p2_desc:"Réservé aux 50 premiers. Tarif garanti 1 an.",p2_f1:"Tout du plan Bêta",p2_f2:"Historique 3 mois",p2_f3:"Certificats prioritaires",p2_f4:"Réponse email sous 24h",p2_f5:"Accès aux nouvelles fonctionnalités en avant-première",p2_btn:"Réserver ma place",
    p3_name:"Pro Power Seller",p3_desc:"Pour les vendeurs qui font +50 ventes/mois.",p3_f1:"Tout du plan Early Adopter",p3_f2:"Tableau de bord : ventes certifiées, litiges, économies",p3_f3:"Gestion unifiée sur vos plateformes de vente en ligne",p3_btn:"Passer au Pro",
    fq_kicker:"FAQ",fq_t1:"Questions",fq_t2:"fréquentes.",
    q1:"Ma preuve vidéo a-t-elle une valeur juridique ?",a1:"Oui. Chaque vidéo est horodatée via un hash cryptographique SHA-256. Elle constitue un élément de preuve recevable. La plupart des plateformes acceptent les preuves vidéo dans leur médiation interne.",
    q2:"Est-ce que ça fonctionne vraiment avec Vinted et Leboncoin ?",a2:"Oui. SellCov est indépendant de la plateforme. Tu génères une preuve vidéo horodatée soumissible sur n'importe quelle marketplace.",
    q3:"Combien de temps ça prend par envoi ?",a3:"Entre 2 et 3 minutes. Tu filmes l'article, le colis fermé, l'étiquette. L'application te guide étape par étape.",
    q4:"Mes vidéos sont-elles privées ?",a4:"Totalement. Tes vidéos sont chiffrées, stockées sur des serveurs européens (RGPD), accessibles uniquement depuis ton compte.",
    q5:"Que se passe-t-il après la bêta gratuite ?",a5:"Les 50 premiers inscrits conservent le tarif Early Adopter à 4,90 €/mois, garanti 1 an. Tu seras prévenu 30 jours avant la fin de la bêta.",
    q6:"Ça fonctionne avec Leboncoin, Depop et les autres ?",a6:"Oui. SellCov fonctionne sur Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Facebook Marketplace, toutes les plateformes d'occasion.",
    q7:"Que se passe-t-il si la défense automatique échoue ?",a7:"SellCov te fournit une preuve vidéo horodatée, certifiée SHA-256, recevable en médiation. Cette preuve est solide et reconnue. Elle maximise tes chances, mais ne garantit pas un résultat favorable à 100%. La décision finale appartient à la plateforme ou au tribunal.",
    mg_kicker:"Guide gratuit",mg_title:"Les 5 arnaques Vinted qui coûtent le plus cher (et comment les éviter).",mg_desc:"Cas concrets, réponses types prêtes à copier-coller. Reçois le guide gratuitement par email.",mg_btn:"Recevoir le guide",mg_ok:"Guide envoyé ! Vérifie ta boîte mail.",mg_legal:"Pas de spam. Désabonnement en 1 clic.",mg_visual:"5 arnaques · guide gratuit",mg_ph:"Ton email",
    fin_t1:"Protège ton argent",fin_t2:"maintenant.",fin_sub:"Chaque vente non protégée est un risque.",fin_cta:"Essayer gratuitement →",
    ft_contact:"Contact",ft_legal:"Mentions légales",ft_cgu:"CGU",ft_priv:"Confidentialité"
  },
  en:{
    nav_how:"How it works",nav_why:"Why",nav_pricing:"Pricing",nav_faq:"FAQ",nav_cta:"Try for free",
    badge:"Open Beta · Free access",hero_h1_1:"Sell",hero_h1_2:"without getting scammed.",
    hero_sub:"Solid proof before shipping. Full case file for any dispute.",hero_subsub:"Timestamped proof. Automatic defence.",
    stat1:"Open Beta",stat2:"Certified proofs",stat3:"Data encrypted in France",hero_cta:"Protect my next sale",
    how_kicker:"How it works",how_t1:"Three modules,",how_t2:"one mission.",how_sub:"From listing to dispute defence, SellCov covers every step of your sale.",
    f1_tag:"Listing",f1_h1:"Generate your listing",f1_h2:"in 10 seconds.",f1_p:"Photograph the item, receive a written listing ready to publish.",f1_btn:"Try it",f1_time:"~10 sec per listing",
    f2_tag:"Protection",f2_h1:"Certify before",f2_h2:"shipping.",f2_p:"Three minutes of timestamped video covering the item, the sealed parcel and the shipping label. Each recording gets a unique cryptographic certificate, archived for 3 months. Admissible proof for any dispute.",f2_btn:"Protect",f2_time:"~3 min per shipment",
    f3_tag:"Dispute",f3_h1:"Automatic defence.",f3_h2:"In 1 click.",f3_p:"Defence file auto-generated, ready to send to the platform's dispute team.",f3_btn:"Handle dispute",f3_time:"~30 sec to write",
    sc_kicker:"Scams you will encounter",sc_t1:"The 5 scams that cost",sc_t2:"sellers the most.",sc_sub:"Every year, many private sellers lose money due to poorly handled disputes. Here are the most common scenarios and how SellCov protects you.",
    s1_title:"Scam #1 · Parcel \"never received\"",s1_quote:"\"I never received the parcel. I'm requesting a refund.\"",s1_solve:"<strong style='color:#fff'>SellCov shows</strong> the timestamped video of drop-off at the post office, the tracking number and the filmed label. Defence sent in 30 seconds.",
    s2_title:"Scam #2 · Item \"damaged\"",s2_quote:"\"The item arrived with a hole. I want a refund.\"",s2_solve:"<strong style='color:#fff'>SellCov proves</strong> the exact condition before shipping via 360° timestamped video. AI compares the buyer's photos and detects inconsistencies.",
    s3_title:"Scam #3 · Substitution",s3_quote:"\"This is not the item I ordered.\"",s3_solve:"<strong style='color:#fff'>SellCov certifies</strong> the exact contents of the parcel at the time of sealing. Brand, size, colour, details, all filmed.",
    s4_title:"Scam #4 · Empty parcel",s4_quote:"\"The parcel arrived empty without the main item.\"",s4_solve:"<strong style='color:#fff'>SellCov records</strong> the item being placed in the parcel and the parcel sealed with security tape, in one continuous video.",
    s5_title:"Scam #5 · \"It's not authentic\"",s5_quote:"\"The product is a fake, I'm reporting it to the platform.\"",s5_solve:"<strong style='color:#fff'>SellCov timestamps</strong> product codes, authenticity labels, purchase receipts. Attach everything to your auto-generated defence in one click.",
    pr_kicker:"Technical guarantees",pr_t1:"What holds up",pr_t2:"in a dispute.",pr_s1:"per secured sale",pr_s2:"certified cryptographic standard",pr_s3:"secure archiving in France",
    pl_kicker:"Our plans",pl_t1:"Simple,",pl_t2:"no surprises.",pl_sub:"The first 50 sellers get the Early Adopter rate. Price locked for 1 year. No commitment, cancel anytime.",
    per_mo:"/ month",
    p1_name:"Beta",p1_desc:"Full access during the launch phase.",p1_f1:"Unlimited video certificates",p1_f2:"AI automatic defence",p1_f3:"Listing generation",p1_f4:"Email support",p1_btn:"Start for free",
    p2_ribbon:"★ Recommended",p2_name:"Early Adopter",p2_desc:"Reserved for the first 50. Rate locked for 1 year.",p2_f1:"Everything in Beta",p2_f2:"3-month history",p2_f3:"Priority certificates",p2_f4:"Email reply within 24h",p2_f5:"Early access to new features",p2_btn:"Reserve my spot",
    p3_name:"Pro Power Seller",p3_desc:"For sellers with 50+ sales/month.",p3_f1:"Everything in Early Adopter",p3_f2:"Dashboard: certified sales, disputes, savings",p3_f3:"Unified management across your selling platforms",p3_btn:"Go Pro",
    fq_kicker:"FAQ",fq_t1:"Frequently asked",fq_t2:"questions.",
    q1:"Does my video proof have legal value?",a1:"Yes. Each video is timestamped via a SHA-256 hash. It constitutes admissible evidence. Most platforms accept video proof in their internal mediation.",
    q2:"Does it really work with Vinted and Leboncoin?",a2:"Yes. SellCov is platform-independent. You generate a timestamped video proof submissible to any marketplace.",
    q3:"How long does it take per shipment?",a3:"Between 2 and 3 minutes. You film the item, the sealed parcel, the label. The app guides you step by step.",
    q4:"Are my videos private?",a4:"Completely. Your videos are encrypted, stored on European servers (GDPR), accessible only from your account.",
    q5:"What happens after the free beta?",a5:"The first 50 sign-ups keep the Early Adopter rate at €4.90/month, guaranteed for 1 year. You'll be notified 30 days before the beta ends.",
    q6:"Does it work with Leboncoin, Depop and others?",a6:"Yes. SellCov works on Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Facebook Marketplace, any second-hand platform.",
    q7:"What if the automatic defence fails?",a7:"SellCov provides a timestamped, SHA-256 certified video proof, admissible in mediation. This proof is solid and recognised. It maximises your chances, but cannot guarantee a 100% favourable outcome. The final decision belongs to the platform or court.",
    mg_kicker:"Free guide",mg_title:"The 5 Vinted scams that cost the most (and how to avoid them).",mg_desc:"Real cases, ready-to-copy reply templates. Receive the guide free by email.",mg_btn:"Get the guide",mg_ok:"Guide sent! Check your inbox.",mg_legal:"No spam. Unsubscribe in 1 click.",mg_visual:"5 scams · free guide",mg_ph:"Your email",
    fin_t1:"Protect your money",fin_t2:"now.",fin_sub:"Every unprotected sale is a risk.",fin_cta:"Try for free →",
    ft_contact:"Contact",ft_legal:"Legal notice",ft_cgu:"T&Cs",ft_priv:"Privacy"
  },
  es:{
    nav_how:"Cómo funciona",nav_why:"Por qué",nav_pricing:"Precios",nav_faq:"FAQ",nav_cta:"Probar gratis",
    badge:"Beta abierta · Acceso gratuito",hero_h1_1:"Vende",hero_h1_2:"sin que te estafen.",
    hero_sub:"Prueba sólida antes del envío. Expediente completo en caso de litigio.",hero_subsub:"Prueba con marca de tiempo. Defensa automática.",
    stat1:"Beta abierta",stat2:"Pruebas certificadas",stat3:"Datos cifrados en Francia",hero_cta:"Proteger mi próxima venta",
    how_kicker:"Cómo funciona",how_t1:"Tres módulos,",how_t2:"una sola misión.",how_sub:"Del anuncio a la defensa en caso de litigio, SellCov te acompaña en cada etapa.",
    f1_tag:"Anuncio",f1_h1:"Genera tu anuncio",f1_h2:"en 10 segundos.",f1_p:"Fotografía el artículo, recibe un anuncio redactado listo para publicar.",f1_btn:"Probar",f1_time:"~10 seg por anuncio",
    f2_tag:"Protección",f2_h1:"Certifica antes",f2_h2:"de enviar.",f2_p:"Tres minutos de video con marca de tiempo del artículo, paquete cerrado y etiqueta. Certificado criptográfico único, archivado 3 meses.",f2_btn:"Proteger",f2_time:"~3 min por envío",
    f3_tag:"Litigio",f3_h1:"Defensa automática.",f3_h2:"Con 1 clic.",f3_p:"Expediente de defensa generado automáticamente, listo para enviar al servicio de litigios.",f3_btn:"Gestionar litigio",f3_time:"~30 seg de redacción",
    sc_kicker:"Las estafas que vas a encontrar",sc_t1:"Las 5 estafas que más cuestan",sc_t2:"a los vendedores.",sc_sub:"Cada año, muchos vendedores particulares pierden dinero por litigios mal gestionados. Aquí los escenarios más frecuentes y cómo SellCov te protege.",
    s1_title:"Estafa n°1 · Paquete \"nunca recibido\"",s1_quote:"\"Nunca recibí el paquete. Solicito un reembolso.\"",s1_solve:"<strong style='color:#fff'>SellCov muestra</strong> el video del depósito en correos, el número de seguimiento y la etiqueta filmada.",
    s2_title:"Estafa n°2 · Artículo \"dañado\"",s2_quote:"\"El artículo llegó con un agujero. Quiero un reembolso.\"",s2_solve:"<strong style='color:#fff'>SellCov prueba</strong> el estado exacto antes del envío mediante video 360° con marca de tiempo.",
    s3_title:"Estafa n°3 · Sustitución",s3_quote:"\"Esto no es el artículo que pedí.\"",s3_solve:"<strong style='color:#fff'>SellCov certifica</strong> el contenido exacto del paquete en el momento del cierre.",
    s4_title:"Estafa n°4 · Paquete \"vacío\"",s4_quote:"\"El paquete llegó vacío sin el artículo principal.\"",s4_solve:"<strong style='color:#fff'>SellCov graba</strong> el artículo siendo colocado y el paquete sellado en una sola toma.",
    s5_title:"Estafa n°5 · \"No es auténtico\"",s5_quote:"\"El producto es una falsificación, lo denuncio a la plataforma.\"",s5_solve:"<strong style='color:#fff'>SellCov marca</strong> los códigos de producto, etiquetas de autenticidad y facturas de compra.",
    pr_kicker:"Garantías técnicas",pr_t1:"Lo que resiste",pr_t2:"en un litigio.",pr_s1:"por venta asegurada",pr_s2:"norma criptográfica certificada",pr_s3:"archivo seguro en Francia",
    pl_kicker:"Nuestros planes",pl_t1:"Simple,",pl_t2:"sin sorpresas.",pl_sub:"Los primeros 50 vendedores se benefician de la tarifa Early Adopter. Precio bloqueado 1 año. Sin compromiso.",
    per_mo:"/ mes",
    p1_name:"Beta",p1_desc:"Acceso completo durante la fase de lanzamiento.",p1_f1:"Certificados de video ilimitados",p1_f2:"IA defensa automática",p1_f3:"Generación de anuncios",p1_f4:"Soporte por email",p1_btn:"Empezar gratis",
    p2_ribbon:"★ Recomendado",p2_name:"Early Adopter",p2_desc:"Reservado para los 50 primeros. Tarifa garantizada 1 año.",p2_f1:"Todo del plan Beta",p2_f2:"Historial 3 meses",p2_f3:"Certificados prioritarios",p2_f4:"Respuesta email en 24h",p2_f5:"Acceso anticipado a nuevas funciones",p2_btn:"Reservar mi lugar",
    p3_name:"Pro Power Seller",p3_desc:"Para vendedores con +50 ventas/mes.",p3_f1:"Todo del plan Early Adopter",p3_f2:"Panel: ventas certificadas, litigios, ahorros",p3_f3:"Gestión unificada en tus plataformas de venta",p3_btn:"Ir al Pro",
    fq_kicker:"FAQ",fq_t1:"Preguntas",fq_t2:"frecuentes.",
    q1:"¿Tiene valor legal mi prueba en video?",a1:"Sí. Cada video tiene marca de tiempo mediante hash SHA-256. Constituye prueba admisible en mediación.",
    q2:"¿Funciona realmente con Vinted y Leboncoin?",a2:"Sí. SellCov es independiente de la plataforma. Generas una prueba en video para cualquier marketplace.",
    q3:"¿Cuánto tiempo tarda por envío?",a3:"Entre 2 y 3 minutos. Filmas el artículo, el paquete cerrado, la etiqueta. La aplicación te guía paso a paso.",
    q4:"¿Mis videos son privados?",a4:"Completamente. Cifrados, almacenados en servidores europeos (RGPD), accesibles solo desde tu cuenta.",
    q5:"¿Qué pasa después de la beta gratuita?",a5:"Los primeros 50 inscritos mantienen la tarifa Early Adopter a 4,90 €/mes, garantizada 1 año.",
    q6:"¿Funciona con Leboncoin, Depop y otros?",a6:"Sí. SellCov funciona en Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Facebook Marketplace.",
    q7:"¿Qué pasa si la defensa automática falla?",a7:"SellCov te proporciona una prueba sólida y certificada. Maximiza tus posibilidades, pero no garantiza un resultado al 100%. La decisión final corresponde a la plataforma o tribunal.",
    mg_kicker:"Guía gratuita",mg_title:"Las 5 estafas de Vinted que más cuestan (y cómo evitarlas).",mg_desc:"Casos reales, respuestas tipo listas para copiar. Recibe la guía gratis por email.",mg_btn:"Recibir la guía",mg_ok:"¡Guía enviada! Revisa tu correo.",mg_legal:"Sin spam. Cancelar con 1 clic.",mg_visual:"5 estafas · guía gratuita",mg_ph:"Tu email",
    fin_t1:"Protege tu dinero",fin_t2:"ahora.",fin_sub:"Cada venta sin protección es un riesgo.",fin_cta:"Probar gratis →",
    ft_contact:"Contacto",ft_legal:"Aviso legal",ft_cgu:"T&C",ft_priv:"Privacidad"
  },
  de:{
    nav_how:"Wie es funktioniert",nav_why:"Warum",nav_pricing:"Preise",nav_faq:"FAQ",nav_cta:"Kostenlos testen",
    badge:"Offene Beta · Kostenloser Zugang",hero_h1_1:"Verkaufe",hero_h1_2:"ohne betrogen zu werden.",
    hero_sub:"Solider Beweis vor dem Versand. Vollständige Akte bei Streitigkeiten.",hero_subsub:"Zeitgestempelter Beweis. Automatische Verteidigung.",
    stat1:"Offene Beta",stat2:"Zertifizierte Beweise",stat3:"Daten verschlüsselt in Frankreich",hero_cta:"Meinen nächsten Verkauf schützen",
    how_kicker:"Wie es funktioniert",how_t1:"Drei Module,",how_t2:"eine einzige Mission.",how_sub:"Von der Anzeige bis zur Streitverteidigung begleitet SellCov jeden Schritt.",
    f1_tag:"Anzeige",f1_h1:"Erstelle deine Anzeige",f1_h2:"in 10 Sekunden.",f1_p:"Fotografiere den Artikel, erhalte eine fertige Anzeige zum Veröffentlichen.",f1_btn:"Ausprobieren",f1_time:"~10 Sek. pro Anzeige",
    f2_tag:"Schutz",f2_h1:"Zertifiziere vor",f2_h2:"dem Versand.",f2_p:"Drei Minuten zeitgestempeltes Video des Artikels, versiegelten Pakets und Versandetiketts. Kryptographisches Zertifikat, 3 Monate archiviert.",f2_btn:"Schützen",f2_time:"~3 Min. pro Versand",
    f3_tag:"Streit",f3_h1:"Automatische Verteidigung.",f3_h2:"Mit 1 Klick.",f3_p:"Automatisch generierte Verteidigungsakte, bereit zum Weiterleiten.",f3_btn:"Streit bearbeiten",f3_time:"~30 Sek. zum Schreiben",
    sc_kicker:"Betrugsmaschen die du antreffen wirst",sc_t1:"Die 5 teuersten Betrugsmaschen",sc_t2:"für Verkäufer.",sc_sub:"Jedes Jahr verlieren viele Privatverkäufer Geld durch schlecht verwaltete Streitigkeiten.",
    s1_title:"Betrug Nr.1 · Paket \"nie erhalten\"",s1_quote:"\"Ich habe das Paket nie erhalten. Ich fordere eine Rückerstattung.\"",s1_solve:"<strong style='color:#fff'>SellCov zeigt</strong> das zeitgestempelte Video der Paketabgabe, die Sendungsnummer und das gefilmte Etikett.",
    s2_title:"Betrug Nr.2 · Artikel \"beschädigt\"",s2_quote:"\"Der Artikel kam mit einem Loch an. Ich möchte eine Rückerstattung.\"",s2_solve:"<strong style='color:#fff'>SellCov beweist</strong> den genauen Zustand vor dem Versand per 360°-Video.",
    s3_title:"Betrug Nr.3 · Substitution",s3_quote:"\"Das ist nicht der Artikel, den ich bestellt habe.\"",s3_solve:"<strong style='color:#fff'>SellCov bestätigt</strong> den genauen Inhalt des Pakets beim Versiegeln.",
    s4_title:"Betrug Nr.4 · Leeres Paket",s4_quote:"\"Das Paket kam leer ohne den Hauptartikel an.\"",s4_solve:"<strong style='color:#fff'>SellCov zeichnet</strong> das Einlegen und Versiegeln in einer Videoaufnahme auf.",
    s5_title:"Betrug Nr.5 · \"Es ist nicht authentisch\"",s5_quote:"\"Das Produkt ist eine Fälschung, ich melde es der Plattform.\"",s5_solve:"<strong style='color:#fff'>SellCov stempelt</strong> Produktcodes, Echtheitsetiketten und Kaufbelege zeitlich.",
    pr_kicker:"Technische Garantien",pr_t1:"Was standhält",pr_t2:"bei einem Streit.",pr_s1:"pro gesichertem Verkauf",pr_s2:"zertifizierter kryptographischer Standard",pr_s3:"sichere Archivierung in Frankreich",
    pl_kicker:"Unsere Pläne",pl_t1:"Einfach,",pl_t2:"keine Überraschungen.",pl_sub:"Die ersten 50 Verkäufer erhalten den Early Adopter Tarif. Preis 1 Jahr gesperrt. Keine Bindung.",
    per_mo:"/ Monat",
    p1_name:"Beta",p1_desc:"Vollständiger Zugang während der Startphase.",p1_f1:"Unbegrenzte Videozertifikate",p1_f2:"KI automatische Verteidigung",p1_f3:"Anzeigengenerierung",p1_f4:"E-Mail-Support",p1_btn:"Kostenlos starten",
    p2_ribbon:"★ Empfohlen",p2_name:"Early Adopter",p2_desc:"Nur für die ersten 50. Tarif 1 Jahr garantiert.",p2_f1:"Alles aus Beta",p2_f2:"3 Monate Verlauf",p2_f3:"Prioritätszertifikate",p2_f4:"E-Mail-Antwort innerhalb 24h",p2_f5:"Frühzeitiger Zugang zu neuen Funktionen",p2_btn:"Platz reservieren",
    p3_name:"Pro Power Seller",p3_desc:"Für Verkäufer mit 50+ Verkäufen/Monat.",p3_f1:"Alles aus Early Adopter",p3_f2:"Dashboard: zertifizierte Verkäufe, Streitigkeiten, Ersparnisse",p3_f3:"Einheitliche Verwaltung Ihrer Verkaufsplattformen",p3_btn:"Zu Pro wechseln",
    fq_kicker:"FAQ",fq_t1:"Häufig gestellte",fq_t2:"Fragen.",
    q1:"Hat mein Videobeweis rechtlichen Wert?",a1:"Ja. Jedes Video wird via SHA-256-Hash zeitgestempelt. Es gilt als zulässiger Beweis in Mediationsverfahren.",
    q2:"Funktioniert es wirklich mit Vinted und Leboncoin?",a2:"Ja. SellCov ist plattformunabhängig. Du generierst einen zeitgestempelten Videobeweis für jeden Marktplatz.",
    q3:"Wie lange dauert es pro Versand?",a3:"2 bis 3 Minuten. Du filmst den Artikel, das versiegelte Paket, das Etikett. Die App führt dich Schritt für Schritt.",
    q4:"Sind meine Videos privat?",a4:"Vollständig. Verschlüsselt, auf europäischen Servern (DSGVO) gespeichert, nur von deinem Konto zugänglich.",
    q5:"Was passiert nach der kostenlosen Beta?",a5:"Die ersten 50 Anmeldungen behalten den Early Adopter Tarif bei 4,90 €/Monat, 1 Jahr garantiert.",
    q6:"Funktioniert es mit Leboncoin, Depop und anderen?",a6:"Ja. SellCov funktioniert auf Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Facebook Marketplace.",
    q7:"Was passiert wenn die automatische Verteidigung scheitert?",a7:"SellCov liefert einen soliden, zertifizierten Beweis. Er maximiert deine Chancen, garantiert aber kein 100% positives Ergebnis. Die endgültige Entscheidung trifft die Plattform oder das Gericht.",
    mg_kicker:"Kostenloser Leitfaden",mg_title:"Die 5 teuersten Vinted-Betrügereien (und wie man sie vermeidet).",mg_desc:"Echte Fälle, kopierfertige Antwortvorlagen. Erhalte den Leitfaden kostenlos per E-Mail.",mg_btn:"Leitfaden erhalten",mg_ok:"Leitfaden gesendet! Überprüfe dein Postfach.",mg_legal:"Kein Spam. Abmelden mit 1 Klick.",mg_visual:"5 Betrügereien · kostenlos",mg_ph:"Deine E-Mail",
    fin_t1:"Schütze dein Geld",fin_t2:"jetzt.",fin_sub:"Jeder ungeschützte Verkauf ist ein Risiko.",fin_cta:"Kostenlos testen →",
    ft_contact:"Kontakt",ft_legal:"Impressum",ft_cgu:"AGB",ft_priv:"Datenschutz"
  }
};

export default function Home() {
  useEffect(() => {
    // Intersection observer for reveal animations
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    // Translation engine
    function setLang(lang) {
      const t = I18N[lang];
      if (!t) return;
      localStorage.setItem('sellcov_lang', lang);
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el.innerHTML = t[key];
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (t[key] !== undefined) el.placeholder = t[key];
      });
      const sel = document.getElementById('lang-select');
      if (sel) sel.value = lang;
    }
    window.setLang = setLang;

    // Lead magnet form
    window.submitLeadForm = async function(e) {
      e.preventDefault();
      const email = document.getElementById('lead-email').value;
      const btn = document.getElementById('lead-btn');
      const msg = document.getElementById('lead-msg');
      const orig = btn.textContent;
      btn.textContent = '...';
      btn.disabled = true;
      try {
        await fetch('/api/send-guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        msg.style.display = 'block';
        document.getElementById('lead-form').reset();
      } catch {
        btn.textContent = orig;
        btn.disabled = false;
      }
    };

    // Early Adopter counter
    async function checkSpots() {
      try {
        const res = await fetch('/api/early-adopter-count');
        const data = await res.json();
        const remaining = Math.max(0, 50 - (data.count || 0));
        const el = document.getElementById('spots-left');
        const btn = document.getElementById('early-adopter-btn');
        if (!el) return;
        if (remaining === 0) {
          el.textContent = 'Complet — toutes les places sont prises.';
          el.style.color = 'var(--pink)';
          if (btn) { btn.textContent = 'Complet'; btn.style.opacity = '0.5'; btn.style.pointerEvents = 'none'; }
        } else {
          el.textContent = remaining + ' place' + (remaining > 1 ? 's' : '') + ' restante' + (remaining > 1 ? 's' : '');
        }
      } catch {}
    }
    checkSpots();

    // Init language
    const saved = localStorage.getItem('sellcov_lang') || 'fr';
    setLang(saved);

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
        .lang-select{background:transparent;border:1px solid var(--border-strong);color:var(--text-muted);padding:7px 12px;border-radius:999px;font-size:13px;cursor:pointer;font-family:inherit}
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
        .hero>*{position:relative;z-index:1}
        .badge{display:inline-flex;align-items:center;gap:8px;background:rgba(94,232,163,.08);border:1px solid rgba(94,232,163,.25);padding:7px 14px;border-radius:999px;font-size:13px;color:var(--green);margin-bottom:40px}
        .badge .dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green)}
        .h1{font-size:clamp(48px,8vw,104px);line-height:.95;letter-spacing:-.03em;margin-bottom:18px}
        .h1 .italic{display:block;font-size:.92em}
        .hero-sub{font-size:clamp(15px,1.5vw,18px);color:#fff;max-width:900px;margin:0 auto 10px;line-height:1.45;white-space:nowrap}
        .hero-subsub{color:var(--text-muted);max-width:600px;margin:0 auto 28px;font-size:15px}
        .hero-stats{display:inline-flex;gap:24px;padding:10px 20px;border:1px solid var(--border);border-radius:999px;margin-bottom:34px;font-size:13px;color:var(--text-muted);flex-wrap:wrap;justify-content:center}
        .hero-stats strong{color:#fff;font-weight:600}
        .cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:46px}
        .platforms{color:var(--text-dim);font-size:14px;letter-spacing:.02em}
        .platforms strong{color:var(--text-muted);font-weight:500;margin:0 4px}
        .demo{padding:40px 24px 80px;max-width:1100px;margin:0 auto;display:flex;justify-content:center}
        .phone-wrap{position:relative;width:100%;display:flex;justify-content:center;padding:30px 0 60px}
        .phone-wrap::before{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:550px;max-width:100%;background:radial-gradient(ellipse,rgba(94,232,163,.08) 0%,rgba(0,0,0,0) 70%);pointer-events:none;z-index:0;filter:blur(20px)}
        .phone-wrap::after{content:"";position:absolute;bottom:10px;left:50%;transform:translateX(-50%);width:70%;height:40px;background:radial-gradient(ellipse,rgba(0,0,0,.6) 0%,rgba(0,0,0,0) 70%);filter:blur(20px);z-index:0}
        .phone-frame{position:relative;width:100%;max-width:680px;aspect-ratio:19.5/9;background:linear-gradient(135deg,#2a2a2e 0%,#1a1a1d 25%,#0e0e10 50%,#1a1a1d 75%,#2a2a2e 100%);border-radius:52px;padding:11px;box-shadow:0 0 0 1.5px #3a3a3e,0 0 0 2.5px #0a0a0a,0 0 0 4px #2a2a2e,inset 0 2px 1px rgba(255,255,255,.08),inset 0 -2px 1px rgba(0,0,0,.5),0 50px 100px rgba(0,0,0,.7),0 20px 40px rgba(0,0,0,.5);z-index:1}
        .phone-frame::before{content:"";position:absolute;top:-2px;left:10%;right:10%;height:2px;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.25) 50%,transparent 100%);border-radius:1px;pointer-events:none;z-index:2}
        .phone-frame::after{content:"";position:absolute;inset:0;border-radius:52px;background:linear-gradient(180deg,rgba(255,255,255,.04) 0%,transparent 30%,transparent 70%,rgba(255,255,255,.02) 100%);pointer-events:none;z-index:2}
        .phone-screen{position:relative;width:100%;height:100%;background:#000;border-radius:42px;overflow:hidden;box-shadow:inset 0 0 0 1.5px #0a0a0a,inset 0 0 20px rgba(0,0,0,.5)}
        .phone-screen iframe{position:absolute;top:50%;left:50%;width:122%;height:122%;transform:translate(-50%,-50%);border:0}
        .phone-glare{position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(165deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,.02) 40%,transparent 100%);pointer-events:none;z-index:3;border-radius:42px 42px 0 0}
        .phone-island{position:absolute;left:18px;top:50%;transform:translateY(-50%);width:38px;height:126px;background:#000;border-radius:19px;z-index:4;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 0 8px rgba(0,0,0,.9);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:14px 0}
        .phone-island-cam{width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#3a5bbf 0%,#1a2045 40%,#000 75%);box-shadow:inset 0 0 3px rgba(100,130,230,.6),inset 0 0 0 1px rgba(0,0,0,.9),0 0 4px rgba(0,0,0,.6);position:relative}
        .phone-island-cam::after{content:"";position:absolute;top:20%;left:25%;width:25%;height:25%;border-radius:50%;background:rgba(255,255,255,.35);filter:blur(.5px)}
        .phone-island-sensor{width:7px;height:7px;border-radius:50%;background:radial-gradient(circle,#0a0a0a 30%,#000 70%);box-shadow:inset 0 0 2px rgba(60,60,80,.4)}
        .phone-btn{position:absolute;background:linear-gradient(180deg,#2d2d30 0%,#1c1c1e 50%,#2d2d30 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 1px 2px rgba(0,0,0,.6)}
        .phone-btn-mute{top:-4px;left:10%;width:30px;height:4px;border-radius:2px 2px 0 0}
        .phone-btn-volup{top:-4px;left:calc(10% + 42px);width:48px;height:4px;border-radius:2px 2px 0 0}
        .phone-btn-voldown{top:-4px;left:calc(10% + 102px);width:48px;height:4px;border-radius:2px 2px 0 0}
        .phone-btn-power{bottom:-4px;right:18%;width:72px;height:4px;border-radius:0 0 2px 2px}
        @media(max-width:820px){
          .phone-frame{border-radius:36px;padding:8px}
          .phone-screen{border-radius:28px}
          .phone-glare{border-radius:28px 28px 0 0}
          .phone-island{left:12px;width:26px;height:84px;border-radius:13px;padding:9px 0}
          .phone-island-cam{width:10px;height:10px}
          .phone-island-sensor{width:5px;height:5px}
          .phone-btn-mute{width:20px;height:3px}
          .phone-btn-volup,.phone-btn-voldown{width:34px;height:3px}
          .phone-btn-volup{left:calc(10% + 28px)}
          .phone-btn-voldown{left:calc(10% + 70px)}
          .phone-btn-power{width:50px;height:3px}
        }
        section.page{padding:100px 24px}
        .section-head{text-align:center;max-width:1100px;margin:0 auto 60px}
        .section-kicker{color:var(--text-dim);font-size:12px;letter-spacing:.15em;text-transform:uppercase;margin-bottom:14px}
        .section-title{font-size:clamp(36px,5vw,60px);line-height:1;letter-spacing:-.02em;margin-bottom:18px}
        .section-sub{color:var(--text-muted);font-size:17px;max-width:900px;margin-left:auto;margin-right:auto}
        .section-sub.nowrap{white-space:nowrap}
        .features{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:var(--maxw);margin:0 auto}
        .features .feature:last-child{grid-column:1/-1}
        @media(max-width:900px){.features{grid-template-columns:1fr}.features .feature:last-child{grid-column:auto}.section-sub.nowrap{white-space:normal}.hero-sub{white-space:normal}}
        .feature{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:34px;min-height:320px;display:flex;flex-direction:column;gap:16px;overflow:hidden}
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
        .scam-label{color:var(--text-dim);font-size:12px;letter-spacing:.1em;text-transform:uppercase}
        .scam-quote{background:#060606;border-left:3px solid var(--pink);padding:14px 16px;border-radius:6px;font-style:italic;color:#e5e5e5;font-size:15px}
        .scam-solve{display:flex;gap:12px;align-items:flex-start;font-size:14px}
        .scam-solve .check{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:var(--green-bg);border:1px solid rgba(94,232,163,.35);display:grid;place-items:center;color:var(--green)}
        .scam-solve span{color:var(--text-muted)}
        .proof{max-width:var(--maxw);margin:0 auto}
        .proof-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
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
        .final>*{position:relative}
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
