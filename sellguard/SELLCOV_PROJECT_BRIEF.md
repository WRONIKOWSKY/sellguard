# SellCov — Fiche projet & roadmap pivot

> Document de référence à ajouter au projet Claude Cowork "ANALYSE / CRITIQUE DE SELLCOV".
> Dernière mise à jour : 2026-05-04

---

## 0. Contexte fondateur

**Qui** : Thomas Neaume — réalisateur, photographe, acteur. Solo founder.
**Compétences** : forte production de contenu vidéo (TikTok, vidéo, photo), capacité d'exécution exceptionnelle (a appris GitHub, Vercel, Supabase et construit SellCov V1 en 3 semaines partant de zéro tech).
**Faiblesses connues** : zéro expérience B2B sales, pas de réseau investisseurs, solo (donc bande passante limitée).
**Objectif déclaré** : construire un projet avec potentiel de levée de fonds et d'exit (rachat investisseur), pas un side business.

---

## 1. État du projet au 2026-05-04

**Produit** : SaaS preuve vidéo cryptographiquement horodatée (SHA-256 + HMAC) + IA défense litige.
**Stack** : Next.js 14 + Supabase + Vercel. Domaine sellcov.com.
**Ce qui est en place** :
- Landing multilingue (FR/EN/ES/IT)
- Système de génération de certificat vidéo
- Page de vérification publique d'un certificat (`/verify/[certId]`)
- Pages : protection, annonce, litige, calculateur, ventes, historique, compte
- Auth utilisateurs via Supabase
- Présence Insta @sellcov + TikTok @sellcov.com
- Pricing initial : 0€ / 4,90€ / 14,90€ par mois

**Traction réelle** : 0 utilisateur, pas encore lancé publiquement.
**Investissement total** : ~1 mois de dev + < 100€ cash. **Sunk cost négligeable.**

**Action récente (2026-05-04)** : la homepage `pages/index.js` a été remplacée par une version stealth avec capture email vers une table Supabase `waitlist`. L'ancienne homepage est sauvegardée en `pages/index_v1_vinted_backup.js`. Toutes les autres pages restent accessibles. Le pivot est en cours.

---

## 2. Pourquoi SellCov V1 (positionnement vendeur Vinted) est voué à l'échec

Synthèse condensée du diagnostic. Treize raisons cumulatives :

