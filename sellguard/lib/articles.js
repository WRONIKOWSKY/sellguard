// Articles du blog SellCov
// Chaque article est un objet avec : slug, title, description, date, readTime, content (JSX)
// Pour ajouter un article, il suffit d'en créer un nouveau dans ce tableau.

export const ARTICLES = [
  {
    slug: "top-5-arnaques-vinted-2026",
    title: "Les 7 arnaques Vinted les plus fréquentes en 2026 (et comment t'en protéger)",
    description: "Tour d'horizon des arnaques qui coûtent le plus cher aux vendeurs Vinted, avec des stratégies concrètes pour ne plus en être victime.",
    date: "2026-05-03",
    readTime: "8 min",
    category: "Guide vendeur",
    content: [
      { type: "p", text: "Si tu vends régulièrement sur Vinted, tu as probablement déjà eu un litige tordu : un acheteur qui prétend ne pas avoir reçu son colis, un autre qui ouvre un retour en disant que l'article ne ressemble pas aux photos, un troisième qui réclame un remboursement trois semaines après réception. Voici les sept arnaques qui reviennent le plus, et la stratégie concrète pour ne plus tomber dans le piège." },

      { type: "h2", text: "1. Le colis « jamais reçu »" },
      { type: "p", text: "C'est la reine des arnaques. L'acheteur ouvre un litige en prétendant n'avoir rien reçu, alors que le tracking indique « livré ». Vinted te demande des preuves. Sans preuve solide de dépôt, la plateforme se range souvent du côté de l'acheteur." },
      { type: "p", text: "Comment t'en protéger : filme le dépôt en relais ou en bureau de poste, en montrant clairement le colis, l'étiquette et le récépissé. Si possible, demande un récépissé papier au commerçant. Ces deux éléments combinés rendent l'arnaque quasi impossible." },

      { type: "h2", text: "2. L'article « abîmé à la réception »" },
      { type: "p", text: "L'acheteur prend une photo de ton article avec un défaut qui n'existait pas, ou qu'il a lui-même créé. Il demande remboursement total ou partiel." },
      { type: "p", text: "Comment t'en protéger : avant de fermer le colis, filme l'article sous tous les angles, en éclairage naturel. Mentionne explicitement les éventuels défauts existants à voix haute pendant la captation. La vidéo horodatée prouve l'état exact à l'envoi." },

      { type: "h2", text: "3. La réclamation tardive" },
      { type: "p", text: "Trois semaines après réception, l'acheteur revient en disant que l'article a un défaut ou qu'il ne fonctionne plus. Il réclame un remboursement, parfois après avoir utilisé l'article ou tenté de le revendre lui-même." },
      { type: "p", text: "Comment t'en protéger : un certificat horodaté à la seconde près de l'envoi prouve l'état exact au moment du départ. Toute usure post-réception est attribuable à l'acheteur." },

      { type: "h2", text: "4. La substitution d'article au retour" },
      { type: "p", text: "Tu acceptes un retour. L'acheteur renvoie un article différent (vieux, abîmé, contrefaçon) en prétendant que c'est ce que tu avais expédié. Tu te retrouves remboursé d'un article authentique avec une contrefaçon en main." },
      { type: "p", text: "Comment t'en protéger : refuse les retours sans raison sérieuse, et si tu acceptes, demande à l'acheteur de filmer l'ouverture en présence du livreur. Conserve ta vidéo d'envoi originale comme preuve de ce que tu avais expédié." },

      { type: "h2", text: "5. Le paiement détourné" },
      { type: "p", text: "L'acheteur te contacte hors plateforme pour proposer un paiement direct (PayPal Friends, virement). Une fois reçu, il ouvre un litige PayPal en prétendant ne pas avoir reçu l'article, et récupère son argent." },
      { type: "p", text: "Comment t'en protéger : ne quitte JAMAIS la plateforme pour le paiement. Vinted, Depop et Leboncoin offrent une protection que les paiements directs n'ont pas." },

      { type: "h2", text: "6. Le faux acheteur fantôme" },
      { type: "p", text: "Tu reçois une commande, tu prépares le colis, tu l'envoies. Le « faux acheteur » utilise un compte volé. Quelques jours après, le vrai propriétaire du compte signale la fraude. Tu te fais débiter l'argent et tu n'as plus l'article." },
      { type: "p", text: "Comment t'en protéger : pour les transactions importantes (>100 €), vérifie l'âge du compte acheteur (un compte créé hier est suspect), ses évaluations, son nombre de ventes/achats. Privilégie les acheteurs avec historique." },

      { type: "h2", text: "7. La fausse réclamation pour gratter" },
      { type: "p", text: "L'article est conforme, l'envoi parfait. Mais l'acheteur invente un problème mineur (couture qui dépasse, fil tiré, odeur) pour demander un remboursement partiel. Beaucoup de vendeurs cèdent par lassitude." },
      { type: "p", text: "Comment t'en protéger : ne cède jamais sans preuve. Demande des photos précises. Si la vidéo horodatée à l'envoi montre l'état parfait, tu peux refuser le remboursement avec une preuve solide." },

      { type: "h2", text: "Le réflexe à adopter dès maintenant" },
      { type: "p", text: "Toutes ces arnaques ont un point commun : elles fonctionnent parce que tu n'as pas de preuve solide à opposer. Une simple photo prise avec ton téléphone peut être contestée (« tu peux l'avoir prise après »). Une vidéo horodatée avec signature cryptographique, recevable comme moyen de preuve au sens de l'article 1358 du Code civil, est beaucoup plus difficile à attaquer." },
      { type: "p", text: "Le mieux reste de prendre l'habitude, à chaque envoi : filmer 90 secondes l'article, son emballage, la fermeture du colis et l'étiquette. C'est exactement ce que SellCov automatise avec un certificat horodaté que tu peux partager à l'acheteur ou à la plateforme en cas de litige." },
      { type: "cta", href: "/protection", label: "Certifier mon prochain envoi" },
    ],
  },
];

export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

export function listArticles() {
  return [...ARTICLES].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}
