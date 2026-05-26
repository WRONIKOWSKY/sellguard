import LegalLayout from "../components/LegalLayout";

export default function Confidentialite() {
  return (
    <LegalLayout
      title="Politique de confidentialité"
      description="Politique de confidentialité de SellCov — traitement des données personnelles, RGPD."
      frenchOnly
    >
      <h1 className="legal-title">Politique de confidentialité.</h1>
      <p className="legal-subtitle">Version 1.0. En vigueur à compter du 1er mai 2026. Dernière mise à jour : 3 mai 2026.</p>

      <div className="legal-content">
        <h2>Article 1. Identité du responsable de traitement</h2>
        <p>Le service SellCov (ci-après « le Service ») est édité à titre personnel dans le cadre d'un projet en bêta privée, en cours de structuration juridique. Aucune transaction commerciale n'est effectuée à ce jour.</p>
        <p>Pour toute question relative au traitement de tes données personnelles, tu peux écrire à <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>.</p>

        <h2>Article 2. Données personnelles collectées</h2>
        <p>SellCov collecte et traite les catégories de données suivantes :</p>
        <ul>
          <li><strong>Données de compte</strong> : adresse email, identifiant utilisateur, date de création du compte.</li>
          <li><strong>Données de certification</strong> : vidéos horodatées que tu enregistres, métadonnées (date, taille, empreinte SHA-256, signature cryptographique).</li>
          <li><strong>Données d'envoi</strong> : nom de l'article, référence commande, transporteur, numéro de suivi (renseignés par toi).</li>
          <li><strong>Données techniques</strong> : type d'appareil (user agent), adresse IP au moment de la connexion, logs de connexion.</li>
          <li><strong>Données d'usage</strong> : nombre de certificats générés par jour, type d'opération (analyze, protection, litige).</li>
        </ul>
        <p>SellCov ne collecte aucune donnée sensible au sens de l'article 9 du RGPD (origine ethnique, opinions politiques, religieuses, données de santé, etc.).</p>

        <h2>Article 3. Finalités du traitement</h2>
        <p>Tes données sont traitées pour les finalités suivantes :</p>
        <ul>
          <li>Création et gestion de ton compte utilisateur.</li>
          <li>Génération, signature et conservation des certificats de preuve vidéo.</li>
          <li>Mise à disposition de la page publique de vérification de chaque certificat.</li>
          <li>Application des quotas d'usage et facturation éventuelle.</li>
          <li>Sécurité du Service (détection d'abus, fraude).</li>
          <li>Communication transactionnelle (lien de connexion magic link, confirmations).</li>
          <li>Amélioration du Service (statistiques agrégées et anonymisées).</li>
        </ul>

        <h2>Article 4. Base légale</h2>
        <p>Le traitement de tes données repose sur :</p>
        <ul>
          <li><strong>L'exécution du contrat</strong> qui te lie à SellCov (article 6.1.b du RGPD), pour les fonctionnalités du Service que tu utilises.</li>
          <li><strong>Notre intérêt légitime</strong> (article 6.1.f du RGPD) à assurer la sécurité, la prévention de la fraude et l'amélioration du Service.</li>
          <li><strong>Tes obligations légales</strong> qui nous incombent (conservation des données comptables, réponse aux requêtes des autorités, etc.).</li>
        </ul>

        <h2>Article 5. Durée de conservation</h2>
        <p>Tes données sont conservées pendant les durées suivantes :</p>
        <ul>
          <li><strong>Données de compte</strong> : pendant toute la durée de ton inscription, puis 3 ans après suppression du compte (sauf opposition de ta part).</li>
          <li><strong>Vidéos de certification</strong> : 5 ans à compter de leur création, durée correspondant au délai de prescription civile applicable aux litiges entre particuliers (article 2224 du Code civil).</li>
          <li><strong>Logs techniques de connexion</strong> : 12 mois.</li>
          <li><strong>Données de facturation</strong> : 10 ans (obligation légale comptable).</li>
        </ul>
        <p>À l'issue de ces durées, tes données sont supprimées de manière sécurisée ou anonymisées.</p>

        <h2>Article 6. Destinataires et sous-traitants</h2>
        <p>Tes données sont accessibles uniquement aux personnes habilitées au sein de SellCov, ainsi qu'aux sous-traitants techniques suivants, qui agissent sur instruction écrite de SellCov dans le respect du RGPD :</p>
        <ul>
          <li><strong>Supabase Inc.</strong> (États-Unis, certifié Data Privacy Framework) : authentification, base de données, stockage des vidéos chiffrées.</li>
          <li><strong>Vercel Inc.</strong> (États-Unis, certifié Data Privacy Framework) : hébergement de l'application web et CDN.</li>
          <li><strong>Anthropic PBC</strong> (États-Unis) : analyse d'images et génération de texte par intelligence artificielle pour les fonctionnalités d'annonce et de défense de litige. Aucune vidéo de certification n'est transmise à Anthropic.</li>
        </ul>
        <p>Tes données ne sont ni vendues, ni louées, ni cédées à des tiers à des fins commerciales ou publicitaires.</p>

        <h2>Article 7. Transferts hors Union européenne</h2>
        <p>Certains de nos sous-traitants sont établis aux États-Unis. Les transferts de données vers ces sous-traitants sont encadrés par le Data Privacy Framework UE-États-Unis et, le cas échéant, par des Clauses Contractuelles Types adoptées par la Commission européenne, conformément aux articles 45 et 46 du RGPD.</p>

        <h2>Article 8. Sécurité</h2>
        <p>SellCov met en œuvre des mesures techniques et organisationnelles pour assurer la sécurité de tes données :</p>
        <ul>
          <li>Chiffrement des communications (HTTPS/TLS).</li>
          <li>Chiffrement des vidéos de certification au repos dans le stockage Supabase.</li>
          <li>Authentification par lien à usage unique (magic link), sans mot de passe stocké.</li>
          <li>Signature cryptographique HMAC SHA-256 garantissant l'intégrité des certificats.</li>
          <li>Politiques de sécurité au niveau base de données (Row Level Security) restreignant l'accès aux données du seul utilisateur concerné.</li>
          <li>Quotas d'usage et détection d'abus.</li>
        </ul>

        <h2>Article 9. Cookies et traceurs</h2>
        <p>SellCov utilise uniquement des cookies strictement nécessaires au fonctionnement du Service :</p>
        <ul>
          <li><strong>Cookies d'authentification</strong> (Supabase) : pour maintenir ta session de connexion.</li>
          <li><strong>Stockage local</strong> (langue choisie, préférences d'affichage) : conservé dans ton navigateur, jamais transmis à SellCov.</li>
        </ul>
        <p>SellCov utilise une solution d'analyse statistique respectueuse de la vie privée (Plausible Analytics), qui ne dépose aucun cookie et n'agrège que des données anonymisées (pages visitées, source de trafic). Aucune donnée personnelle identifiante n'est collectée par cet outil.</p>
        <p>SellCov n'utilise aucun cookie publicitaire, de tracking tiers, de partage avec des plateformes sociales, ni de profilage à des fins commerciales.</p>

        <h2>Article 10. Tes droits</h2>
        <p>Conformément aux articles 15 à 22 du RGPD, tu disposes des droits suivants sur tes données personnelles :</p>
        <ul>
          <li><strong>Droit d'accès</strong> : obtenir une copie des données te concernant.</li>
          <li><strong>Droit de rectification</strong> : corriger toute donnée inexacte ou incomplète.</li>
          <li><strong>Droit à l'effacement</strong> : demander la suppression de tes données, sous réserve des obligations légales de conservation.</li>
          <li><strong>Droit à la limitation</strong> du traitement.</li>
          <li><strong>Droit à la portabilité</strong> : recevoir tes données dans un format structuré et lisible par machine.</li>
          <li><strong>Droit d'opposition</strong> au traitement fondé sur un intérêt légitime.</li>
          <li><strong>Droit de retirer ton consentement</strong> à tout moment, sans affecter la licéité des traitements antérieurs.</li>
        </ul>
        <p>Pour exercer ces droits, écris-nous à <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>. Nous te répondrons dans un délai maximum d'un mois conformément à l'article 12 du RGPD.</p>

        <h2>Article 11. Réclamation auprès de la CNIL</h2>
        <p>Si tu estimes, après nous avoir contactés, que tes droits ne sont pas respectés, tu peux adresser une réclamation à la Commission nationale de l'informatique et des libertés (CNIL) :</p>
        <p>
          3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07<br />
          Téléphone : 01 53 73 22 22<br />
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
        </p>

        <h2>Article 12. Modification de la présente politique</h2>
        <p>SellCov se réserve le droit de modifier la présente politique de confidentialité à tout moment. Toute modification substantielle te sera notifiée par email à l'adresse renseignée lors de la création de ton compte, dans un délai minimum de trente (30) jours avant son entrée en vigueur.</p>

        <h2>Article 13. Contact</h2>
        <p>Pour toute question relative à la présente politique ou au traitement de tes données : <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>.</p>
      </div>
    </LegalLayout>
  );
}
