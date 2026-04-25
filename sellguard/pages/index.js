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
        <option value="it">🇮🇹 IT</option>
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
  <div class="phone-stage">
    <div class="phone-halo"></div>
    <div class="phone-body">
      <div class="phone-edge-top">
        <div class="phone-btn-action"></div>
        <div class="phone-btn-volup"></div>
        <div class="phone-btn-voldown"></div>
      </div>
      <div class="phone-edge-bottom">
        <div class="phone-btn-power"></div>
      </div>
      <div class="phone-screen">
        <div class="phone-island-v">
          <span class="phone-island-dot"></span>
        </div>
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
  <p class="demo-tagline" data-i18n="demo_tagline">L'action complète prend moins de 2 minutes.</p>
</section>

<section class="page" id="how" style="padding-top:40px">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="how_kicker">Comment ça marche</div>
    <h2 class="section-title serif"><span data-i18n="how_t1">Trois étapes,</span><br><span class="italic" data-i18n="how_t2">une seule mission.</span></h2>
    <p class="section-sub nowrap" data-i18n="how_sub">De l'annonce à la défense en cas de litige, SellCov t'accompagne sur chaque étape d'une vente.</p>
  </div>
  <div class="features">
    <div class="feature feature-violet reveal">
      <span class="tag" data-i18n="f1_tag">Annonce</span>
      <h3 class="serif"><span data-i18n="f1_h1">Génère ton annonce</span><br><span class="italic" data-i18n="f1_h2">en 10 secondes.</span></h3>
      <p data-i18n="f1_p">Photographie l'article, reçois une annonce rédigée et prête à publier.</p>
      <div class="cta-area"><a href="/annonce" class="btn btn-violet btn-sm" data-i18n="f1_btn">Essayer</a><span style="color:var(--text-dim);font-size:13px" data-i18n="f1_time">~10 sec par annonce</span></div>
    </div>
    <div class="feature feature-green reveal">
      <span class="tag" data-i18n="f2_tag">Protection</span>
      <h3 class="serif"><span data-i18n="f2_h1">Certifie avant</span><br><span class="italic" data-i18n="f2_h2">d'expédier.</span></h3>
      <p data-i18n="f2_p">Créer une preuve utilisable en cas de litige.</p>
      <div class="cta-area"><a href="/protection" class="btn btn-green btn-sm" data-i18n="f2_btn">Protéger</a><span style="color:var(--text-dim);font-size:13px" data-i18n="f2_time">~1 min 30 par envoi</span></div>
    </div>
    <div class="feature feature-pink reveal">
      <span class="tag" data-i18n="f3_tag">Litige</span>
      <h3 class="serif"><span data-i18n="f3_h1">Défense automatique</span><br><span class="italic" data-i18n="f3_h2">en 1 clic.</span></h3>
      <p data-i18n="f3_p">Un dossier de défense prêt à envoyer.</p>
      <div class="cta-area"><a href="/litige" class="btn btn-pink btn-sm" data-i18n="f3_btn">Gérer un litige</a><span style="color:var(--text-dim);font-size:13px" data-i18n="f3_time">~30 sec de rédaction</span></div>
    </div>
  </div>
</section>

