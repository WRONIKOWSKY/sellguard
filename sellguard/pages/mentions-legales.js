import Head from 'next/head';
import Link from 'next/link';

export default function MentionsLegales() {
  return (
    <>
      <Head>
        <title>Mentions légales — SellCov</title>
        <meta name="description" content="Mentions légales de SellCov — éditeur, hébergeur, propriété intellectuelle." />
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
            <img src="/logo.png" alt="SellCov" style={{height:'54px',width:'auto',display:'block'}} />
          </Link>
          <Link href="/" style={{fontSize:'14px',color:'var(--text-muted)'}}>Retour</Link>
        </div>

        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(28px,5vw,44px)',lineHeight:'1.1',marginBottom:'8px'}}>
          Mentions<br /><em style={{color:'var(--text-muted)',fontWeight:'500'}}>légales</em>
        </h1>
        <p style={{color:'var(--text-dim)',fontSize:'14px',marginBottom:'48px',borderBottom:'0.5px solid var(--border)',paddingBottom:'24px'}}>
          Dernière mise à jour : 3 mai 2026.
        </p>

        <div style={{color:'var(--text-muted)',fontSize:'15px',lineHeight:'1.85'}}>

          <Section title="Édition du site">
            <p>Le site sellcov.com est édité à titre personnel, dans le cadre d'un projet en bêta privée.</p>
            <p>Le projet est en cours de structuration juridique. Aucune transaction commerciale n'est effectuée à ce jour sur le site.</p>
            <p>Pour toute demande, contact : <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>.</p>
          </Section>

          <Section title="Hébergement">
            <p>Le site est hébergé par :</p>
            <p>
              Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis<br />
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
            </p>
          </Section>

          <Section title="Directeur de la publication">
            <p>Le directeur de la publication peut être contacté à l'adresse <a href="mailto:hello@sellcov.com">hello@sellcov.com</a>.</p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>L'ensemble des contenus présents sur sellcov.com (textes, logos, visuels, code source) est protégé par le droit d'auteur et le droit des marques.</p>
            <p>Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, par quelque moyen ou procédé que ce soit, est interdite sans autorisation écrite préalable.</p>
          </Section>

          <Section title="Données personnelles">
            <p>Le traitement de tes données personnelles est régi par notre <Link href="/confidentialite">politique de confidentialité</Link>, conforme au Règlement Général sur la Protection des Données (RGPD).</p>
          </Section>

          <Section title="Cookies">
            <p>Le site utilise uniquement des cookies strictement nécessaires à son fonctionnement (authentification, préférences). Plus d'informations dans la <Link href="/confidentialite">politique de confidentialité</Link>.</p>
          </Section>

          <Section title="Droit applicable">
            <p>Le site sellcov.com est soumis au droit français. Tout litige relatif à son utilisation relève de la compétence des tribunaux français.</p>
          </Section>

        </div>

        <div style={{marginTop:'60px',paddingTop:'24px',borderTop:'0.5px solid var(--border)',display:'flex',gap:'24px',flexWrap:'wrap',fontSize:'13px',color:'var(--text-dim)'}}>
          <span>© 2026 SellCov</span>
          <Link href="/cgu" style={{color:'var(--text-dim)'}}>CGU</Link>
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
