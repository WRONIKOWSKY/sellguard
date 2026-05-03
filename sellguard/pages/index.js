import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

const PAGE_HTML = `
<header>
  <div class="nav">
    <a class="logo" href="/"><img src="/logo.png" alt="SellCov" class="logo-img" /></a>
    <nav class="nav-links">
      <a href="#how" data-i18n="nav_how">Comment</a>
      <a href="#scams" data-i18n="nav_why">Pourquoi</a>
      <a href="#pricing" data-i18n="nav_pricing">Tarifs</a>
    </nav>
    <div class="nav-right">
      <select class="lang-select" id="lang-select" onchange="window.setLang(this.value)">
        <option value="fr">🇫🇷 FR</option>
        <option value="en">🇬🇧 EN</option>
        <option value="es">🇪🇸 ES</option>
        <option value="it">🇮🇹 IT</option>
      </select>
      <a href="/protection" class="btn btn-primary btn-sm" data-i18n="nav_cta">Essayer</a>
    </div>
  </div>
</header>

<section class="hero">
  <h1 class="h1 serif"><span data-i18n="hero_h1_1">Revends</span><span class="italic" data-i18n="hero_h1_2">sans te faire arnaquer.</span></h1>
  <p class="hero-sub" data-i18n="hero_sub">Une preuve solide avant l'envoi. Un dossier complet en cas de litige.</p>
  <p class="hero-subsub" data-i18n="hero_subsub">Preuve horodatée. Défense automatique.</p>
  <div class="hero-stats">
    <span><strong data-i18n="stat1">Preuves certifiées</strong></span>
    <span><strong data-i18n="stat2">Données chiffrées en France</strong></span>
    <span><strong data-i18n="stat3">Annulable en 1 clic</strong></span>
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
          src="https://player.vimeo.com/video/1186225987?autoplay=1&loop=1&muted=1&background=1&autopause=0&dnt=1"
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
    <div class="feature feature-green reveal">
      <span class="tag" data-i18n="f2_tag">Protection</span>
      <h3 class="serif"><span data-i18n="f2_h1">Certifie avant</span><br><span class="italic" data-i18n="f2_h2">d'expédier.</span></h3>
      <p data-i18n="f2_p">Créer une preuve utilisable en cas de litige.</p>
      <div class="cta-area"><a href="/protection" class="btn btn-green btn-sm" data-i18n="f2_btn">Protéger</a><span style="color:var(--text-dim);font-size:13px" data-i18n="f2_time">~1 min 30 par envoi</span></div>
    </div>
    <div class="feature feature-violet reveal">
      <span class="tag" data-i18n="f1_tag">Annonce</span>
      <h3 class="serif"><span data-i18n="f1_h1">Génère ton annonce</span><br><span class="italic" data-i18n="f1_h2">en 10 secondes.</span></h3>
      <p data-i18n="f1_p">Photographie l'article, reçois une annonce rédigée et prête à publier.</p>
      <div class="cta-area"><a href="/annonce" class="btn btn-violet btn-sm" data-i18n="f1_btn">Essayer</a><span style="color:var(--text-dim);font-size:13px" data-i18n="f1_time">~10 sec par annonce</span></div>
    </div>
    <div class="feature feature-pink reveal">
      <span class="tag" data-i18n="f3_tag">Litige</span>
      <h3 class="serif"><span data-i18n="f3_h1">Défense automatique</span><br><span class="italic" data-i18n="f3_h2">en 1 clic.</span></h3>
      <p data-i18n="f3_p">Un dossier de défense prêt à envoyer.</p>
      <div class="cta-area"><a href="/litige" class="btn btn-pink btn-sm" data-i18n="f3_btn">Gérer un litige</a><span style="color:var(--text-dim);font-size:13px" data-i18n="f3_time">~30 sec de rédaction</span></div>
    </div>
  </div>
</section>

<section class="page" id="legal" style="padding-top:60px;padding-bottom:60px">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="lg_kicker">Recevabilité juridique</div>
    <h2 class="section-title serif"><span data-i18n="lg_t1">Tes preuves,</span><br><span class="italic" data-i18n="lg_t2">opposables en cas de litige.</span></h2>
    <p class="section-sub" data-i18n="lg_sub">Chaque certificat SellCov est conçu pour avoir valeur de preuve dans tes échanges avec acheteurs et marketplaces.</p>
  </div>
  <div class="legal-grid">
    <div class="legal-card reveal">
      <div class="legal-icon" aria-hidden="true">⚖︎</div>
      <h3 class="legal-title" data-i18n="lg_c1_t">Article 1366 du Code civil</h3>
      <p class="legal-text" data-i18n="lg_c1_p">L'écrit électronique a la même force probante que l'écrit papier dès lors que l'auteur est identifiable et l'intégrité garantie. Nos certificats cochent ces deux critères.</p>
    </div>
    <div class="legal-card reveal">
      <div class="legal-icon" aria-hidden="true">⌘</div>
      <h3 class="legal-title" data-i18n="lg_c2_t">Intégrité cryptographique</h3>
      <p class="legal-text" data-i18n="lg_c2_p">Empreinte SHA-256 + signature HMAC sur chaque vidéo. Toute modification de la preuve est instantanément détectable et le certificat devient invalide.</p>
    </div>
    <div class="legal-card reveal">
      <div class="legal-icon" aria-hidden="true">§</div>
      <h3 class="legal-title" data-i18n="lg_c3_t">Recevable comme moyen de preuve</h3>
      <p class="legal-text" data-i18n="lg_c3_p">Article 1358 du Code civil : la preuve peut être apportée par tout moyen. Argument utilisable dans tes litiges Vinted, Depop, Leboncoin et procédures civiles.</p>
    </div>
  </div>
  <p class="legal-note reveal" data-i18n="lg_note">Ces preuves peuvent être contestées comme tout moyen de preuve. SellCov ne se substitue pas à un avocat.</p>
</section>

<section class="page" id="scams" style="background:linear-gradient(180deg,transparent,rgba(245,112,170,.02),transparent)">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="sc_kicker">Les arnaques que tu vas rencontrer</div>
    <h2 class="section-title serif"><span data-i18n="sc_t1">Les arnaques qui coûtent</span><br><span class="italic" data-i18n="sc_t2">le plus cher aux vendeurs.</span></h2>
    <p class="section-sub" data-i18n="sc_sub">Voici les arnaques les plus fréquentes et comment SellCov te protège.</p>
  </div>
  <div class="scams scams-3">
    <div class="scam-card reveal">
      <span class="scam-number">Arnaque 1</span>
      <span class="scam-label" data-i18n="s1_title">Colis « jamais reçu »</span>
      <div class="scam-quote" data-i18n="s1_quote">« Je n'ai jamais reçu le colis. Je demande un remboursement. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="s1_solve">SellCov fournit la vidéo horodatée du dépôt et l'étiquette filmée.</span></div>
    </div>
    <div class="scam-card reveal">
      <span class="scam-number">Arnaque 2</span>
      <span class="scam-label" data-i18n="s2_title">Article « abîmé »</span>
      <div class="scam-quote" data-i18n="s2_quote">« L'article est arrivé troué. Je veux être remboursé. »</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="s2_solve">SellCov prouve l'état exact avant expédition grâce à la vidéo 360° horodatée.</span></div>
    </div>
    <div class="scam-card reveal">
      <span class="scam-number">Arnaque 3</span>
      <span class="scam-label" data-i18n="s3_title">Réclamation tardive</span>
      <div class="scam-quote" data-i18n="s3_quote">« L'article a un défaut. » (3 semaines après réception)</div>
      <div class="scam-solve"><span class="check">✓</span><span data-i18n="s3_solve">SellCov horodate l'état exact à l'envoi. Toute usure post-réception est exclue.</span></div>
    </div>
  </div>
  <div class="scams-dots" id="scams-dots">
    <span class="scams-dot active"></span>
    <span class="scams-dot"></span>
    <span class="scams-dot"></span>
  </div>
</section>

<section class="page" id="pricing" style="background:linear-gradient(180deg,transparent,rgba(94,232,163,.02),transparent)">
  <div class="section-head reveal">
    <div class="section-kicker" data-i18n="pl_kicker">Nos offres</div>
    <h2 class="section-title serif"><span data-i18n="pl_t1">Simple,</span><br><span class="italic" data-i18n="pl_t2">sans surprise.</span></h2>
    <p class="section-sub" data-i18n="pl_sub">Aucun engagement, annulable en 1 clic.</p>
  </div>
  <div class="pricing">
    <div class="plan reveal">
      <h4 data-i18n="p1_name">Découverte</h4>
      <div class="plan-price">0 € <small data-i18n="p1_unit">/ mois</small></div>
      <p class="plan-desc" data-i18n="p1_desc">Pour tester sans engagement.</p>
      <ul>
        <li data-i18n="p1_f1">1 certificat vidéo / mois</li>
        <li data-i18n="p1_f2">IA défense automatique</li>
        <li data-i18n="p1_f3">Génération d'annonce</li>
        <li data-i18n="p1_f4">Support email</li>
      </ul>
      <a href="/compte" class="btn btn-ghost" data-i18n="p1_btn">Commencer gratuitement</a>
    </div>
    <div class="plan featured reveal">
      <span class="plan-ribbon" data-i18n="p2_ribbon">★ Recommandé</span>
      <h4 data-i18n="p2_name">Vendeur</h4>
      <div class="plan-price">4,90 € <small data-i18n="per_mo">/ mois</small></div>
      <p class="plan-desc" data-i18n="p2_desc">Pour les vendeurs réguliers (5 à 15 ventes/mois).</p>
      <ul>
        <li data-i18n="p2_f1">15 certificats vidéo / mois</li>
        <li data-i18n="p2_f2">IA défense automatique</li>
        <li data-i18n="p2_f3">Génération d'annonce</li>
        <li data-i18n="p2_f4">Support email prioritaire</li>
        <li data-i18n="p2_f5">Guide des arnaques à éviter</li>
      </ul>
      <a href="/compte" class="btn btn-primary" data-i18n="p2_btn">Choisir Vendeur</a>
    </div>
    <div class="plan reveal">
      <h4 data-i18n="p3_name">Pro</h4>
      <div class="plan-price">14,90 € <small data-i18n="per_mo">/ mois</small></div>
      <p class="plan-desc" data-i18n="p3_desc">Pour les pros (plus de 15 ventes/mois).</p>
      <ul>
        <li data-i18n="p3_f1">60 certificats vidéo / mois</li>
        <li data-i18n="p3_f2">IA défense automatique</li>
        <li data-i18n="p3_f3">Génération d'annonce illimitée</li>
        <li data-i18n="p3_f4">Support prioritaire 24h</li>
        <li data-i18n="p3_f5">Accès aux nouvelles fonctionnalités en avant-première</li>
      </ul>
      <a href="/compte" class="btn btn-ghost" data-i18n="p3_btn">Choisir Pro</a>
    </div>
  </div>
</section>

<section class="final" id="cta">
  <h2 class="serif"><span data-i18n="fin_t1">Protège ton argent</span><br><span class="italic" data-i18n="fin_t2">maintenant.</span></h2>
  <p data-i18n="fin_sub">Génère une vidéo certifiée infalsifiable.</p>
  <a href="/protection" class="btn btn-primary" style="padding:16px 32px;font-size:16px" data-i18n="fin_cta">Essayer</a>
  <div class="platforms" style="margin-top:34px"><strong>Vinted</strong>·<strong>Leboncoin</strong>·<strong>Depop</strong>·<strong>Grailed</strong>·<strong>Vestiaire Collective</strong>·<strong>Etsy</strong></div>
</section>

<footer>
  <div class="foot">
    <div class="logo"><img src="/logo.png" alt="SellCov" class="logo-img" /></div>
    <div class="foot-links">
      <a href="/faq" data-i18n="ft_faq">FAQ</a>
      <a href="mailto:hello@sellcov.com" data-i18n="ft_contact">Contact</a>
      <a href="https://www.instagram.com/sellcov" target="_blank" rel="noopener noreferrer" aria-label="Instagram SellCov">Instagram</a>
      <a href="https://www.tiktok.com/@sellcov.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok SellCov">TikTok</a>
      <a href="/cgu" data-i18n="ft_legal">Mentions légales</a>
      <a href="/cgu" data-i18n="ft_cgu">CGU</a>
    </div>
    <div class="foot-copy">© 2026 SellCov</div>
  </div>
</footer>
`;