<section class="page" id="scams" style="background:linear-gradient(180deg,transparent,rgba(245,112,170,.02),transparent)">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="sc_kicker">Les arnaques que tu vas rencontrer</div>
    <h2 class="section-title serif"><span data-i18n="sc_t1">Les arnaques qui coûtent</span><br><span class="italic" data-i18n="sc_t2">le plus cher aux vendeurs.</span></h2>
    <p class="section-sub" data-i18n="sc_sub">Voici les arnaques les plus fréquentes — et comment SellCov te protège.</p>
  </div>
  <div class="scams">
    <div class="scam-card reveal">
      <span class="scam-label" data-i18n="s1_title">Colis "jamais reçu"</span>
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
    <div class="scam-card reveal" style="grid-column:1/-1">
      <span class="scam-label" data-i18n="s5_title">"Ce n'est pas authentique"</span>
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
      <div class="stat reveal"><div class="stat-big serif">1 min 30</div><div class="stat-label" data-i18n="pr_s1">par vente sécurisée</div></div>
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
    demo_tagline:"L'action complète prend moins de 2 minutes.",
    how_kicker:"Comment ça marche",how_t1:"Trois étapes,",how_t2:"une seule mission.",
    how_sub:"De l'annonce à la défense en cas de litige, SellCov t'accompagne sur chaque étape d'une vente.",
    f1_tag:"Annonce",f1_h1:"Génère ton annonce",f1_h2:"en 10 secondes.",f1_p:"Photographie l'article, reçois une annonce rédigée et prête à publier.",f1_btn:"Essayer",f1_time:"~10 sec par annonce",
    f2_tag:"Protection",f2_h1:"Certifie avant",f2_h2:"d'expédier.",f2_p:"Créer une preuve utilisable en cas de litige.",f2_btn:"Protéger",f2_time:"~1 min 30 par envoi",
    f3_tag:"Litige",f3_h1:"Défense automatique",f3_h2:"en 1 clic.",f3_p:"Un dossier de défense prêt à envoyer.",f3_btn:"Gérer un litige",f3_time:"~30 sec de rédaction",
    sc_kicker:"Les arnaques que tu vas rencontrer",sc_t1:"Les arnaques qui coûtent",sc_t2:"le plus cher aux vendeurs.",sc_sub:"Voici les arnaques les plus fréquentes — et comment SellCov te protège.",
    s1_title:"Colis \"jamais reçu\"",s1_quote:"« Je n'ai jamais reçu le colis. Je demande un remboursement. »",s1_solve:"<strong style='color:#fff'>SellCov affiche</strong> la vidéo horodatée du dépôt en bureau de poste, le numéro de suivi et l'étiquette filmée. Défense envoyée en 30 secondes.",
    s2_title:"Arnaque n°2 · Article \"abîmé\"",s2_quote:"« L'article est arrivé troué. Je veux être remboursé. »",s2_solve:"<strong style='color:#fff'>SellCov prouve</strong> l'état exact avant expédition grâce à la vidéo 360° horodatée. L'IA compare les photos de l'acheteur et détecte les incohérences.",
    s3_title:"Arnaque n°3 · Substitution",s3_quote:"« Ce n'est pas l'article que j'ai commandé. »",s3_solve:"<strong style='color:#fff'>SellCov atteste</strong> le contenu exact du colis au moment de la fermeture. Marque, taille, couleur, détails, tout est filmé.",
    s5_title:"\"Ce n'est pas authentique\"",s5_quote:"« Le produit est une contrefaçon, je signale à la plateforme. »",s5_solve:"<strong style='color:#fff'>SellCov horodate</strong> les codes produit, étiquettes d'authenticité, factures d'achat. En cas de litige, tu joins le tout à ta défense en un clic.",
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
    demo_tagline:"The whole process takes less than 2 minutes.",
    how_kicker:"How it works",how_t1:"Three steps,",how_t2:"one mission.",how_sub:"From listing to dispute defence, SellCov covers every step of your sale.",
    f1_tag:"Listing",f1_h1:"Generate your listing",f1_h2:"in 10 seconds.",f1_p:"Photograph the item, get a written listing ready to publish.",f1_btn:"Try it",f1_time:"~10 sec per listing",
    f2_tag:"Protection",f2_h1:"Certify before",f2_h2:"shipping.",f2_p:"Create proof that holds up in any dispute.",f2_btn:"Protect",f2_time:"~1 min 30 per shipment",
    f3_tag:"Dispute",f3_h1:"Automatic defence",f3_h2:"in 1 click.",f3_p:"A defence file ready to send.",f3_btn:"Handle dispute",f3_time:"~30 sec to write",
    sc_kicker:"Scams you will encounter",sc_t1:"The scams that cost",sc_t2:"sellers the most.",sc_sub:"Here are the most common scams — and how SellCov protects you.",
    s1_title:"Parcel \"never received\"",s1_quote:"\"I never received the parcel. I'm requesting a refund.\"",s1_solve:"<strong style='color:#fff'>SellCov shows</strong> the timestamped video of drop-off at the post office, the tracking number and the filmed label. Defence sent in 30 seconds.",
    s2_title:"Scam #2 · Item \"damaged\"",s2_quote:"\"The item arrived with a hole. I want a refund.\"",s2_solve:"<strong style='color:#fff'>SellCov proves</strong> the exact condition before shipping via 360° timestamped video. AI compares the buyer's photos and detects inconsistencies.",
    s3_title:"Scam #3 · Substitution",s3_quote:"\"This is not the item I ordered.\"",s3_solve:"<strong style='color:#fff'>SellCov certifies</strong> the exact contents of the parcel at the time of sealing. Brand, size, colour, details, all filmed.",
    s5_title:"\"It's not authentic\"",s5_quote:"\"The product is a fake, I'm reporting it to the platform.\"",s5_solve:"<strong style='color:#fff'>SellCov timestamps</strong> product codes, authenticity labels, purchase receipts. Attach everything to your auto-generated defence in one click.",
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
    demo_tagline:"Todo el proceso dura menos de 2 minutos.",
    how_kicker:"Cómo funciona",how_t1:"Tres pasos,",how_t2:"una sola misión.",how_sub:"Del anuncio a la defensa en caso de litigio, SellCov te acompaña en cada etapa.",
    f1_tag:"Anuncio",f1_h1:"Genera tu anuncio",f1_h2:"en 10 segundos.",f1_p:"Fotografía el artículo, recibe un anuncio redactado listo para publicar.",f1_btn:"Probar",f1_time:"~10 seg por anuncio",
    f2_tag:"Protección",f2_h1:"Certifica antes",f2_h2:"de enviar.",f2_p:"Crea una prueba utilizable en caso de litigio.",f2_btn:"Proteger",f2_time:"~1 min 30 por envío",
    f3_tag:"Litigio",f3_h1:"Defensa automática",f3_h2:"con 1 clic.",f3_p:"Un expediente de defensa listo para enviar.",f3_btn:"Gestionar litigio",f3_time:"~30 seg de redacción",
    sc_kicker:"Las estafas que vas a encontrar",sc_t1:"Las estafas que más cuestan",sc_t2:"a los vendedores.",sc_sub:"Aquí están las estafas más frecuentes — y cómo SellCov te protege.",
    s1_title:"Paquete \"nunca recibido\"",s1_quote:"\"Nunca recibí el paquete. Solicito un reembolso.\"",s1_solve:"<strong style='color:#fff'>SellCov muestra</strong> el video del depósito en correos, el número de seguimiento y la etiqueta filmada.",
    s2_title:"Estafa n°2 · Artículo \"dañado\"",s2_quote:"\"El artículo llegó con un agujero. Quiero un reembolso.\"",s2_solve:"<strong style='color:#fff'>SellCov prueba</strong> el estado exacto antes del envío mediante video 360° con marca de tiempo.",
    s3_title:"Estafa n°3 · Sustitución",s3_quote:"\"Esto no es el artículo que pedí.\"",s3_solve:"<strong style='color:#fff'>SellCov certifica</strong> el contenido exacto del paquete en el momento del cierre.",
    s5_title:"\"No es auténtico\"",s5_quote:"\"El producto es una falsificación, lo denuncio a la plataforma.\"",s5_solve:"<strong style='color:#fff'>SellCov marca</strong> los códigos de producto, etiquetas de autenticidad y facturas de compra.",
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
  it:{
    nav_how:"Come funziona",nav_why:"Perché",nav_pricing:"Prezzi",nav_faq:"FAQ",nav_cta:"Prova gratis",
    badge:"Beta aperta · Accesso gratuito",hero_h1_1:"Rivendi",hero_h1_2:"senza farti truffare.",
    hero_sub:"Prova solida prima della spedizione. Dossier completo in caso di controversia.",hero_subsub:"Prova con timestamp. Difesa automatica.",
    stat1:"Beta aperta",stat2:"Prove certificate",stat3:"Dati crittografati in Francia",hero_cta:"Proteggi la mia prossima vendita",
    demo_tagline:"L'intera operazione richiede meno di 2 minuti.",
    how_kicker:"Come funziona",how_t1:"Tre passi,",how_t2:"una sola missione.",how_sub:"Dall'annuncio alla difesa in caso di controversia, SellCov ti accompagna in ogni fase della vendita.",
    f1_tag:"Annuncio",f1_h1:"Genera il tuo annuncio",f1_h2:"in 10 secondi.",f1_p:"Fotografa l'articolo, ricevi un annuncio pronto da pubblicare.",f1_btn:"Provare",f1_time:"~10 sec per annuncio",
    f2_tag:"Protezione",f2_h1:"Certifica prima",f2_h2:"di spedire.",f2_p:"Crea una prova utilizzabile in caso di controversia.",f2_btn:"Proteggere",f2_time:"~1 min 30 per spedizione",
    f3_tag:"Controversia",f3_h1:"Difesa automatica",f3_h2:"in 1 clic.",f3_p:"Un dossier di difesa pronto da inviare.",f3_btn:"Gestire una controversia",f3_time:"~30 sec di redazione",
    sc_kicker:"Le truffe che incontrerai",sc_t1:"Le truffe che costano",sc_t2:"di più ai venditori.",sc_sub:"Ecco le truffe più frequenti — e come SellCov ti protegge.",
    s1_title:"Pacco \"mai ricevuto\"",s1_quote:"\"Non ho mai ricevuto il pacco. Chiedo il rimborso.\"",s1_solve:"<strong style='color:#fff'>SellCov mostra</strong> il video con timestamp del deposito in ufficio postale, il numero di tracciamento e l'etichetta filmata. Difesa inviata in 30 secondi.",
    s2_title:"Truffa n°2 · Articolo \"danneggiato\"",s2_quote:"\"L'articolo è arrivato forato. Voglio essere rimborsato.\"",s2_solve:"<strong style='color:#fff'>SellCov prova</strong> lo stato esatto prima della spedizione grazie al video 360° con timestamp. L'IA confronta le foto dell'acquirente e rileva incongruenze.",
    s3_title:"Truffa n°3 · Sostituzione",s3_quote:"\"Questo non è l'articolo che ho ordinato.\"",s3_solve:"<strong style='color:#fff'>SellCov attesta</strong> il contenuto esatto del pacco al momento della chiusura. Marca, taglia, colore, dettagli, tutto è filmato.",
    s5_title:"\"Non è autentico\"",s5_quote:"\"Il prodotto è una contraffazione, lo segnalo alla piattaforma.\"",s5_solve:"<strong style='color:#fff'>SellCov marca temporalmente</strong> i codici prodotto, etichette di autenticità, fatture d'acquisto. In caso di controversia, alleghi tutto alla tua difesa in un clic.",
    pr_kicker:"Le garanzie tecniche",pr_t1:"Ciò che regge",pr_t2:"in una controversia.",pr_s1:"per vendita sicura",pr_s2:"standard crittografico certificato",pr_s3:"archiviazione sicura in Francia",
    pl_kicker:"Le nostre offerte",pl_t1:"Semplice,",pl_t2:"senza sorprese.",pl_sub:"I primi 50 venditori beneficiano della tariffa Early Adopter. Prezzo bloccato per 1 anno. Nessun impegno, annullabile in 1 clic.",
    per_mo:"/ mese",
    p1_name:"Beta",p1_desc:"Accesso completo durante la fase di lancio.",p1_f1:"Certificati video illimitati",p1_f2:"IA difesa automatica",p1_f3:"Generazione di annunci",p1_f4:"Supporto email",p1_btn:"Inizia gratis",
    p2_ribbon:"★ Consigliato",p2_name:"Early Adopter",p2_desc:"Riservato ai primi 50. Tariffa garantita 1 anno.",p2_f1:"Tutto del piano Beta",p2_f2:"Storico 3 mesi",p2_f3:"Certificati prioritari",p2_f4:"Risposta email entro 24h",p2_f5:"Accesso anticipato alle nuove funzionalità",p2_btn:"Prenota il mio posto",
    p3_name:"Pro Power Seller",p3_desc:"Per venditori con +50 vendite/mese.",p3_f1:"Tutto del piano Early Adopter",p3_f2:"Dashboard: vendite certificate, controversie, risparmi",p3_f3:"Gestione unificata sulle tue piattaforme di vendita online",p3_btn:"Passa a Pro",
    fq_kicker:"FAQ",fq_t1:"Domande",fq_t2:"frequenti.",
    q1:"La mia prova video ha valore giuridico?",a1:"Sì. Ogni video è marcato temporalmente tramite hash crittografico SHA-256. Costituisce un elemento di prova ammissibile. La maggior parte delle piattaforme accetta prove video nella loro mediazione interna.",
    q2:"Funziona davvero con Vinted e Leboncoin?",a2:"Sì. SellCov è indipendente dalla piattaforma. Generi una prova video con timestamp sottomissibile su qualsiasi marketplace.",
    q3:"Quanto tempo richiede per spedizione?",a3:"Tra 2 e 3 minuti. Filmi l'articolo, il pacco chiuso, l'etichetta. L'app ti guida passo passo.",
    q4:"I miei video sono privati?",a4:"Totalmente. I tuoi video sono crittografati, archiviati su server europei (GDPR), accessibili solo dal tuo account.",
    q5:"Cosa succede dopo la beta gratuita?",a5:"I primi 50 iscritti conservano la tariffa Early Adopter a 4,90 €/mese, garantita 1 anno. Sarai avvisato 30 giorni prima della fine della beta.",
    q6:"Funziona con Leboncoin, Depop e altri?",a6:"Sì. SellCov funziona su Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy, Facebook Marketplace, tutte le piattaforme di seconda mano.",
    q7:"Cosa succede se la difesa automatica fallisce?",a7:"SellCov ti fornisce una prova video con timestamp, certificata SHA-256, ammissibile in mediazione. Questa prova è solida e riconosciuta. Massimizza le tue possibilità, ma non garantisce un risultato favorevole al 100%. La decisione finale spetta alla piattaforma o al tribunale.",
    mg_kicker:"Guida gratuita",mg_title:"Le 5 truffe Vinted che costano di più (e come evitarle).",mg_desc:"Casi concreti, risposte tipo pronte da copiare. Ricevi la guida gratis via email.",mg_btn:"Ricevi la guida",mg_ok:"Guida inviata! Controlla la tua casella.",mg_legal:"Niente spam. Cancellazione con 1 clic.",mg_visual:"5 truffe · guida gratuita",mg_ph:"La tua email",
    fin_t1:"Proteggi il tuo denaro",fin_t2:"ora.",fin_sub:"Ogni vendita non protetta è un rischio.",fin_cta:"Prova gratis →",
    ft_contact:"Contatto",ft_legal:"Note legali",ft_cgu:"Termini e condizioni",ft_priv:"Privacy"
  }
};

