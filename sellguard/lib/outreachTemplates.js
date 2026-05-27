// Templates email pour le démarchage cohorte fondateurs.
// Édite directement ce fichier pour ajuster le copy.
//
// Placeholders disponibles :
//   {{firstName}}     prénom (fallback "")
//   {{handle}}        @handle Insta/Vinted/etc
//   {{platform}}      "Vinted Pro" / "Depop" / "Grailed" / "Vestiaire Collective" / "Etsy" / "Autre"
//   {{personalHook}}  1 phrase perso sur leur compte (curation, drop, pièce vue)
//
// Si un placeholder n'a pas de valeur, on remplace par "" et la ligne est
// nettoyée (espaces doubles supprimés).

export const INITIAL = {
  subject: "Salut {{firstName}}, un mot d'un revendeur vintage à un autre",
  body: `Salut {{firstName}},

Tombé sur {{handle}} sur {{platform}}. {{personalHook}}

Je suis Thomas. J'ai bossé plusieurs années dans le milieu parisien du vintage. J'ai vendu un paquet de pièces sur Vinted, Leboncoin, eBay, Grailed. Et comme beaucoup d'entre vous, je me suis pris des litiges qui n'avaient aucun sens : décisions arbitraires de bots Vinted, scams classiques sur eBay, acheteurs qui dégradent volontairement la pièce pour la renvoyer et gagner un litige.

Des situations qui m'ont fatigué. Parfois dégoûté d'un métier qui reste, pour moi, avant tout un métier passion.

Mais soyons clairs : si on est là, c'est aussi pour le business. Le marché du vintage et de la seconde main en France pèse plusieurs milliards d'euros et continue de grossir vite. Vinted seul dépasse les 23 millions d'utilisateurs en France, Depop et Grailed explosent côté streetwear et archive. Le potentiel est énorme.

Sauf que le système est cassé d'un côté : les acheteurs sont protégés à mort, les vendeurs se débrouillent. Tu envoies une pièce à 400 balles, l'acheteur ouvre un litige "jamais reçu" trois semaines après, et tu te retrouves à devoir prouver l'imprévisible. Si t'as pas la preuve, t'as perdu.

J'ai construit SellCov pour ça.

Tu filmes ton envoi en 30 secondes. La vidéo est horodatée, signée cryptographiquement, et l'empreinte est inscrite dans la blockchain Bitcoin. Personne, pas même nous, ne peut modifier la date ou le contenu après coup. L'acheteur sait que la preuve existe. Souvent l'arnaqueur lâche avant même d'ouvrir le litige.

J'ouvre une cohorte de 10 fondateurs ce mois-ci.

- 30 jours d'accès complet, sans CB
- Mise en place visio avec moi (15 min)
- Tarif fondateur verrouillé à vie ensuite, sous le prix public

Si tu veux qu'on en parle, dis-moi quel créneau t'arrange cette semaine.

Voici un cert en vrai pour te faire une idée : https://www.sellcov.com/verify/SC-M5QTSF2Q

Thomas
sellcov.com · @sellcov`,
};

export const FOLLOWUP_J3 = {
  subject: "Re: Salut {{firstName}}, un mot d'un revendeur vintage à un autre",
  body: `Hello {{firstName}},

Je relance vite, au cas où mon mail soit passé sous le radar.

J'ai déjà 2 fondateurs validés sur les 10 places de la cohorte. Si tu veux que je te montre SellCov en visio (15 min), dis-moi un créneau cette semaine.

Sinon, jeter un œil à un cert en vrai : https://www.sellcov.com/verify/SC-M5QTSF2Q

Thomas`,
};

export const FOLLOWUP_J7 = {
  subject: "Re: Salut {{firstName}}, un mot d'un revendeur vintage à un autre",
  body: `Hello {{firstName}},

Dernière relance promis.

Si le timing est mauvais ou que c'est pas pour toi, no stress, je te laisse tranquille.

Si tu veux qu'on s'appelle 15 min pour la cohorte fondateurs (29€/mois verrouillé à vie après les 30 jours offerts), c'est maintenant ou plus jamais à ce tarif.

Thomas
sellcov.com`,
};

export const TEMPLATES = {
  initial: INITIAL,
  j3: FOLLOWUP_J3,
  j7: FOLLOWUP_J7,
};

// Remplit les placeholders. Tolérant aux valeurs vides.
export function renderTemplate(tpl, vars) {
  const safe = {
    firstName: (vars.firstName || "").trim(),
    handle: (vars.handle || "").trim(),
    platform: (vars.platform || "").trim(),
    personalHook: (vars.personalHook || vars.raw_notes || "").trim(),
  };
  function fill(s) {
    return s
      .replace(/\{\{firstName\}\}/g, safe.firstName)
      .replace(/\{\{handle\}\}/g, safe.handle)
      .replace(/\{\{platform\}\}/g, safe.platform)
      .replace(/\{\{personalHook\}\}/g, safe.personalHook)
      .replace(/Salut ,/g, "Salut,")
      .replace(/Hello ,/g, "Hello,")
      .replace(/ {2,}/g, " ")
      .replace(/ \./g, ".")
      .replace(/\n /g, "\n");
  }
  return { subject: fill(tpl.subject), body: fill(tpl.body) };
}
