import Head from "next/head";
import Link from "next/link";

export default function Demo() {
  return (
    <>
      <Head>
        <title>Démo · SellCov</title>
        <meta name="description" content="Découvre en 30 secondes ce que SellCov fait : annonce IA, certificat vidéo horodaté, défense automatique en cas de litige." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content="Démo · SellCov" />
        <meta property="og:description" content="Découvre en 30 secondes comment SellCov protège tes ventes." />
        <meta property="og:image" content="https://www.sellcov.com/logo.png" />
      </Head>

      <style jsx global>{`
        :root{
          --bg:#000;
          --bg-card:#0e0e0e;
          --bg-card-2:#161616;
          --border:#1e1e1e;
          --border-strong:#2a2a2a;
          --text:#fff;
          --text-muted:#9a9a9a;
          --text-dim:#5a5a5a;
          --green:#5ee8a3;
          --maxw:880px;
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:var(--font-inter),system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
        a{color:inherit;text-decoration:none}
        code,.mono{font-family:var(--font-mono),ui-monospace,monospace}
      `}</style>

      <div style={{maxWidth:'var(--maxw)',margin:'0 auto',padding:'60px 24px 80px'}}>

        {/* Header */}
        <div style={{marginBottom:'48px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center'}}>
            <img src="/logo.png" alt="SellCov" style={{height:'72px',width:'auto',display:'block'}} />
          </Link>
          <Link href="/" style={{fontSize:'14px',color:'var(--text-muted)'}}>Retour</Link>
        </div>

        {/* Hero */}
        <div style={{marginBottom:'88px'}}>
          <h1 style={{fontFamily:'var(--font-playfair),serif',fontSize:'clamp(38px,6vw,60px)',lineHeight:'1.05',letterSpacing:'-0.02em',marginBottom:'20px'}}>
            Voilà ce que SellCov<br /><em style={{color:'var(--text-muted)',fontWeight:500}}>fait pour toi.</em>
          </h1>
          <p style={{color:'var(--text-muted)',fontSize:'17px',lineHeight:'1.7',maxWidth:'600px'}}>
            Trois étapes pour vendre sans te faire arnaquer. Pas besoin de créer de compte pour découvrir.
          </p>
        </div>

        {/* Step 1 · Annonce */}
        <Section
          tag="Génère ton annonce"
          title="Ta photo devient une annonce prête à publier."
          subtitle="L'IA analyse ta photo, identifie l'article et te propose titre, description, prix et meilleures plateformes. En 10 secondes."
        >
          <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'12px',marginBottom:'18px',maxWidth:'750px'}}>
            <div style={{borderRadius:'12px',overflow:'hidden',border:'1px solid var(--border)',background:'var(--bg-card)',aspectRatio:'3/4'}}>
              <img src="/demophoto-tshirt2.jpg" alt="T-shirt Harley Davidson détail poche" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
            </div>
            <div style={{borderRadius:'12px',overflow:'hidden',border:'1px solid var(--border)',background:'var(--bg-card)',aspectRatio:'3/4'}}>
              <img src="/demophoto-tshirt.jpg" alt="T-shirt Harley Davidson vue dos" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
            </div>
            <div style={{borderRadius:'12px',overflow:'hidden',border:'1px solid var(--border)',background:'var(--bg-card)',aspectRatio:'3/4'}}>
              <img src="/demophoto-tshirt3.jpg" alt="T-shirt Harley Davidson label" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
            </div>
          </div>
          <DataCard>
            <DataRow label="Titre généré" value="T-shirt Harley Davidson vintage 90s · Taille M" />
            <div style={{padding:'18px 22px',borderBottom:'0.5px solid var(--border)'}}>
              <div style={{fontSize:'12px',color:'var(--text-dim)',fontWeight:500,marginBottom:'10px'}}>Description générée</div>
              <div style={{fontSize:'14px',color:'#fff',lineHeight:'1.7'}}>
                Authentique t-shirt Harley Davidson vintage des années 90, imprimé Danbury Connecticut. Label Hanes Beefy 100% coton, made in USA, pre-shrunk. Single stitch confirmé sur les manches. Taille M, coupe loose vintage. Coloris gris washed, print en bon état, patine d'usage uniforme. Aucun trou ni tâche. Pièce de collection pour les amateurs de vintage americana et streetwear 90s. Envoi soigné sous 24h, certificat vidéo SellCov inclus.
                <div style={{marginTop:'14px',color:'var(--text-muted)',fontSize:'13px'}}>
                  #harleydavidson #vintage90s #vintageamericana #singlestitch #hanesbeefy #madeinusa #streetwear #grailed #depop #vintagetshirt
                </div>
              </div>
            </div>
            <DataRow label="Plateformes recommandées" value={
              <span style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                <Pill text="Grailed 9/10" />
                <Pill text="Depop 8/10" />
                <Pill text="Vinted 6/10" />
              </span>
            } />
            <DataRow label="Prix conseillé" value={<span style={{fontFamily:'var(--font-playfair),serif',fontSize:'22px',fontWeight:700}}>120 à 180 €</span>} last />
          </DataCard>
        </Section>

        {/* Step 2 · Certificat */}
        <Section
          tag="Certifie ton envoi"
          title="Filme 90 secondes. SellCov scelle la preuve."
          subtitle="Vidéo horodatée et signature cryptographique. Recevable juridiquement (art. 1366 du Code civil). Chaque certificat est ancré dans la blockchain Bitcoin. Personne, pas même nous, ne peut modifier l'horodatage."
        >
          <div style={{marginBottom:'18px',borderRadius:'14px',overflow:'hidden',border:'1px solid var(--border)',background:'var(--bg-card)',maxWidth:'750px',position:'relative'}}>
            <img src="/demovideo-tshirt.jpg" alt="Frame de la vidéo certifiée" style={{width:'100%',height:'auto',display:'block'}} />
            <div style={{position:'absolute',bottom:'14px',left:'14px',padding:'7px 13px',borderRadius:'7px',background:'rgba(0,0,0,.75)',color:'#fff',fontSize:'13px',fontFamily:'JetBrains Mono,monospace',letterSpacing:'.08em',display:'flex',alignItems:'center',gap:'8px'}}>
              <span style={{width:'9px',height:'9px',borderRadius:'50%',background:'var(--green)',display:'inline-block'}}></span>
              REC · 00:42
            </div>
          </div>
          <DataCard>
            <DataRow label="Identifiant" value={<span className="mono">SC-7K2F9X-A3B</span>} />
            <DataRow label="Signature" value={<span style={{color:'var(--green)',fontWeight:600}}>Validée</span>} />
            <DataRow label="Ancrage Bitcoin" value={<span style={{color:'#F7931A',fontWeight:600}}>Confirmé</span>} />
            <DataRow label="Horodatage UTC" value="05/05/2026 14:23:18" last />
          </DataCard>
        </Section>

        {/* Step 3 · Litige */}
        <Section
          tag="Défends-toi en 1 clic"
          title="Litige reçu ? L'IA rédige ta défense."
          subtitle="Tu colles le message de l'acheteur. SellCov détecte les signaux de fraude et te donne une réponse prête à envoyer. Avec ton certificat en preuve, l'arnaque s'effondre."
        >
          <DataCard>
            <div style={{padding:'18px 22px',borderBottom:'0.5px solid var(--border)'}}>
              <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'8px'}}>Message de l'acheteur</div>
              <div style={{fontSize:'14px',color:'var(--text-muted)',fontStyle:'italic',lineHeight:'1.6'}}>
                « Le t-shirt reçu n'est pas authentique, le print est différent de celui de l'annonce. Je demande un remboursement intégral. »
              </div>
            </div>

            <div style={{padding:'18px 22px',borderBottom:'0.5px solid var(--border)'}}>
              <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'10px'}}>Arguments de défense</div>
              <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                <ArgItem text="Le certificat vidéo SC-7K2F9X-A3B montre l'article à 360° au moment de l'envoi, print Harley Davidson Danbury Connecticut clairement identifiable à 00:42." />
                <ArgItem text="Les détails d'authentification (Hanes Beefy, single stitch, made in USA) sont visibles à 01:15 sur la vidéo horodatée et signée cryptographiquement." />
                <ArgItem text="L'horodatage cryptographique HMAC SHA-256 prouve que la vidéo a été enregistrée avant l'envoi. L'article reçu est strictement celui qui a été expédié." />
              </div>
            </div>

            <div style={{padding:'18px 22px'}}>
              <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'10px'}}>Réponse pré-rédigée</div>
              <div style={{fontSize:'14px',color:'#fff',lineHeight:'1.7'}}>
                Bonjour, mon envoi est certifié par SellCov via le certificat SC-7K2F9X-A3B. La vidéo horodatée à 360° montre le print exact, l'étiquette Hanes Beefy et les détails d'authentification (single stitch, made in USA). L'article que vous avez reçu est strictement celui qui a été expédié. Je reste disponible pour transmettre la vidéo au service client de la plateforme si nécessaire.
              </div>
            </div>
          </DataCard>
        </Section>

        {/* CTA final */}
        <div style={{marginTop:'88px',textAlign:'center',paddingTop:'48px',borderTop:'0.5px solid var(--border)'}}>
          <h2 style={{fontFamily:'var(--font-playfair),serif',fontSize:'clamp(28px,4vw,38px)',lineHeight:'1.1',letterSpacing:'-0.02em',marginBottom:'14px'}}>
            Prêt à protéger ta prochaine vente ?
          </h2>
          <p style={{color:'var(--text-muted)',fontSize:'15px',marginBottom:'32px',maxWidth:'460px',margin:'0 auto 32px'}}>
            Plan Découverte gratuit. 1 certificat par mois, sans carte bancaire.
          </p>
          <Link href="/compte" style={{display:'inline-block',padding:'15px 32px',background:'var(--green)',color:'#000',borderRadius:'999px',fontWeight:700,fontSize:'15px',textDecoration:'none'}}>
            Créer mon compte gratuit
          </Link>
        </div>

      </div>
    </>
  );
}