export default function Home() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

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
        .demo{padding:60px 24px 100px;max-width:1100px;margin:0 auto;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:48px}
        .demo-tagline{color:var(--text-muted);font-size:17px;text-align:center;font-family:'Playfair Display',serif;font-style:italic;letter-spacing:-.01em;margin:0}
        .phone-stage{position:relative;width:100%;max-width:820px;display:flex;justify-content:center;align-items:center}
        .phone-halo{position:absolute;inset:-80px;background:radial-gradient(ellipse at 50% 50%,rgba(94,232,163,.10) 0%,rgba(139,127,255,.04) 35%,rgba(0,0,0,0) 70%);filter:blur(50px);pointer-events:none;z-index:0}
        .phone-halo::after{content:"";position:absolute;bottom:-30px;left:10%;right:10%;height:60px;background:radial-gradient(ellipse,rgba(0,0,0,.85) 0%,rgba(0,0,0,0) 70%);filter:blur(40px)}
        .phone-body{position:relative;width:100%;aspect-ratio:2.165/1;background:linear-gradient(170deg,#4a4a52 0%,#2d2d34 15%,#1a1a1f 35%,#0f0f13 50%,#1a1a1f 65%,#2d2d34 85%,#4a4a52 100%);border-radius:58px;padding:8px 14px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1),inset 0 2px 2px rgba(255,255,255,.12),inset 0 -2px 3px rgba(0,0,0,.7),inset 4px 0 4px rgba(255,255,255,.04),inset -4px 0 4px rgba(255,255,255,.04),0 60px 120px rgba(0,0,0,.75),0 25px 50px rgba(0,0,0,.55),0 0 0 1px rgba(0,0,0,.9);z-index:1}
        .phone-body::before{content:"";position:absolute;top:1px;left:10%;right:10%;height:1.5px;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.35) 50%,transparent 100%);pointer-events:none;z-index:5;border-radius:2px}
        .phone-body::after{content:"";position:absolute;bottom:1px;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.12) 50%,transparent 100%);pointer-events:none;z-index:5}
        .phone-edge-top{position:absolute;top:-3px;left:12%;right:12%;height:5px;display:flex;gap:14px;align-items:flex-start;justify-content:flex-start;padding-left:60px;pointer-events:none;z-index:6}
        .phone-edge-bottom{position:absolute;bottom:-3px;left:12%;right:12%;height:5px;display:flex;align-items:flex-start;justify-content:flex-end;padding-right:80px;pointer-events:none;z-index:6}
        .phone-btn-action{width:22px;height:5px;background:linear-gradient(180deg,#4a4a52 0%,#2d2d34 60%,#1a1a1f 100%);border-radius:2px 2px 0 0;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 -1px 2px rgba(0,0,0,.4)}
        .phone-btn-volup{width:46px;height:5px;background:linear-gradient(180deg,#4a4a52 0%,#2d2d34 60%,#1a1a1f 100%);border-radius:2px 2px 0 0;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 -1px 2px rgba(0,0,0,.4)}
        .phone-btn-voldown{width:46px;height:5px;background:linear-gradient(180deg,#4a4a52 0%,#2d2d34 60%,#1a1a1f 100%);border-radius:2px 2px 0 0;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 -1px 2px rgba(0,0,0,.4)}
        .phone-btn-power{width:70px;height:5px;background:linear-gradient(0deg,#4a4a52 0%,#2d2d34 60%,#1a1a1f 100%);border-radius:0 0 2px 2px;box-shadow:inset 0 -1px 0 rgba(255,255,255,.12),0 1px 2px rgba(0,0,0,.4)}
        .phone-screen{position:relative;width:100%;height:100%;background:#000;border-radius:50px;overflow:hidden;isolation:isolate;box-shadow:inset 0 0 0 2px #000,inset 0 0 8px rgba(0,0,0,.9)}
        .phone-screen iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0;z-index:1}
        .phone-island-v{position:absolute;left:16px;top:50%;transform:translateY(-50%);width:22px;height:92px;background:#000;border-radius:12px;z-index:4;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04),0 0 4px rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center}
        .phone-island-dot{width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#3a4a7a 0%,#0f1628 50%,#000 80%);box-shadow:inset 0 0 2px rgba(80,110,180,.5),0 0 2px rgba(0,0,0,.6)}
        @media(max-width:820px){
          .phone-body{border-radius:36px;padding:5px 9px}
          .phone-screen{border-radius:30px}
          .phone-island-v{left:11px;width:15px;height:62px;border-radius:9px}
          .phone-island-dot{width:6px;height:6px}
          .demo{padding:40px 16px 70px;gap:32px}
          .demo-tagline{font-size:15px}
          .phone-edge-top,.phone-edge-bottom{height:3px;top:-2px;bottom:-2px}
          .phone-btn-action{width:14px;height:3px}
          .phone-btn-volup,.phone-btn-voldown{width:30px;height:3px}
          .phone-btn-power{width:46px;height:3px}
          .phone-edge-top{gap:9px;padding-left:40px}
          .phone-edge-bottom{padding-right:55px}
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