1. **Arithmétique défavorable** : un vendeur Vinted moyen perd 25-50€/an en arnaques, on lui demande 58€/an.
2. **Pas de douleur au moment de l'achat** : on n'achète pas une assurance avant de s'être brûlé.
3. **Vinted concurrence gratuitement** via sa Protection Acheteurs et son centre de litiges intégré.
4. **L'argument juridique (articles 1366/1358) ne s'applique pas en pratique** : Vinted/Leboncoin/Depop sont juges et parties via leurs CGU, et personne n'attaque en justice pour 25€.
5. **Cible coincée au milieu** : 4,90€/mois trop cher pour les occasionnels, trop bas pour les pros.
6. **Pas de "pourquoi maintenant"** : aucune réglementation neuve, pas de scandale médiatique, vent contraire (Vinted pousse de l'IA anti-fraude).
7. **CAC ≥ LTV mécaniquement** : LTV particulier ~15€, CAC minimum ~8-15€. Marge proche de zéro.
8. **Aucune defensibility** : SHA-256/HMAC reproductible en un weekend, pas de moat.
9. **Pas d'effet de réseau** : croissance forcément linéaire et coûteuse.
10. **Audience non monétisable** : TikTok "arnaque Vinted" attire des particuliers qui veulent des solutions gratuites.
11. **Marché plafond bas** : TAM réaliste FR ~10-15M€/an, capture 1% = lifestyle business médiocre.
12. **Aucun investisseur sérieux ne suivra** : pas de comparable d'exit B2C, pas de thèse VC.
13. **Aucun acquéreur naturel** : Vinted ne te rachètera pas (reproductible en interne).

**Conclusion** : V1 = vendre une assurance abstraite à un prix supérieur au risque, sur un marché plafonné, sans defensibility, sans investisseur, sans exit.

---

## 3. Le pivot retenu : V2 "Chargeback Recovery for SMB e-commerce"

### En une phrase
*"L'infrastructure de preuve cryptographique qui permet aux marchands e-commerce de récupérer 40% de leurs chargebacks Stripe et PayPal automatiquement."*

### Vision long terme (3-5 ans)
Devenir l'équivalent de Truepic pour le e-commerce : une infrastructure de preuve digitale (SDK + API) intégrée par les marketplaces SMB, les processeurs de paiement et les assureurs e-commerce, en commençant par un produit self-serve pour PME marchandes.

### Le problème résolu
Les chargebacks (rétrofacturations) coûtent **100 milliards $/an** au commerce mondial. Un marchand e-commerce qui se fait contester un paiement par un acheteur via sa banque perd l'argent ET la marchandise, plus 15-25€ d'amende. Il a 7-21 jours pour contester avec des preuves, et avec preuves il récupère 40-60% des cas. Sans preuves : il perd quasi systématiquement.

SellCov V2 fournit la preuve d'expédition (vidéo cryptographiquement horodatée du colis, étiquette filmée, état du produit) prête à être uploadée dans le formulaire de dispute Stripe/PayPal.

### Cible (3 personas pros)
1. **Dropshipper Shopify FR** : 5-50k€/mois CA, subit chargebacks à cause de délais de livraison longs. Présent sur Discord/Facebook ecom.
2. **Friperie en ligne pro** : 100-500 ventes/mois sur Vinted Pro/Shopify/eBay, marges fines, chaque arnaque fait mal.
3. **Revendeur sneakers/streetwear pro** : tickets élevés (200-2000€), un chargeback fait très mal. Communauté Discord active.

**Marché adressable** : 40-60k entreprises en France, 500k+ en Europe.

### Solution / fonctionnalités
- App mobile pour filmer l'expédition en 90 secondes
- Génération automatique d'un certificat cryptographique (déjà construit en V1)
- Intégration Stripe Disputes API : le certificat s'upload directement dans la réponse au dispute
- Intégration PayPal Disputes API
- À terme : intégration Shopify, Klarna, Afterpay
- IA défense : génère automatiquement le texte d'argumentaire de réponse
- Dashboard avec taux de récupération des chargebacks

### Pricing cible
- **Starter** 49€/mois : jusqu'à 10 disputes/mois
- **Growth** 99€/mois : jusqu'à 50 disputes/mois (offre cœur de cible)
- **Pro** 199€/mois : illimité + intégrations multiples
- **À explorer plus tard** : success-fee 15% du montant récupéré

### Pourquoi c'est meilleur (vs V1)
- ROI client calculable en 30 secondes (perte de 800€/mois → récupère 320€ pour 99€)
- Douleur fraîche et récurrente (chargebacks tombent toutes les semaines)
- Pas de concurrence gratuite native (Stripe/PayPal donnent l'outil mais pas la preuve)
- LTV/CAC sain (~6-12x)
- Marché énorme (TAM mondial >50B$)
- Comparables d'investissement (Truepic 26M$ Series B, Chargeflow 14M$ Series A, Justt 100M$+, Riskified IPO 3,3B$)
- Acquéreurs naturels nombreux (Stripe, PayPal, Shopify, Mastercard, Visa, Adobe, assureurs)

---

## 4. Plan d'évolution par phases

### Phase 0 — Stealth (FAIT, 2026-05-04)
- [x] Homepage stealth avec capture email
- [x] Backup ancienne version
- [x] Table `waitlist` Supabase
- [x] Toutes les autres pages restent accessibles

### Phase 1 — Discovery marché (semaines 1-2)
**Objectif** : valider que la douleur "chargeback" est réelle et que le pricing 49-99€ tient.

Actions :
- Rejoindre 5 Discord et groupes Facebook ecom français (Ecom Empire, Dropizi, Shopify France, communautés dropshipping)
- Lire 1 semaine sans intervenir, noter chaque mention de chargeback/dispute/arnaque acheteur
- Envoyer 30 DM à des marchands Shopify français (LinkedIn + DM Insta des boutiques publiques)
- Faire 5-10 appels exploratoires de 20 min, 4 questions :
  1. Combien de chargebacks par mois ?
  2. Combien d'argent perdu chaque mois ?
  3. Que fais-tu aujourd'hui pour les contester ?
  4. Paierais-tu X€/mois pour récupérer 40% en plus ?
- Noter tout dans un fichier de discovery

**Critère go/no-go** : si 3+ marchands sur 10 confirment perdre >300€/mois et n'ont pas de bonne solution → continuer. Sinon, revoir l'angle.

### Phase 2 — Repositionnement (semaines 3-4)
**Objectif** : transformer la stealth page en vraie landing V2.

Actions :
- Refaire la homepage : nouveau headline "Récupère 40% de tes chargebacks Stripe & PayPal", nouvelle vidéo demo, nouveau pricing 49/99/199€
- Créer une page de calcul ROI ("combien tu peux récupérer ?")
- Créer une page "comment ça marche" en 3 étapes
- Garder la techno backend existante (certificats, vérification, etc.)
- Préparer 4 vidéos TikTok ciblées marchands ecom (pas vendeurs Vinted)
- Email à la waitlist pour annoncer la V2

### Phase 3 — Premiers pilotes gratuits (mois 2)
**Objectif** : avoir 5-10 marchands utilisant le produit en pilote gratuit pendant 4 semaines, pour générer des cas concrets et des testimonials.

Actions :
- Approcher en DM les marchands rencontrés en Phase 1
- Proposer pilote gratuit 1 mois en échange de feedback hebdomadaire
- Suivre chaque pilote individuellement (Slack ou WhatsApp dédié)
- Documenter chaque cas (avant/après, montant récupéré, temps gagné)

### Phase 4 — Première intégration technique (mois 2-3)
**Objectif** : intégration Stripe Disputes API fonctionnelle.

Actions :
- Lire la doc Stripe Disputes (10 min)
- Créer un compte Stripe Test
- Implémenter via Cursor/Claude :
  - OAuth Stripe Connect (le marchand connecte son compte d'un clic)
  - Récupération des disputes en cours
  - Upload du certificat dans `evidence` du dispute
  - Webhook Stripe pour notifier d'un nouveau chargeback
- Tester en sandbox sur 5 cas synthétiques
- Déployer en production
- Faire la même chose pour PayPal Disputes API en deuxième

**Estimation effort** : 3-4 semaines en bossant à temps plein, seul, avec assistance IA. Faisable au vu du niveau démontré sur SellCov V1.

### Phase 5 — Conversion en payants (mois 3)
**Objectif** : convertir 2-3 pilotes en clients payants à 49-99€/mois.

Actions :
- Conversation 1-1 à la fin du pilote : "ça t'a aidé ? veux-tu continuer à 49€/mois ?"
- Critère go/no-go critique : si 0 conversion sur 5 pilotes → tuer le pivot et revoir
- Si 2-3 conversions → confirmation que la thèse tient

**KILL CRITERIA À 90 JOURS** : si pas un seul client payant à 49€+/mois, on enterre SellCov complètement. Pas de mois 4 d'auto-persuasion.

### Phase 6 — Scale & contenu (mois 4-6)
**Objectif** : passer de 2-3 clients à 20-30 clients (~2-3k€ MRR).

Actions :
- Publier 2 vidéos TikTok par semaine ciblées marchands ecom
- Articles SEO long-tail : "comment contester un chargeback Stripe", "récupérer un dispute PayPal", etc.
- Outbound LinkedIn : 50 DM par semaine à des fondateurs Shopify français
- Apparaître sur 3-5 podcasts ecom français
- Affiliés / partenariats avec coachs ecom

### Phase 7 — Préparation levée pré-seed (mois 6-12)
**Objectif** : lever 300-800k€ en pre-seed pour 18 mois de runway et premiers hires.

Conditions à remplir avant d'aller voir les VCs :
- 5-10k€ MRR récurrents
- 30+ clients payants
- Au moins une intégration partenaire signée (marketplace, processeur de paiement, ou assureur)
- Cas chiffrés solides ("nos clients récupèrent en moyenne 38% de leurs chargebacks")
- Cofondateur tech ou premier hire dev identifié

Investisseurs early-stage français à approcher : Kima Ventures, Frst, Hexa, Daphni, Newfund, Serena, Ventech.

Pitch en une phrase : *"Truepic + Chargeflow pour les SMB européennes — 100B$ de pertes chargebacks à adresser, comparables d'exit Riskified à 3,3B$."*

---

## 5. KPIs à suivre

### Phase Discovery (semaines 1-4)
- Nombre de calls discovery réalisés
- % de marchands confirmant la douleur chargeback
- % prêts à payer 49€+/mois en pré-commande verbale

### Phase Pilotes (mois 2-3)
- Nombre de pilotes actifs
- Nombre de chargebacks traités
- Taux de récupération moyen
- NPS / satisfaction qualitative

### Phase Scale (mois 3+)
- MRR (revenu mensuel récurrent)
- Nombre de clients payants
- Churn mensuel (% qui se désabonnent)
- CAC (coût d'acquisition par client)
- LTV/CAC ratio (cible : >3, idéal >6)
- Taux de conversion landing → trial → paid

---

## 6. Risques connus et mitigations

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Solo founder épuisé | Élevée | Élevé | Limiter scope au strict nécessaire en phase 1-3, recruter cofondateur dès phase 5 |
| Cycle B2B trop long, no revenu pendant 4-6 mois | Élevée | Moyen | Garder un revenu personnel parallèle (réa/photo), bootstrap sans pression |
| Concurrence existante (Chargeflow, Justt, Disputifier) | Élevée | Moyen | Wedge unique = preuve vidéo cryptographique en amont (personne d'autre ne fait ça) ; cible PME négligée par concurrents qui visent les gros marchands |
| Difficulté technique intégration Stripe/PayPal | Moyenne | Moyen | Cursor/Claude + doc Stripe (la meilleure du marché) ; freelance ponctuel à 2-5k€ si vraiment bloqué |
| Stripe/PayPal lance la même fonctionnalité en interne | Faible | Élevé | Construire vite, signer marchands, devenir l'option par défaut avant qu'ils bougent ; possible exit si ça arrive |
| Pivot lui-même se révèle faux | Moyenne | Élevé | Kill criteria à 90 jours stricts (pas de client payant = on enterre) |

---

## 7. Stack technique et compétences à acquérir

### Déjà maîtrisé (V1)
- Next.js 14 / React
- Supabase (auth, DB, storage)
- Vercel deployment
- Crypto basique (SHA-256, HMAC)
- Routes API Next.js
- styled-jsx / CSS

### À apprendre pour V2
- Stripe API (Disputes endpoint, OAuth Connect, webhooks)
- PayPal API (Disputes endpoint)
- Webhooks et leur sécurisation
- Files queue (pour traiter les disputes en volume, plus tard)
- App mobile React Native ou Expo (pour l'app de capture vidéo, optionnel mais recommandé)

### À déléguer ou repousser
- Compliance RGPD B2B (DPA contracts) → avocat ponctuel ~800€
- App store submission Shopify (long et chiant) → reporter à plus tard ou freelance
- Sécurité audit / pentest → après PMF, pas avant

---

## 8. Comparables et inspirations

### Concurrence directe (chargeback recovery)
- **Chargeflow** (Israël/US, 14M$ Series A 2022) : success-fee, vise les gros marchands Shopify
- **Justt** (Israël, valorisé >100M$) : automation chargeback IA pour mid-market
- **Disputifier** (Canada) : approche similaire pour Shopify
- **ChargebackHelp** (US) : ancien acteur

**Différenciation SellCov** : seul à proposer une preuve vidéo cryptographique en amont de l'expédition. Les autres traitent le dispute en aval avec données existantes. Notre wedge = qualité de preuve supérieure = meilleur taux de récupération.

### Inspiration techno
- **Truepic** (US, 26M$ Series B) : exactement notre techno (preuve photo/vidéo C2PA cryptographique) appliquée à d'autres marchés (assurance, immobilier, journalisme). Notre référence absolue.
- **Standard C2PA** (Adobe, Microsoft, BBC, Sony) : initiative officielle de standardisation de la preuve digitale. À suivre et idéalement à intégrer.

### Comparables d'exit / valorisation
- **Riskified** : IPO 2021 à 3,3B$ (fraud prevention e-commerce)
- **Forter** : 3B$ valorisation (fraud prevention)
- **Signifyd** : 1,3B$ (idem)
- **Ethoca** : rachetée par Mastercard 2019 (chargeback intelligence)
- **Multiples typiques SaaS B2B fintech** : 8-15x ARR

---

## 9. Glossaire (pour Thomas qui débute)

- **Chargeback (rétrofacturation)** : quand un acheteur conteste un paiement auprès de sa banque ; le marchand perd l'argent + amende.
- **B2B** (business-to-business) : vendre à des entreprises, pas à des particuliers.
- **B2C** (business-to-consumer) : vendre à des particuliers.
- **SaaS** : Software-as-a-Service, logiciel en abonnement (comme Netflix mais pour pros).
- **MRR** : Monthly Recurring Revenue, le revenu mensuel récurrent (somme des abonnements actifs).
- **ARR** : Annual Recurring Revenue, MRR × 12.
- **LTV** : Lifetime Value, combien un client te rapporte sur toute la durée de la relation.
- **CAC** : Customer Acquisition Cost, combien tu dépenses pour acquérir un client.
- **LTV/CAC ratio** : un ratio sain est >3, excellent >6. Mesure la rentabilité de l'acquisition.
- **Churn** : taux de désabonnement mensuel. Sain B2B SMB : <5%/mois.
- **API** : Application Programming Interface, manière dont deux logiciels se parlent (Stripe API = manière de parler à Stripe depuis ton code).
- **SDK** : Software Development Kit, librairie prête à intégrer dans le code d'un client.
- **Webhook** : un endpoint sur ton site que Stripe appelle pour te notifier en temps réel d'un événement (nouveau chargeback, paiement reçu, etc.).
- **OAuth** : protocole standard pour permettre à un utilisateur de connecter son compte Stripe/Google/etc. à ton app sans donner son mot de passe.
- **PMF** : Product-Market Fit, le moment où ton produit répond clairement à un besoin et la croissance devient organique.
- **Pre-seed / Seed / Series A** : tours d'investissement par taille croissante (pre-seed ~300k€, seed ~1-3M€, Series A ~5-15M€).
- **Wedge** : angle d'attaque unique sur un marché, ce qui te différencie clairement.
- **Stealth** : mode discret avant lancement public.
- **Discovery** : phase d'exploration et d'entretiens utilisateurs pour valider une hypothèse.
- **Pilote** : test gratuit ou symbolique avec un client, pour valider le produit en vrai.
- **Outbound** : aller chercher activement des prospects (cold email, LinkedIn, DM).
- **Inbound** : faire venir les prospects à soi (SEO, contenu, pub).
- **TAM** (Total Addressable Market) : taille totale du marché théorique adressable.
- **Bootstrap** : construire sans investisseur, en autofinancement.

---

## 10. Décisions actées (à ne pas remettre en cause sans nouvelle data)

- **2026-05-04** : pivot du positionnement vendeur Vinted vers chargeback recovery B2B. Validé par diagnostic complet, sunk cost négligeable. Source de vérité de cette décision : ce document.
- **2026-05-04** : homepage passée en stealth, ancienne version sauvegardée.
- **Kill criteria 90 jours** : si pas un seul client payant au 2026-08-04, on enterre SellCov.

---

## 11. Prochaine action concrète

**Demain matin** :
1. Créer la table `waitlist` dans Supabase (SQL fourni)
2. Tester la nouvelle homepage en local
3. `git push` pour déployer la stealth en prod
4. Rejoindre 5 Discord/groupes Facebook ecom français et lire pendant 48h sans intervenir

**Cette semaine** : envoyer 30 DM à des marchands Shopify français pour décrocher 5-10 calls discovery.

**Dans 2 semaines** : bilan discovery, décision go/no-go pour Phase 2 (repositionnement).
