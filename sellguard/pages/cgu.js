import Head from 'next/head';
import Link from 'next/link';

export default function CGU() {
  return (
    <>
      <Head>
        <title>CGU — SellCov</title>
        <meta name="description" content="Conditions Générales d'Utilisation de SellCov." />
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
      `}</style>

      <div style={{maxWidth:'var(--maxw)',margin:'0 auto',padding:'60px 24px 80px'}}>

        <div style={{marginBottom:'48px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:'10px',color:'#fff',textDecoration:'none'}}>
            <span style={{width:'32px',height:'32px',border:'1.5px solid #fff',borderRadius:'50%',display:'grid',placeItems:'center',fontSize:'11px',fontWeight:'600'}}>sc</span>
            <span style={{fontFamily:'Playfair Display,serif',fontWeight:'700',fontSize:'18px'}}>SellCov</span>
          </Link>
          <Link href="/" style={{fontSize:'14px',color:'var(--text-muted)'}}>← Retour</Link>
        </div>

        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(28px,5vw,44px)',lineHeight:'1.1',marginBottom:'8px'}}>
          Conditions Générales<br /><em style={{color:'var(--text-muted)',fontWeight:'500'}}>d'Utilisation</em>
        </h1>
        <p style={{color:'var(--text-dim)',fontSize:'14px',marginBottom:'48px',borderBottom:'0.5px solid var(--border)',paddingBottom:'24px'}}>
          Version 1.0 — En vigueur à compter du 1er mai 2026
        </p>

        <div style={{color:'var(--text-muted)',fontSize:'15px',lineHeight:'1.85'}}>

          <Section title="Article 1 — Objet et champ d'application">
            <p>Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités d'accès et d'utilisation du service SellCov (ci-après « le Service »), édité et exploité par SellCov.</p>
            <p>SellCov est un service de certification vidéo horodatée destiné aux vendeurs particuliers qui souhaitent constituer une preuve de l'état d'un article et de son expédition avant toute transaction sur une plateforme de revente entre particuliers, telle que Vinted, Leboncoin, Depop, Grailed, Vestiaire Collective, Etsy ou toute autre plateforme similaire.</p>
            <p>Le Service n'est pas une plateforme de paiement. Il ne gère aucun flux financier entre vendeurs et acheteurs, et n'entretient aucune relation contractuelle ou commerciale avec les plateformes de revente mentionnées.</p>
            <p>Toute utilisation du Service implique l'acceptation pleine, entière et sans réserve des présentes CGU. L'utilisateur qui n'accepte pas ces conditions est invité à ne pas utiliser le Service.</p>
          </Section>

          <Section title="Article 2 — Modification des CGU">
            <p>SellCov se réserve le droit de modifier les présentes CGU à tout moment. Toute modification substantielle sera notifiée à l'utilisateur par email, à l'adresse renseignée lors de la création de son compte, dans un délai minimum de trente (30) jours avant son entrée en vigueur.</p>
            <p>L'utilisation continue du Service après l'entrée en vigueur des modifications vaut acceptation des nouvelles conditions. À défaut d'acceptation, l'utilisateur peut résilier son compte conformément à l'article 9 des présentes.</p>
          </Section>

          <Section title="Article 3 — Création de compte et accès au Service">
            <p>L'accès au Service est conditionné à la création d'un compte personnel. L'inscription s'effectue en renseignant une adresse email valide. L'authentification au Service repose sur un système de lien de connexion à usage unique envoyé par email (ci-après « magic link »), sans recours à un mot de passe.</p>
            <p>Chaque compte est strictement personnel. Il est lié à une seule adresse email et ne peut être partagé entre plusieurs personnes ou utilisé au nom de tiers. L'utilisateur est seul responsable de la confidentialité de ses identifiants de connexion ainsi que de l'ensemble des actions effectuées depuis son compte.</p>
            <p>L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription, et à les maintenir dans cet état tout au long de l'utilisation du Service. SellCov se réserve le droit de suspendre ou de résilier tout compte créé sur la base d'informations erronées ou frauduleuses.</p>
          </Section>

          <Section title="Article 4 — Description des fonctionnalités">
            <p>Le Service comprend trois fonctionnalités principales.</p>
            <p>La <strong style={{color:'#fff'}}>certification vidéo</strong> permet à l'utilisateur d'enregistrer une vidéo de l'article qu'il souhaite expédier ainsi que du processus d'emballage. Cette vidéo est transmise aux serveurs de SellCov, où elle est soumise à un traitement cryptographique produisant une empreinte numérique unique (hash SHA-256) associée à un horodatage certifié. Un certificat est ensuite généré, permettant à l'utilisateur d'attester de l'état de l'article et du colis à la date et à l'heure d'enregistrement. Les vidéos certifiées sont archivées pendant une durée de trois (3) mois à compter de leur création.</p>
            <p>La <strong style={{color:'#fff'}}>défense automatique par intelligence artificielle</strong> permet à l'utilisateur confronté à un litige de soumettre le message contestataire de l'acheteur ainsi que son certificat SellCov. Le Service génère alors automatiquement une réponse argumentée à destination du service de médiation de la plateforme de revente concernée. Cette réponse est fournie à titre d'aide à la rédaction ; l'utilisateur en demeure l'unique responsable et conserve toute latitude pour la modifier avant envoi.</p>
            <p>La <strong style={{color:'#fff'}}>génération d'annonce par intelligence artificielle</strong> permet à l'utilisateur d'obtenir une description rédigée de l'article qu'il souhaite mettre en vente, à partir de photographies uploadées. Cette description est produite à titre indicatif. L'utilisateur est seul responsable de sa vérification, de son exactitude et de sa conformité aux règles de la plateforme sur laquelle il souhaite la publier.</p>
          </Section>

          <Section title="Article 5 — Valeur juridique des certificats">
            <p>Les certificats SellCov reposent sur un mécanisme de hachage cryptographique (SHA-256) associé à un horodatage. Ils constituent des éléments de preuve susceptibles d'être produits dans le cadre des procédures de médiation interne des plateformes de revente et, selon les circonstances, devant les juridictions françaises compétentes.</p>
            <p>SellCov ne garantit pas l'issue de tout litige dans lequel un certificat SellCov est produit. La décision finale appartient à la plateforme de revente concernée, au médiateur désigné, ou à la juridiction saisie. SellCov met à disposition un outil destiné à renforcer la position probatoire de l'utilisateur ; il ne saurait être assimilé à un prestataire de services de confiance qualifié au sens du règlement européen eIDAS.</p>
            <p>La force probante d'un certificat SellCov peut varier en fonction de la juridiction applicable, des règles propres à chaque plateforme de revente, et des circonstances particulières de chaque litige. SellCov recommande à l'utilisateur de consulter un professionnel du droit pour tout litige présentant un enjeu financier significatif.</p>
          </Section>

          <Section title="Article 6 — Obligations de l'utilisateur">
            <p>L'utilisateur s'engage à utiliser le Service exclusivement à des fins légitimes, dans le respect de la législation française et européenne applicable, ainsi que des droits des tiers.</p>
            <p>Il est formellement interdit d'utiliser le Service pour constituer de fausses preuves, falsifier des certificats, ou tenter de tromper un acheteur, une plateforme de revente, un médiateur ou une juridiction. Tout usage frauduleux du Service est susceptible d'engager la responsabilité pénale de son auteur.</p>
            <p>L'utilisateur s'engage également à ne pas uploader de contenus contraires à l'ordre public, aux bonnes mœurs ou portant atteinte aux droits de tiers, à ne pas tenter de contourner les mécanismes de sécurité du Service, et à ne pas utiliser le Service à des fins commerciales sans l'accord préalable et écrit de SellCov.</p>
            <p>Tout manquement aux obligations énoncées au présent article peut entraîner la suspension immédiate ou la résiliation définitive du compte concerné, sans préavis et sans droit au remboursement des sommes éventuellement versées.</p>
          </Section>

          <Section title="Article 7 — Tarifs et conditions financières">
            <p>Pendant la phase bêta du Service, un accès gratuit est proposé à l'ensemble des utilisateurs inscrits. Cette offre comprend un accès aux fonctionnalités décrites à l'article 4 sans limitation de volume. La durée de la phase bêta est indéterminée ; SellCov se réserve le droit d'y mettre fin avec un préavis de trente (30) jours adressé aux utilisateurs par email.</p>
            <p>Le plan Early Adopter est proposé aux cinquante (50) premiers utilisateurs souscrivant un abonnement payant, au tarif de 4,90 euros hors taxes par mois. Ce tarif est garanti pendant une durée d'un (1) an à compter de la date de souscription. À l'issue de cette période, l'utilisateur sera informé des nouvelles conditions tarifaires dans un délai minimum de trente (30) jours avant leur entrée en vigueur.</p>
            <p>Le plan Pro Power Seller est proposé au tarif de 19,90 euros hors taxes par mois, sans engagement de durée, résiliable à tout moment selon les modalités prévues à l'article 9.</p>
            <p>Les paiements sont traités par un prestataire de paiement tiers. SellCov ne conserve aucune donnée bancaire de ses utilisateurs. En cas de défaut de paiement, l'accès aux fonctionnalités payantes est suspendu jusqu'à régularisation.</p>
          </Section>

          <Section title="Article 8 — Disponibilité du Service">
            <p>SellCov s'efforce d'assurer la disponibilité du Service vingt-quatre heures sur vingt-quatre et sept jours sur sept. Toutefois, des interruptions peuvent survenir pour des raisons de maintenance, de mise à jour ou à la suite d'incidents techniques indépendants de la volonté de SellCov.</p>
            <p>SellCov ne saurait être tenu responsable des conséquences d'une indisponibilité temporaire du Service, notamment en cas de litige en cours nécessitant l'accès aux certificats archivés. Il est recommandé à l'utilisateur de télécharger et conserver une copie de ses certificats dès leur génération.</p>
          </Section>

          <Section title="Article 9 — Résiliation">
            <p>L'utilisateur peut résilier son compte à tout moment depuis son espace personnel. La résiliation prend effet à l'expiration de la période d'abonnement en cours ; aucun remboursement au prorata n'est effectué pour la période restante.</p>
            <p>À la date d'effet de la résiliation, les données de l'utilisateur, incluant les vidéos certifiées et les certificats associés, sont conservées pendant trente (30) jours, délai pendant lequel l'utilisateur peut en demander l'export. À l'issue de ce délai, l'ensemble des données est définitivement supprimé, sous réserve des obligations légales de conservation qui pourraient s'imposer à SellCov.</p>
            <p>SellCov se réserve le droit de résilier unilatéralement tout compte en cas de violation des présentes CGU, sans obligation de remboursement et sans préavis si la gravité des manquements constatés le justifie.</p>
          </Section>

          <Section title="Article 10 — Protection des données personnelles">
            <p>SellCov traite les données personnelles de ses utilisateurs dans le respect du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 (RGPD) et de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés.</p>
            <p>Les données traitées comprennent l'adresse email de l'utilisateur, les vidéos uploadées dans le cadre de la certification, les métadonnées associées à chaque certification (date, heure, empreinte cryptographique), ainsi que les données de navigation nécessaires au bon fonctionnement du Service.</p>
            <p>Les données sont hébergées sur des serveurs situés en France. Les vidéos font l'objet d'un chiffrement et ne sont accessibles qu'à l'utilisateur titulaire du compte. Elles ne sont en aucun cas transmises à des tiers sans le consentement explicite de l'utilisateur, sauf obligation légale ou décision de justice.</p>
            <p>Conformément à la réglementation applicable, l'utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition concernant ses données personnelles. Ces droits peuvent être exercés en adressant une demande à l'adresse suivante : <a href="mailto:privacy@sellcov.com">privacy@sellcov.com</a>. En cas de réclamation non résolue, l'utilisateur peut saisir la Commission Nationale de l'Informatique et des Libertés (CNIL).</p>
          </Section>

          <Section title="Article 11 — Propriété intellectuelle">
            <p>L'ensemble des éléments constituant le Service SellCov, notamment son interface, son code source, ses algorithmes, ses bases de données, ses marques et ses contenus éditoriaux, est la propriété exclusive de SellCov et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
            <p>Toute reproduction, représentation, distribution, modification ou exploitation commerciale de ces éléments, sans l'autorisation préalable et écrite de SellCov, est strictement interdite et constitue une contrefaçon susceptible d'engager des poursuites civiles et pénales.</p>
            <p>Les vidéos et contenus uploadés par les utilisateurs demeurent leur propriété exclusive. En les confiant au Service, l'utilisateur concède à SellCov une licence non-exclusive, non-cessible et limitée aux seules opérations techniques nécessaires à la fourniture du Service (stockage, hachage, certification).</p>
          </Section>

          <Section title="Article 12 — Limitation de responsabilité">
            <p>Le Service est fourni en l'état, sans garantie d'aucune sorte quant à son adéquation à un usage particulier. SellCov ne garantit pas que les certificats produits par le Service suffiront à emporter la conviction d'une plateforme de revente, d'un médiateur ou d'une juridiction dans le cadre d'un litige.</p>
            <p>SellCov ne saurait être tenu responsable des préjudices directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le Service, des décisions rendues par les plateformes de revente en dépit de la production d'un certificat SellCov, des erreurs ou imprécisions contenues dans les réponses générées par l'intelligence artificielle de défense, ou de toute perte financière liée à l'issue d'un litige commercial.</p>
            <p>Dans les cas où la responsabilité de SellCov serait reconnue, celle-ci serait en toute hypothèse limitée au montant total des sommes effectivement versées par l'utilisateur au titre de son abonnement au cours des douze (12) mois précédant le fait générateur du dommage.</p>
          </Section>

          <Section title="Article 13 — Droit applicable et règlement des litiges">
            <p>Les présentes CGU sont régies et interprétées conformément au droit français. En cas de difficulté relative à leur interprétation ou à leur exécution, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire.</p>
            <p>Conformément aux articles L. 611-1 et suivants du Code de la consommation, l'utilisateur ayant la qualité de consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige qui l'oppose à SellCov. Toute réclamation préalable doit être adressée à : <a href="mailto:contact@sellcov.com">contact@sellcov.com</a>.</p>
            <p>À défaut de résolution amiable, tout litige relatif à la formation, à la validité, à l'interprétation ou à l'exécution des présentes CGU sera soumis à la compétence exclusive des tribunaux français compétents.</p>
          </Section>

          <Section title="Article 14 — Contact">
            <p>Pour toute question relative aux présentes Conditions Générales d'Utilisation, l'utilisateur peut contacter SellCov à l'adresse email suivante : <a href="mailto:contact@sellcov.com">contact@sellcov.com</a>, ou via le formulaire de contact disponible sur le site <a href="https://sellcov.com">sellcov.com</a>.</p>
          </Section>

        </div>

        <div style={{marginTop:'60px',paddingTop:'24px',borderTop:'0.5px solid var(--border)',display:'flex',gap:'24px',flexWrap:'wrap',fontSize:'13px',color:'var(--text-dim)'}}>
          <span>© 2026 SellCov</span>
          <Link href="/legal" style={{color:'var(--text-dim)'}}>Mentions légales</Link>
          <Link href="/confidentialite" style={{color:'var(--text-dim)'}}>Confidentialité</Link>
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
