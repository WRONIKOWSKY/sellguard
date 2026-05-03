import Head from 'next/head';
import Link from 'next/link';

export default function Confidentialite() {
  return (
    <>
      <Head>
        <title>Politique de confidentialité — SellCov</title>
        <meta name="description" content="Politique de confidentialité de SellCov — traitement des données personnelles, RGPD." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root{--bg:#000;--bg-card:#0e0e0e;--border:#1e1e1e;--text:#fff;--text-muted:#9a9a9a;--text-dim:#5a5a5a;--green:#5ee8a3;--maxw:760px}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.8;-webkit-font-smoothing:antialiased}
        a{color:var(--green);text-decoration:none}
        a:hover{text-decoration:underline}
        p{margin-bottom:14px}
        p:last-child{margin-bottom:0}
        ul{margin:0 0 14px 18px;padding:0}
        li{margin-bottom:6px}
      `}</style>

      <div style={{maxWidth:'var(--maxw)',margin:'0 auto',padding:'60px 24px 80px'}}>

        <div style={{marginBottom:'48px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'10px',color:'#fff',textDecoration:'none'}}>
            <img src="/logo.png" alt="SellCov" style={{height:'54px',width:'auto',display:'block'}} />
          </Link>
          <Link href="/" style={{fontSize:'14px',color:'var(--text-muted)'}}>Retour</Link>
        </div>

        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(28px,5vw,44px)',lineHeight:'1.1',marginBottom:'8px'}}>
          Politique de<br /><em style={{color:'var(--text-muted)',fontWeight:'500'}}>confidentialité</em>
        </h1>
        <p style={{color:'var(--text-dim)',fontSize:'14px',marginBottom:'48px',borderBottom:'0.5px solid var(--border)',paddingBottom:'24px'}}>
          Version 1.0. En vigueur à compter du 1er mai 2026. Dernière mise à jour : 3 mai 2026.
        </p>

        <div style={{color:'var(--text-muted)',fontSize:'15px',lineHeight:'1.85'}}>

          <Section title="Article 1. Identité du responsable de traitement">
            <p>Le service SellCov (ci-après « le Service ») est édité à titre personnel dans le cadre d'un projet en bêta privée, en cours de structuration juridique. Aucune transaction commerciale n'est effectuée à ce jour.</p>
            <p>Pour toute question relative au traitement de tes données personnelles, tu peux écrire à <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>.</p>
          </Section>

          <Section title="Article 2. Données personnelles collectées">
            <p>SellCov collecte et traite les catégories de données suivantes :</p>
            <ul>
              <li><strong style={{color:'#fff'}}>Données de compte</strong> : adresse email, identifiant utilisateur, date de création du compte.</li>
              <li><strong style={{color:'#fff'}}>Données de certification</strong> : vidéos horodatées que tu enregistres, métadonnées (date, taille, empreinte SHA-256, signature cryptographique).</li>
              <li><strong style={{color:'#fff'}}>Données d'envoi</strong> : nom de l'article, référence commande, transporteur, numéro de suivi (renseignés par toi).</li>
              <li><strong style={{color:'#fff'}}>Données techniques</strong> : type d'appareil (user agent), adresse IP au moment de la connexion, logs de connexion.</li>
              <li><strong style={{color:'#fff'}}>Données d'usage</strong> : nombre de certificats générés par jour, type d'opération (analyze, protection, litige).</li>
            </ul>
            <p>SellCov ne collecte aucune donnée sensible au sens de l'article 9 du RGPD (origine ethnique, opinions politiques, religieuses, données de santé, etc.).</p>
          </Section>

          <Section title="Article 3. Finalités du traitement">
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
          </Section>

          <Section title="Article 4. Base légale">
            <p>Le traitement de tes données repose sur :</p>
            <ul>
              <li><strong style={{color:'#fff'}}>L'exécution du contrat</strong> qui te lie à SellCov (article 6.1.b du RGPD), pour les fonctionnalités du Service que tu utilises.</li>
              <li><strong style={{color:'#fff'}}>Notre intérêt légitime</strong> (article 6.1.f du RGPD) à assurer la sécurité, la prévention de la fraude et l'amélioration du Service.</li>
              <li><strong style={{color:'#fff'}}>Tes obligations légales</strong> qui nous incombent (conservation des données comptables, réponse aux requêtes des autorités, etc.).</li>
            </ul>
          </Section>

          <Section title="Article 5. Durée de conservation">
            <p>Tes données sont conservées pendant les durées suivantes :</p>
            <ul>
              <li><strong style={{color:'#fff'}}>Données de compte</strong> : pendant toute la durée de ton inscription, puis 3 ans après suppression du compte (sauf opposition de ta part).</li>
              <li><strong style={{color:'#fff'}}>Vidéos de certification</strong> : 5 ans à compter de leur création, durée correspondant au délai de prescription civile applicable aux litiges entre particuliers (article 2224 du Code civil).</li>
              <li><strong style={{color:'#fff'}}>Logs techniques de connexion</strong> : 12 mois.</li>
              <li><strong style={{color:'#fff'}}>Données de facturation</strong> : 10 ans (obligation légale comptable).</li>
            </ul>
            <p>À l'issue de ces durées, tes données sont supprimées de manière sécurisée ou anonymisées.</p>
          </Section>

          <Section title="Article 6. Destinataires et sous-traitants">
            <p>Tes données sont accessibles uniquement aux personnes habilitées au sein de SellCov, ainsi qu'aux sous-traitants techniques suivants, qui agissent sur instruction écrite de SellCov dans le respect du RGPD :</p>
            <ul>
              <li><strong style={{color:'#fff'}}>Supabase Inc.</strong> (États-Unis, certifié Data Privacy Framework) : authentification, base de données, stockage des vidéos chiffrées.</li>
              <li><strong style={{color:'#fff'}}>Vercel Inc.</strong> (États-Unis, certifié Data Privacy Framework) : hébergement de l'application web et CDN.</li>
              <li><strong style={{color:'#fff'}}>Anthropic PBC</strong> (États-Unis) : analyse d'images et génération de texte par intelligence artificielle pour les fonctionnalités d'annonce et de défense de litige. Aucune vidéo de certification n'est transmise à Anthropic.</li>
            </ul>
            <p>Tes données ne sont ni vendues, ni louées, ni cédées à des tiers à des fins commerciales ou publicitaires.</p>
          </Section>

          <Section title="Article 7. Transferts hors Union européenne">
            <p>Certains de nos sous-traitants sont établis aux États-Unis. Les transferts de données vers ces sous-traitants sont encadrés par le Data Privacy Framework UE-États-Unis et, le cas échéant, par des Clauses Contractuelles Types adoptées par la Commission européenne, conformément aux articles 45 et 46 du RGPD.</p>
          </Section>

          <Section title="Article 8. Sécurité">
            <p>SellCov met en œuvre des mesures techniques et organisationnelles pour assurer la sécurité de tes données :</p>
            <ul>
              <li>Chiffrement des communications (HTTPS/TLS).</li>
              <li>Chiffrement des vidéos de certification au repos dans le stockage Supabase.</li>
              <li>Authentification par lien à usage unique (magic link), sans mot de passe stocké.</li>
              <li>Signature cryptographique HMAC SHA-256 garantissant l'intégrité des certificats.</li>
              <li>Politiques de sécurité au niveau base de données (Row Level Security) restreignant l'accès aux données du seul utilisateur concerné.</li>
              <li>Quotas d'usage et détection d'abus.</li>
            </ul>
          </Section>

          <Section title="Article 9. Cookies et traceurs">
            <p>SellCov utilise uniquement des cookies strictement nécessaires au fonctionnement du Service :</p>
            <ul>
              <li><strong style={{color:'#fff'}}>Cookies d'authentification</strong> (Supabase) : pour maintenir ta session de connexion.</li>
              <li><strong style={{color:'#fff'}}>Stockage local</strong> (langue choisie, préférences d'affichage) : conservé dans ton navigateur, jamais transmis à SellCov.</li>
            </ul>
            <p>SellCov utilise une solution d'analyse statistique respectueuse de la vie privée (Plausible Analytics), qui ne dépose aucun cookie et n'agrège que des données anonymisées (pages visitées, source de trafic). Aucune donnée personnelle identifiante n'est collectée par cet outil.</p>
            <p>SellCov n'utilise aucun cookie publicitaire, de tracking tiers, de partage avec des plateformes sociales, ni de profilage à des fins commerciales.</p>
          </Section>

          <Section title="Article 10. Tes droits">
            <p>Conformément aux articles 15 à 22 du RGPD, tu disposes des droits suivants sur tes données personnelles :</p>
            <ul>
              <li><strong style={{color:'#fff'}}>Droit d'accès</strong> : obtenir une copie des données te concernant.</li>
              <li><strong style={{color:'#fff'}}>Droit de rectification</strong> : corriger toute donnée inexacte ou incomplète.</li>
              <li><strong style={{color:'#fff'}}>Droit à l'effacement</strong> : demander la suppression de tes données, sous réserve des obligations légales de conservation.</li>
              <li><strong style={{color:'#fff'}}>Droit à la limitation</strong> du traitement.</li>
              <li><strong style={{color:'#fff'}}>Droit à la portabilité</strong> : recevoir tes données dans un format structuré et lisible par machine.</li>
              <li><strong style={{color:'#fff'}}>Droit d'opposition</strong> au traitement fondé sur un intérêt légitime.</li>
              <li><strong style={{color:'#fff'}}>Droit de retirer ton consentement</strong> à tout moment, sans affecter la licéité des traitements antérieurs.</li>
            </ul>
            <p>Pour exercer ces droits, écris-nous à <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>. Nous te répondrons dans un délai maximum d'un mois conformément à l'article 12 du RGPD.</p>
          </Section>

          <Section title="Article 11. Réclamation auprès de la CNIL">
            <p>Si tu estimes, après nous avoir contactés, que tes droits ne sont pas respectés, tu peux adresser une réclamation à la Commission nationale de l'informatique et des libertés (CNIL) :</p>
            <p>3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07<br />Téléphone : 01 53 73 22 22<br /><a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>
          </Section>

          <Section title="Article 12. Modification de la présente politique">
            <p>SellCov se réserve le droit de modifier la présente politique de confidentialité à tout moment. Toute modification substantielle te sera notifiée par email à l'adresse renseignée lors de la création de ton compte, dans un délai minimum de trente (30) jours avant son entrée en vigueur.</p>
          </Section>

          <Section title="Article 13. Contact">
            <p>Pour toute question relative à la présente politique ou au traitement de tes données : <a href="mailto:hello@sellcov.com">hello@sellcov.com</a></p>
          </Section>

        </div>

        <div style={{marginTop:'60px',paddingTop:'24px',borderTop:'0.5px solid var(--border)',display:'flex',gap:'24px',flexWrap:'wrap',fontSize:'13px',color:'var(--text-dim)'}}>
          <span>© 2026 SellCov</span>
          <Link href="/cgu" style={{color:'var(--text-dim)'}}>CGU</Link>
          <Link href="/" style={{color:'var(--text-dim)'}}>Accueil</Link>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div style={{marginBottom:'40px'}}>
      <h2 style={{
        fontFamily:'Playfair Display,serif',
        fontSize:'17px',
        fontWeight:'600',
        color:'#fff',
        marginBottom:'16px',
        paddingBottom:'8px',
        borderBottom:'0.5px solid #1e1e1e'
      }}>{title}</h2>
      {children}
    </div>
  );
}