const I18N = {
  fr:{
    nav_how:"Comment",nav_why:"Pourquoi",nav_pricing:"Tarifs",nav_faq:"FAQ",nav_cta:"Essayer",
    badge:"Lancement",
    hero_h1_1:"Revends",hero_h1_2:"sans te faire arnaquer.",
    hero_sub:"Conçu pour les vendeurs Vinted. Marche aussi sur Depop, Leboncoin, Vestiaire et Grailed.",
    hero_subsub:"Preuve horodatée. Défense automatique.",
    stat1:"Preuves certifiées",stat2:"Données chiffrées en France",stat3:"Annulable en 1 clic",
    hero_cta:"Protéger ma prochaine vente",
    demo_tagline:"L'action complète prend moins de 2 minutes.",
    how_kicker:"Comment ça marche",how_t1:"Trois étapes,",how_t2:"une seule mission.",
    how_sub:"De l'annonce à la défense en cas de litige, SellCov t'accompagne sur chaque étape d'une vente.",
    f1_tag:"Annonce",f1_h1:"Génère ton annonce",f1_h2:"en 10 secondes.",f1_p:"Photographie l'article, reçois une annonce rédigée et prête à publier.",f1_btn:"Essayer",f1_time:"~10 sec par annonce",
    f2_tag:"Protection",f2_h1:"Certifie avant",f2_h2:"d'expédier.",f2_p:"Créer une preuve utilisable en cas de litige.",f2_btn:"Protéger",f2_time:"~1 min 30 par envoi",
    f3_tag:"Litige",f3_h1:"Défense automatique",f3_h2:"en 1 clic.",f3_p:"Un dossier de défense prêt à envoyer.",f3_btn:"Gérer un litige",f3_time:"~30 sec de rédaction",
    lg_kicker:"Recevabilité juridique",lg_t1:"Tes preuves,",lg_t2:"opposables en cas de litige.",lg_sub:"Construit pour résister aux contestations dans tes litiges.",
    lg_c1_t:"Article 1366 du Code civil",lg_c1_p:"L'écrit électronique a la même force probante que l'écrit papier dès lors que l'auteur est identifiable et l'intégrité garantie. Nos certificats cochent ces deux critères.",
    lg_c2_t:"Intégrité cryptographique",lg_c2_p:"Empreinte SHA-256 + signature HMAC sur chaque vidéo. Toute modification de la preuve est instantanément détectable et le certificat devient invalide.",
    lg_c3_t:"Recevable comme moyen de preuve",lg_c3_p:"Article 1358 du Code civil : la preuve peut être apportée par tout moyen. Argument utilisable dans tes litiges Vinted, Depop, Leboncoin et procédures civiles.",
    lg_note:"Comme toute preuve, un certificat peut être contesté. SellCov ne remplace pas un avocat.",
    sc_kicker:"Cas concrets",sc_t1:"Les arnaques qui coûtent",sc_t2:"le plus cher aux vendeurs.",sc_sub:"Trois cas typiques. Trois réponses SellCov.",
    s1_title:"Colis « jamais reçu »",s1_quote:"« Je n'ai jamais reçu le colis. Je demande un remboursement. »",s1_solve:"SellCov fournit la vidéo horodatée du dépôt et l'étiquette filmée.",
    s2_title:"Article « abîmé »",s2_quote:"« L'article est arrivé troué. Je veux être remboursé. »",s2_solve:"SellCov prouve l'état exact avant expédition grâce à la vidéo 360° horodatée.",
    s3_title:"Réclamation tardive",s3_quote:"« L'article a un défaut. » (3 semaines après réception)",s3_solve:"SellCov horodate l'état exact à l'envoi. Toute usure post-réception est exclue.",
    pl_kicker:"Nos offres",pl_t1:"Simple,",pl_t2:"sans surprise.",pl_sub:"Aucun engagement, annulable en 1 clic.",
    per_mo:"/ mois",
    p1_name:"Découverte",p1_unit:"/ mois",p1_desc:"Pour tester sans engagement.",p1_f1:"1 certificat vidéo / mois",p1_f2:"IA défense automatique",p1_f3:"Génération d'annonce",p1_f4:"Support email",p1_btn:"Commencer gratuitement",
    p2_ribbon:"★ Recommandé",p2_name:"Vendeur",p2_desc:"Pour les vendeurs réguliers (5 à 15 ventes/mois).",p2_f1:"15 certificats vidéo / mois",p2_f2:"IA défense automatique",p2_f3:"Génération d'annonce",p2_f4:"Support email prioritaire",p2_f5:"Guide des arnaques à éviter",p2_btn:"Choisir Vendeur",
    p3_name:"Pro",p3_desc:"Pour les pros (plus de 15 ventes/mois).",p3_f1:"60 certificats vidéo / mois",p3_f2:"IA défense automatique",p3_f3:"Génération d'annonce illimitée",p3_f4:"Support prioritaire 24h",p3_f5:"Accès aux nouvelles fonctionnalités en avant-première",p3_btn:"Choisir Pro",
    fin_t1:"Protège ton argent",fin_t2:"maintenant.",fin_sub:"Génère une vidéo certifiée infalsifiable.",fin_cta:"Essayer",
    ft_faq:"FAQ",ft_contact:"Contact",ft_legal:"Mentions légales",ft_cgu:"CGU",ft_priv:"Confidentialité"
  },
  en:{
    nav_how:"How",nav_why:"Why",nav_pricing:"Pricing",nav_faq:"FAQ",nav_cta:"Try it",
    badge:"Launch",
    hero_h1_1:"Sell",hero_h1_2:"without getting scammed.",
    hero_sub:"Built for Vinted sellers. Works on Depop, eBay, Leboncoin and Grailed too.",hero_subsub:"Timestamped proof. Automatic defence.",
    stat1:"Certified proofs",stat2:"Data encrypted in France",stat3:"Cancel in 1 click",hero_cta:"Protect my next sale",
    demo_tagline:"The whole process takes less than 2 minutes.",
    how_kicker:"How it works",how_t1:"Three steps,",how_t2:"one mission.",how_sub:"From listing to dispute defence, SellCov covers every step of your sale.",
    f1_tag:"Listing",f1_h1:"Generate your listing",f1_h2:"in 10 seconds.",f1_p:"Photograph the item, get a written listing ready to publish.",f1_btn:"Try it",f1_time:"~10 sec per listing",
    f2_tag:"Protection",f2_h1:"Certify before",f2_h2:"shipping.",f2_p:"Create proof that holds up in any dispute.",f2_btn:"Protect",f2_time:"~1 min 30 per shipment",
    f3_tag:"Dispute",f3_h1:"Automatic defence",f3_h2:"in 1 click.",f3_p:"A defence file ready to send.",f3_btn:"Handle dispute",f3_time:"~30 sec to write",
    lg_kicker:"Legal admissibility",lg_t1:"Your proofs,",lg_t2:"admissible in any dispute.",lg_sub:"Built to withstand challenges in your disputes.",
    lg_c1_t:"Article 1366 French Civil Code",lg_c1_p:"Electronic writing has the same evidentiary force as paper, provided the author is identifiable and integrity guaranteed. Our certificates meet both criteria.",
    lg_c2_t:"Cryptographic integrity",lg_c2_p:"SHA-256 fingerprint + HMAC signature on every video. Any tampering is instantly detectable and the certificate becomes invalid.",
    lg_c3_t:"Admissible as evidence",lg_c3_p:"Article 1358 French Civil Code: evidence may be adduced by any means. Usable in your Vinted, Depop, eBay disputes and civil proceedings.",
    lg_note:"Like any evidence, a certificate can be challenged. SellCov does not replace a lawyer.",
    sc_kicker:"Real cases",sc_t1:"The scams that cost",sc_t2:"sellers the most.",sc_sub:"Three typical cases. Three SellCov answers.",
    s1_title:"Parcel \"never received\"",s1_quote:"\"I never received the parcel. I'm requesting a refund.\"",s1_solve:"SellCov provides the timestamped video of drop-off and the filmed label.",
    s2_title:"Item \"damaged\"",s2_quote:"\"The item arrived with a hole. I want a refund.\"",s2_solve:"SellCov proves the exact condition before shipping with a 360° timestamped video.",
    s3_title:"Late claim",s3_quote:"\"The item is defective.\" (3 weeks after delivery)",s3_solve:"SellCov timestamps exact condition at shipping. Post-delivery wear is excluded.",
    pl_kicker:"Our plans",pl_t1:"Simple,",pl_t2:"no surprises.",pl_sub:"No commitment, cancel anytime.",
    per_mo:"/ month",
    p1_name:"Discovery",p1_unit:"/ month",p1_desc:"Try without commitment.",p1_f1:"1 video certificate / month",p1_f2:"AI automatic defence",p1_f3:"Listing generation",p1_f4:"Email support",p1_btn:"Start for free",
    p2_ribbon:"★ Recommended",p2_name:"Seller",p2_desc:"For regular sellers (5 to 15 sales/month).",p2_f1:"15 video certificates / month",p2_f2:"AI automatic defence",p2_f3:"Listing generation",p2_f4:"Priority email support",p2_f5:"Guide to avoiding scams",p2_btn:"Choose Seller",
    p3_name:"Pro",p3_desc:"For pros (more than 15 sales/month).",p3_f1:"60 video certificates / month",p3_f2:"AI automatic defence",p3_f3:"Unlimited listing generation",p3_f4:"24h priority support",p3_f5:"Early access to new features",p3_btn:"Choose Pro",
    fin_t1:"Protect your money",fin_t2:"now.",fin_sub:"Generate a tamper-proof certified video.",fin_cta:"Try it",
    ft_faq:"FAQ",ft_contact:"Contact",ft_legal:"Legal notice",ft_cgu:"T&Cs",ft_priv:"Privacy"
  },
  es:{
    nav_how:"Cómo",nav_why:"Por qué",nav_pricing:"Precios",nav_faq:"FAQ",nav_cta:"Probar",
    badge:"Lanzamiento",
    hero_h1_1:"Vende",hero_h1_2:"sin que te estafen.",
    hero_sub:"Diseñado para vendedores Vinted. Funciona también en Depop, Wallapop y Vestiaire.",hero_subsub:"Prueba con marca de tiempo. Defensa automática.",
    stat1:"Pruebas certificadas",stat2:"Datos cifrados en Francia",stat3:"Cancelable con 1 clic",hero_cta:"Proteger mi próxima venta",
    demo_tagline:"Todo el proceso dura menos de 2 minutos.",
    how_kicker:"Cómo funciona",how_t1:"Tres pasos,",how_t2:"una sola misión.",how_sub:"Del anuncio a la defensa en caso de litigio, SellCov te acompaña en cada etapa.",
    f1_tag:"Anuncio",f1_h1:"Genera tu anuncio",f1_h2:"en 10 segundos.",f1_p:"Fotografía el artículo, recibe un anuncio redactado listo para publicar.",f1_btn:"Probar",f1_time:"~10 seg por anuncio",
    f2_tag:"Protección",f2_h1:"Certifica antes",f2_h2:"de enviar.",f2_p:"Crea una prueba utilizable en caso de litigio.",f2_btn:"Proteger",f2_time:"~1 min 30 por envío",
    f3_tag:"Litigio",f3_h1:"Defensa automática",f3_h2:"con 1 clic.",f3_p:"Un expediente de defensa listo para enviar.",f3_btn:"Gestionar litigio",f3_time:"~30 seg de redacción",
    lg_kicker:"Admisibilidad legal",lg_t1:"Tus pruebas,",lg_t2:"oponibles en caso de litigio.",lg_sub:"Construido para resistir impugnaciones en tus litigios.",
    lg_c1_t:"Artículo 1366 Código Civil francés",lg_c1_p:"El escrito electrónico tiene la misma fuerza probatoria que el papel, siempre que el autor sea identificable y se garantice la integridad. Nuestros certificados cumplen ambos criterios.",
    lg_c2_t:"Integridad criptográfica",lg_c2_p:"Huella SHA-256 + firma HMAC en cada vídeo. Toda modificación es detectable al instante y el certificado queda inválido.",
    lg_c3_t:"Admisible como prueba",lg_c3_p:"Artículo 1358 Código Civil francés: la prueba puede aportarse por cualquier medio. Argumento utilizable en tus litigios Vinted, Depop y procedimientos civiles.",
    lg_note:"Como toda prueba, un certificado puede ser impugnado. SellCov no reemplaza a un abogado.",
    sc_kicker:"Casos reales",sc_t1:"Las estafas que más cuestan",sc_t2:"a los vendedores.",sc_sub:"Tres casos típicos. Tres respuestas SellCov.",
    s1_title:"Paquete «nunca recibido»",s1_quote:"«Nunca recibí el paquete. Solicito un reembolso.»",s1_solve:"SellCov proporciona el video con marca de tiempo del depósito y la etiqueta filmada.",
    s2_title:"Artículo «dañado»",s2_quote:"«El artículo llegó con un agujero. Quiero un reembolso.»",s2_solve:"SellCov prueba el estado exacto antes del envío con un video 360° con marca de tiempo.",
    s3_title:"Reclamación tardía",s3_quote:"«El artículo tiene un defecto.» (3 semanas después de la recepción)",s3_solve:"SellCov fecha el estado exacto al envío. Cualquier desgaste posterior queda excluido.",
    pl_kicker:"Nuestros planes",pl_t1:"Simple,",pl_t2:"sin sorpresas.",pl_sub:"Sin compromiso, cancelable con 1 clic.",
    per_mo:"/ mes",
    p1_name:"Descubierta",p1_unit:"/ mes",p1_desc:"Probar sin compromiso.",p1_f1:"1 certificado de video / mes",p1_f2:"IA defensa automática",p1_f3:"Generación de anuncio",p1_f4:"Soporte email",p1_btn:"Empezar gratis",
    p2_ribbon:"★ Recomendado",p2_name:"Vendedor",p2_desc:"Para vendedores regulares (5 a 15 ventas/mes).",p2_f1:"15 certificados de video / mes",p2_f2:"IA defensa automática",p2_f3:"Generación de anuncio",p2_f4:"Soporte email prioritario",p2_f5:"Guía de estafas a evitar",p2_btn:"Elegir Vendedor",
    p3_name:"Pro",p3_desc:"Para pros (más de 15 ventas/mes).",p3_f1:"60 certificados de video / mes",p3_f2:"IA defensa automática",p3_f3:"Generación de anuncio ilimitada",p3_f4:"Soporte prioritario 24h",p3_f5:"Acceso anticipado a nuevas funciones",p3_btn:"Elegir Pro",
    fin_t1:"Protege tu dinero",fin_t2:"ahora.",fin_sub:"Genera un video certificado infalsificable.",fin_cta:"Probar",
    ft_faq:"FAQ",ft_contact:"Contacto",ft_legal:"Aviso legal",ft_cgu:"T&C",ft_priv:"Privacidad"
  },
  it:{
    nav_how:"Come",nav_why:"Perché",nav_pricing:"Prezzi",nav_faq:"FAQ",nav_cta:"Prova",
    badge:"Lancio",
    hero_h1_1:"Rivendi",hero_h1_2:"senza farti truffare.",
    hero_sub:"Pensato per i venditori Vinted. Funziona anche su Depop, Subito e Vestiaire.",hero_subsub:"Prova con timestamp. Difesa automatica.",
    stat1:"Prove certificate",stat2:"Dati crittografati in Francia",stat3:"Annullabile in 1 clic",hero_cta:"Proteggi la mia prossima vendita",
    demo_tagline:"L'intera operazione richiede meno di 2 minuti.",
    how_kicker:"Come funziona",how_t1:"Tre passi,",how_t2:"una sola missione.",how_sub:"Dall'annuncio alla difesa in caso di controversia, SellCov ti accompagna in ogni fase della vendita.",
    f1_tag:"Annuncio",f1_h1:"Genera il tuo annuncio",f1_h2:"in 10 secondi.",f1_p:"Fotografa l'articolo, ricevi un annuncio pronto da pubblicare.",f1_btn:"Provare",f1_time:"~10 sec per annuncio",
    f2_tag:"Protezione",f2_h1:"Certifica prima",f2_h2:"di spedire.",f2_p:"Crea una prova utilizzabile in caso di controversia.",f2_btn:"Proteggere",f2_time:"~1 min 30 per spedizione",
    f3_tag:"Controversia",f3_h1:"Difesa automatica",f3_h2:"in 1 clic.",f3_p:"Un dossier di difesa pronto da inviare.",f3_btn:"Gestire una controversia",f3_time:"~30 sec di redazione",
    lg_kicker:"Ammissibilità legale",lg_t1:"Le tue prove,",lg_t2:"opponibili in caso di controversia.",lg_sub:"Costruito per resistere alle contestazioni nelle tue controversie.",
    lg_c1_t:"Articolo 1366 Codice civile francese",lg_c1_p:"Lo scritto elettronico ha la stessa forza probatoria della carta, purché l'autore sia identificabile e l'integrità garantita. I nostri certificati soddisfano entrambi i criteri.",
    lg_c2_t:"Integrità crittografica",lg_c2_p:"Impronta SHA-256 + firma HMAC su ogni video. Qualsiasi modifica è rilevabile istantaneamente e il certificato diventa invalido.",
    lg_c3_t:"Ammissibile come prova",lg_c3_p:"Articolo 1358 Codice civile francese: la prova può essere fornita con qualsiasi mezzo. Argomento utilizzabile nelle tue controversie Vinted, Depop e procedure civili.",
    lg_note:"Come ogni prova, un certificato può essere contestato. SellCov non sostituisce un avvocato.",
    sc_kicker:"Casi reali",sc_t1:"Le truffe che costano",sc_t2:"di più ai venditori.",sc_sub:"Tre casi tipici. Tre risposte SellCov.",
    s1_title:"Pacco «mai ricevuto»",s1_quote:"«Non ho mai ricevuto il pacco. Chiedo il rimborso.»",s1_solve:"SellCov fornisce il video con timestamp del deposito e l'etichetta filmata.",
    s2_title:"Articolo «danneggiato»",s2_quote:"«L'articolo è arrivato forato. Voglio essere rimborsato.»",s2_solve:"SellCov prova lo stato esatto prima della spedizione con un video 360° con timestamp.",
    s3_title:"Reclamo tardivo",s3_quote:"«L'articolo ha un difetto.» (3 settimane dopo la ricezione)",s3_solve:"SellCov fissa lo stato esatto alla spedizione. Ogni usura post-ricezione è esclusa.",
    pl_kicker:"Le nostre offerte",pl_t1:"Semplice,",pl_t2:"senza sorprese.",pl_sub:"Nessun impegno, annullabile in 1 clic.",
    per_mo:"/ mese",
    p1_name:"Scoperta",p1_unit:"/ mese",p1_desc:"Prova senza impegno.",p1_f1:"1 certificato video / mese",p1_f2:"IA difesa automatica",p1_f3:"Generazione di annuncio",p1_f4:"Supporto email",p1_btn:"Inizia gratis",
    p2_ribbon:"★ Consigliato",p2_name:"Venditore",p2_desc:"Per venditori regolari (5 a 15 vendite/mese).",p2_f1:"15 certificati video / mese",p2_f2:"IA difesa automatica",p2_f3:"Generazione di annuncio",p2_f4:"Supporto email prioritario",p2_f5:"Guida alle truffe da evitare",p2_btn:"Scegli Venditore",
    p3_name:"Pro",p3_desc:"Per i pro (più di 15 vendite/mese).",p3_f1:"60 certificati video / mese",p3_f2:"IA difesa automatica",p3_f3:"Generazione annuncio illimitata",p3_f4:"Supporto prioritario 24h",p3_f5:"Accesso anticipato alle nuove funzionalità",p3_btn:"Scegli Pro",
    fin_t1:"Proteggi il tuo denaro",fin_t2:"ora.",fin_sub:"Genera un video certificato infalsificabile.",fin_cta:"Prova",
    ft_faq:"FAQ",ft_contact:"Contatto",ft_legal:"Note legali",ft_cgu:"Termini e condizioni",ft_priv:"Privacy"
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

    const saved = localStorage.getItem('sellcov_lang') || 'fr';
    setLang(saved);

    // Carousel dots tracking pour la section "Arnaques" (mobile)
    const scamsContainer = document.querySelector('.scams');
    function updateScamsDots() {
      if (!scamsContainer) return;
      const dots = document.querySelectorAll('#scams-dots .scams-dot');
      if (!dots.length) return;
      const cards = scamsContainer.querySelectorAll('.scam-card');
      const containerCenter = scamsContainer.scrollLeft + scamsContainer.clientWidth / 2;
      let closestIdx = 0, closestDist = Infinity;
      cards.forEach((c, i) => {
        const cardCenter = c.offsetLeft + c.clientWidth / 2;
        const dist = Math.abs(containerCenter - cardCenter);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === closestIdx));
    }
    if (scamsContainer) {
      scamsContainer.addEventListener('scroll', updateScamsDots, { passive: true });
      updateScamsDots();
    }

    return () => {
      io.disconnect();
      if (scamsContainer) scamsContainer.removeEventListener('scroll', updateScamsDots);
    };
  }, []);

  return (
    <>
      <Head>
        <title>SellCov — Revends sans te faire arnaquer</title>
        <meta name="description" content="Preuve vidéo horodatée + défense IA pour vendre en sécurité sur Vinted, Leboncoin, Depop, Vestiaire Collective, Grailed et Etsy." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {/* Open Graph (iMessage / WhatsApp / Slack / Discord / Facebook link previews) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sellcov.com" />
        <meta property="og:title" content="SellCov — Revends sans te faire arnaquer" />
        <meta property="og:description" content="Preuve vidéo horodatée + défense IA pour vendre en sécurité sur Vinted, Leboncoin, Depop, Vestiaire Collective, Grailed et Etsy." />
        <meta property="og:image" content="https://www.sellcov.com/logo.png" />
        <meta property="og:image:alt" content="SellCov — hérisson protecteur" />
        <meta property="og:site_name" content="SellCov" />
        <meta property="og:locale" content="fr_FR" />
        {/* Twitter / X card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="SellCov — Revends sans te faire arnaquer" />
        <meta name="twitter:description" content="Preuve vidéo horodatée + défense IA pour vendre en sécurité sur les marketplaces." />
        <meta name="twitter:image" content="https://www.sellcov.com/logo.png" />
        {/* Favicon iOS / Android */}
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
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
        header{position:fixed;top:0;left:0;right:0;z-index:100;background:#000;border-bottom:1px solid rgba(255,255,255,.04)}
        .nav{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;max-width:var(--maxw);margin:0 auto}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .logo-img{height:72px;width:auto;display:block}
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
        .platforms{color:var(--text-dim);font-size:12px;letter-spacing:.04em;opacity:.6}
        .platforms strong{color:var(--text-dim);font-weight:400;margin:0 4px}
        .demo{padding:60px 24px 100px;max-width:1100px;margin:0 auto;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:48px}
        .demo-tagline{color:rgba(255,255,255,0.92);font-size:18px;text-align:center;font-family:'Playfair Display',serif;font-style:italic;letter-spacing:-.01em;margin:0}
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
        .features .feature:first-child{grid-column:1/-1}
        @media(min-width:561px){.features .feature:first-child{width:calc(50% - 9px);max-width:none;justify-self:center}}
        @media(max-width:900px){.section-sub.nowrap{white-space:normal}.hero-sub{white-space:normal}}
        .feature{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:34px;min-height:320px;display:flex;flex-direction:column;gap:16px;overflow:hidden;text-align:center}
        .feature .tag{font-size:11px;letter-spacing:.15em;text-transform:uppercase;font-weight:600}
        .feature h3{font-size:clamp(28px,3vw,38px);line-height:1.05;letter-spacing:-.02em}
        .feature p{color:var(--text-muted);font-size:15px;flex:1}
        .feature-violet{background:linear-gradient(180deg,var(--violet-bg),transparent 70%),var(--bg-card)}
        .feature-violet .tag{color:var(--violet)}
        .feature-green{background:linear-gradient(180deg,var(--green-bg),transparent 70%),var(--bg-card)}
        .feature-green .tag{color:var(--green)}
        .feature-pink{background:linear-gradient(180deg,var(--pink-bg),transparent 70%),var(--bg-card)}
        .feature-pink .tag{color:var(--pink)}
        .feature .cta-area{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:auto;text-align:center}
        .legal-grid{max-width:var(--maxw);margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        @media(max-width:900px){.legal-grid{grid-template-columns:1fr}}
        .legal-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:28px;display:flex;flex-direction:column;gap:12px}
        .legal-icon{font-size:24px;color:var(--green);line-height:1}
        .legal-title{font-size:17px;font-weight:600;color:#fff;line-height:1.3}
        .legal-text{font-size:14px;color:var(--text-muted);line-height:1.55}
        .legal-note{max-width:var(--maxw);margin:24px auto 0;font-size:12px;color:var(--text-dim);text-align:center;font-style:italic;line-height:1.5}
        .scams{max-width:var(--maxw);margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
        .scams.scams-3{grid-template-columns:repeat(3,1fr)}
        @media(max-width:900px){.scams,.scams.scams-3{grid-template-columns:1fr}}
        .scam-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:26px;display:flex;flex-direction:column;gap:14px;transition:border-color .2s,transform .2s;position:relative}
        .scams-dots{display:none}
        .scam-card:hover{border-color:var(--border-strong);transform:translateY(-2px)}
        .scam-number{color:var(--pink);font-size:11px;letter-spacing:.15em;text-transform:uppercase;font-weight:600;margin-bottom:-6px}
        .scam-label{color:#fff;font-size:18px;font-weight:600;font-family:'Playfair Display',serif}
        .scam-quote{background:#060606;border-left:3px solid var(--pink);padding:14px 16px;border-radius:6px;font-style:italic;color:#e5e5e5;font-size:14px;line-height:1.5}
        .scam-solve{display:flex;gap:12px;align-items:flex-start;font-size:14px}
        .scam-solve .check{flex-shrink:0;width:22px;height:22px;border-radius:50%;background:var(--green-bg);border:1px solid rgba(94,232,163,.35);display:grid;place-items:center;color:var(--green)}
        .scam-solve span{color:var(--text-muted)}
        .pricing{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;max-width:var(--maxw);margin:0 auto}
        @media(max-width:820px){.pricing{grid-template-columns:1fr}}
        .plan{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:32px;display:flex;flex-direction:column;gap:18px;position:relative}
        .plan.featured{border-color:var(--green);background:linear-gradient(180deg,var(--green-bg),transparent 80%),var(--bg-card)}
        .plan-ribbon{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--green);color:#000;padding:4px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.05em;white-space:nowrap}
        .plan h4{font-size:18px;font-weight:600}
        .plan .plan-price{font-family:'Playfair Display',serif;font-size:46px;line-height:1}
        .plan .plan-price small{font-family:'Inter',sans-serif;font-size:14px;color:var(--text-muted);font-weight:400}
        .plan-desc{color:var(--text-muted);font-size:14px;min-height:42px}
        .plan ul{list-style:none;display:flex;flex-direction:column;gap:10px;font-size:14px;color:#ddd;flex:1}
        .plan li{display:flex;gap:10px;align-items:flex-start}
        .plan li::before{content:"✓";color:var(--green);font-weight:700;flex-shrink:0}
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
        @media(max-width:820px){.foot-copy{text-align:center}.foot-links{justify-content:center}.foot{justify-items:center}}
        .reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease}
        .reveal.show{opacity:1;transform:none}
        @media(max-width:560px){
          html,body{overflow-x:hidden;max-width:100vw}
          section.page{padding:60px 20px}
          .section-head{margin-bottom:32px}
          .features{gap:10px}
          .feature{padding:16px;min-height:auto;gap:8px;border-radius:14px}
          .feature h3{font-size:18px;line-height:1.1}
          .feature p{font-size:12px;line-height:1.45}
          .feature .tag{font-size:10px}
          .feature .cta-area{flex-direction:column;align-items:center;gap:6px;text-align:center}
          .feature .cta-area>span{font-size:11px}
          .features .feature:first-child h3{font-size:24px}
          .features .feature:first-child p{font-size:14px}
          .scams,.scams.scams-3{
            grid-template-columns:none;
            display:flex;
            gap:14px;
            overflow-x:auto;
            overflow-y:hidden;
            scroll-snap-type:x mandatory;
            -webkit-overflow-scrolling:touch;
            scrollbar-width:none;
            padding:0 7.5vw 8px;
            margin:0 -20px;
            touch-action:pan-x;
            overscroll-behavior-x:contain;
          }
          .scams::-webkit-scrollbar{display:none}
          .scam-card{
            flex:0 0 85vw;
            scroll-snap-align:center;
            scroll-snap-stop:always;
            padding:22px 20px;
            gap:14px;
          }
          .scams-dots{display:flex;justify-content:center;gap:8px;margin-top:18px}
          .scams-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,0.18);transition:background .25s,width .25s;display:block}
          .scams-dot.active{background:var(--pink);width:22px;border-radius:6px}
          .plan{padding:22px;gap:14px;max-width:380px;margin:0 auto;width:100%}
          .plan-price{font-size:38px}
          .hero{padding:110px 20px 40px}
          .final{padding:80px 20px 60px}
          .pricing{gap:14px}
          .hero-stats{flex-direction:column;gap:8px;border:none;padding:0;background:transparent;align-items:center}
          .hero-stats>span{display:inline-block;border:1px solid var(--border-strong);background:rgba(255,255,255,0.03);border-radius:999px;padding:7px 16px;font-size:12px}
        }
      `}</style>

      <div dangerouslySetInnerHTML={{ __html: PAGE_HTML }} />
    </>
  );
}