function Section({ tag, title, subtitle, children }) {
  return (
    <div style={{marginBottom:'72px'}}>
      <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.14em',textTransform:'uppercase',fontWeight:700,marginBottom:'18px'}}>
        {tag}
      </div>
      <h3 style={{fontFamily:'var(--font-playfair),serif',fontSize:'clamp(24px,3.6vw,34px)',lineHeight:'1.15',letterSpacing:'-0.01em',marginBottom:'14px'}}>
        {title}
      </h3>
      <p style={{color:'var(--text-muted)',fontSize:'15px',lineHeight:'1.7',marginBottom:'24px',maxWidth:'620px'}}>
        {subtitle}
      </p>
      {children}
    </div>
  );
}

function DataCard({ children }) {
  return (
    <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'14px',overflow:'hidden'}}>
      {children}
    </div>
  );
}

function DataRow({ label, value, last }) {
  return (
    <div style={{padding:'18px 22px',borderBottom:last ? 'none' : '0.5px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'18px',flexWrap:'wrap'}}>
      <div style={{fontSize:'12px',color:'var(--text-dim)',fontWeight:500}}>{label}</div>
      <div style={{fontSize:'14px',color:'#fff',fontWeight:500,textAlign:'right'}}>{value}</div>
    </div>
  );
}

function Pill({ text }) {
  return (
    <span style={{padding:'5px 11px',borderRadius:'8px',background:'#1a1a1a',color:'#fff',fontSize:'12px',fontWeight:500,fontFamily:"'Georgia',serif"}}>
      {text}
    </span>
  );
}

function ArgItem({ text }) {
  return (
    <div style={{display:'flex',gap:'10px',alignItems:'flex-start'}}>
      <span style={{flexShrink:0,width:'16px',height:'16px',borderRadius:'50%',background:'rgba(94,232,163,.1)',display:'grid',placeItems:'center',color:'var(--green)',fontSize:'10px',marginTop:'2px',fontWeight:700}}>✓</span>
      <p style={{fontSize:'13.5px',color:'var(--text-muted)',lineHeight:'1.6'}}>{text}</p>
    </div>
  );
}
