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
        <meta property="og:description" content="Découvre en 30 secondes comment SellCov protège tes ventes Vinted, Depop, Grailed." />
        <meta property="og:image" content="https://www.sellcov.com/logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root{
          --bg:#000;--bg-card:#0e0e0e;--bg-card-2:#161616;
          --border:#1e1e1e;--border-strong:#2a2a2a;
          --text:#fff;--text-muted:#9a9a9a;--text-dim:#5a5a5a;
          --green:#5ee8a3;--green-bg:rgba(94,232,163,.08);
          --violet:#8b7fff;--violet-bg:rgba(139,127,255,.1);
          --pink:#ff7fb1;--pink-bg:rgba(255,127,177,.08);
          --red:#ff6b6b;--red-bg:rgba(255,107,107,.08);
          --maxw:880px;
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
        a{color:inherit;text-decoration:none}
        code,.mono{font-family:'JetBrains Mono',ui-monospace,monospace}
      `}</style>

      <div style={{maxWidth:'var(--maxw)',margin:'0 auto',padding:'48px 24px 80px'}}>

        {/* Header */}
        <div style={{marginBottom:'48px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center'}}>
            <img src="/logo.png" alt="SellCov" style={{height:'54px',width:'auto',display:'block'}} />
          </Link>
          <Link href="/" style={{fontSize:'14px',color:'var(--text-muted)'}}>← Retour</Link>
        </div>

        {/* Hero */}
        <div style={{marginBottom:'56px'}}>
          <div style={{fontSize:'12px',color:'var(--green)',letterSpacing:'.14em',textTransform:'uppercase',fontWeight:700,marginBottom:'18px'}}>
            Démo · 30 secondes
          </div>
          <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(34px,5.5vw,52px)',lineHeight:'1.05',letterSpacing:'-0.02em',marginBottom:'18px'}}>
            Voilà ce que SellCov<br /><em style={{color:'var(--text-muted)',fontWeight:500}}>fait pour toi.</em>
          </h1>
          <p style={{color:'var(--text-muted)',fontSize:'17px',lineHeight:'1.7',maxWidth:'620px'}}>
            Trois étapes pour vendre sans te faire arnaquer sur tes marketplaces. Aucun compte requis pour découvrir.
          </p>
        </div>

        {/* Step 1 · Annonce */}
        <Section
          number="01"
          color="var(--violet)"
          colorBg="var(--violet-bg)"
          tag="Génère ton annonce"
          title="Ta photo devient une annonce prête à publier."
          subtitle="L'IA SellCov analyse ta photo, identifie l'article, scrute les marketplaces et te donne le titre, la description, le prix et la meilleure plateforme. En 10 secondes."
        >
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'22px',marginTop:'4px'}}>
            <div style={{display:'flex',gap:'18px',alignItems:'flex-start',flexWrap:'wrap'}}>
              <div style={{width:'120px',height:'120px',borderRadius:'10px',background:'linear-gradient(135deg,#1a1a1a,#0a0a0a)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:'Playfair Display,serif',fontSize:'46px',fontStyle:'italic',color:'var(--violet)'}}>
                Aa
              </div>
              <div style={{flex:'1 1 300px'}}>
                <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'8px'}}>Titre généré</div>
                <div style={{fontSize:'15px',fontWeight:600,marginBottom:'14px'}}>Sac à main cuir noir Prada vintage authentique</div>

                <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'8px'}}>Top 3 plateformes</div>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'14px'}}>
                  <Pill text="Vestiaire 9/10" bg="rgba(255,255,255,0.06)" color="#ccc" />
                  <Pill text="Vinted 7/10" bg="rgba(9,177,186,0.12)" color="#2fd4dd" />
                  <Pill text="Grailed 6/10" bg="rgba(255,255,255,0.08)" color="#fff" />
                </div>

                <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'8px'}}>Prix conseillé</div>
                <div style={{fontSize:'18px',fontWeight:700,fontFamily:'Playfair Display,serif'}}>180 à 240 €</div>
              </div>
            </div>
          </div>
        </Section>

        {/* Step 2 · Certificat */}
        <Section
          number="02"
          color="var(--green)"
          colorBg="var(--green-bg)"
          tag="Certifie ton envoi"
          title="Filme 90 secondes. SellCov scelle la preuve."
          subtitle="Vidéo horodatée + signature cryptographique HMAC SHA-256. Recevable juridiquement (art. 1366 du Code civil). Page de vérification publique partageable à l'acheteur ou à la plateforme."
        >
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'22px',marginTop:'4px'}}>
            <div style={{display:'flex',gap:'18px',alignItems:'flex-start',flexWrap:'wrap'}}>
              <div style={{width:'120px',height:'120px',borderRadius:'10px',background:'linear-gradient(135deg,#0d3a26,#062318)',border:'1px solid var(--green-bg)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontFamily:'Playfair Display,serif',fontSize:'46px',fontStyle:'italic',color:'var(--green)'}}>
                Sc
              </div>
              <div style={{flex:'1 1 300px',fontSize:'13px'}}>
                <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'0.5px solid var(--border)'}}>
                  <span style={{color:'var(--text-dim)'}}>ID certificat</span>
                  <span className="mono" style={{color:'#fff'}}>SC-7K2F9X-A3B</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'0.5px solid var(--border)'}}>
                  <span style={{color:'var(--text-dim)'}}>Empreinte SHA-256</span>
                  <span className="mono" style={{color:'#fff',fontSize:'12px'}}>a3f2b8c9d4e1…</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'0.5px solid var(--border)'}}>
                  <span style={{color:'var(--text-dim)'}}>Signature HMAC</span>
                  <span style={{color:'var(--green)',fontWeight:600}}>✓ Validée</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'0.5px solid var(--border)'}}>
                  <span style={{color:'var(--text-dim)'}}>Horodatage UTC</span>
                  <span style={{color:'#fff'}}>05/05/2026 14:23:18</span>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0'}}>
                  <span style={{color:'var(--text-dim)'}}>Vérification publique</span>
                  <span style={{color:'var(--green)'}}>sellcov.com/verify/…</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Step 3 · Litige */}
        <Section
          number="03"
          color="var(--pink)"
          colorBg="var(--pink-bg)"
          tag="Défends-toi en 1 clic"
          title="Litige reçu ? L'IA rédige ta défense."
          subtitle="Tu colles le message de l'acheteur. SellCov détecte les signaux de fraude, construit ton argumentaire et te donne une réponse prête à envoyer. Avec ton certificat à la clé, l'arnaque s'effondre."
        >
          <div style={{background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:'14px',padding:'22px',marginTop:'4px'}}>
            <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'8px'}}>Message de l'acheteur</div>
            <div style={{fontSize:'14px',color:'var(--text-muted)',padding:'14px 16px',background:'#060606',borderRadius:'10px',border:'1px solid var(--border)',marginBottom:'18px',fontStyle:'italic'}}>
              « Le sac n'est pas conforme à l'annonce, je n'ai jamais eu la pochette intérieure. »
            </div>

            <div style={{display:'flex',gap:'10px',alignItems:'center',marginBottom:'14px'}}>
              <div style={{padding:'4px 10px',borderRadius:'999px',background:'var(--red-bg)',color:'var(--red)',fontSize:'11px',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase'}}>Fraude suspectée 7/10</div>
            </div>

            <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'10px'}}>Arguments de défense (extrait)</div>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'18px'}}>
              <ArgItem text="Le certificat vidéo SC-7K2F9X-A3B atteste de la pochette intérieure visible et présente à 00:42." />
              <ArgItem text="L'horodatage cryptographique du 05/05 14:23 prouve que l'envoi est antérieur à la réception de l'acheteur." />
              <ArgItem text="Le message ne mentionne aucun élément vérifiable post-réception (photo, témoin)." />
            </div>

            <div style={{fontSize:'11px',color:'var(--text-dim)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'10px'}}>Réponse pré-rédigée</div>
            <div style={{fontSize:'14px',color:'#fff',padding:'14px 16px',background:'#060606',borderRadius:'10px',border:'1px solid var(--border)',lineHeight:'1.7'}}>
              Bonjour, mon envoi est certifié par SellCov (lien : sellcov.com/verify/SC-7K2F9X-A3B). La pochette intérieure est visible à 00:42 sur la vidéo horodatée. Je reste disponible pour échanger avec le service Vinted si nécessaire.
            </div>
          </div>
        </Section>

        {/* Final CTA */}
        <div style={{marginTop:'72px',padding:'40px 28px',borderRadius:'18px',background:'linear-gradient(135deg,rgba(94,232,163,.08),rgba(139,127,255,.06))',border:'1px solid rgba(94,232,163,.2)',textAlign:'center'}}>
          <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(28px,4vw,38px)',lineHeight:'1.1',letterSpacing:'-0.02em',marginBottom:'14px'}}>
            Prêt à protéger ta prochaine vente ?
          </h2>
          <p style={{color:'var(--text-muted)',fontSize:'15px',marginBottom:'26px',maxWidth:'480px',margin:'0 auto 26px'}}>
            Plan Découverte gratuit. 3 certificats par mois, sans carte bancaire.
          </p>
          <Link href="/compte" style={{display:'inline-block',padding:'15px 32px',background:'var(--green)',color:'#000',borderRadius:'999px',fontWeight:700,fontSize:'15px',textDecoration:'none'}}>
            Créer mon compte gratuit
          </Link>
          <div style={{marginTop:'18px',fontSize:'13px',color:'var(--text-dim)'}}>
            Ou <Link href="/" style={{color:'var(--text-muted)',textDecoration:'underline'}}>en savoir plus sur SellCov</Link>
          </div>
        </div>

        {/* Footer mini */}
        <div style={{marginTop:'56px',paddingTop:'24px',borderTop:'0.5px solid var(--border)',display:'flex',gap:'24px',flexWrap:'wrap',fontSize:'13px',color:'var(--text-dim)'}}>
          <Link href="/" style={{color:'var(--text-dim)'}}>Accueil</Link>
          <Link href="/blog" style={{color:'var(--text-dim)'}}>Blog</Link>
          <Link href="/faq" style={{color:'var(--text-dim)'}}>FAQ</Link>
          <Link href="/cgu" style={{color:'var(--text-dim)'}}>CGU</Link>
          <Link href="/confidentialite" style={{color:'var(--text-dim)'}}>Confidentialité</Link>
        </div>
      </div>
    </>
  );
}

function Section({ number, color, colorBg, tag, title, subtitle, children }) {
  return (
    <div style={{marginBottom:'48px'}}>
      <div style={{display:'flex',alignItems:'baseline',gap:'14px',marginBottom:'14px'}}>
        <span style={{fontFamily:'Playfair Display,serif',fontSize:'18px',color:'var(--text-dim)',fontWeight:500}}>
          {number}
        </span>
        <span style={{padding:'4px 10px',borderRadius:'999px',background:colorBg,color:color,fontSize:'11px',fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase'}}>
          {tag}
        </span>
      </div>
      <h3 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(22px,3.2vw,30px)',lineHeight:'1.15',letterSpacing:'-0.01em',marginBottom:'10px'}}>
        {title}
      </h3>
      <p style={{color:'var(--text-muted)',fontSize:'15px',lineHeight:'1.7',marginBottom:'20px',maxWidth:'620px'}}>
        {subtitle}
      </p>
      {children}
    </div>
  );
}

function Pill({ text, bg, color }) {
  return (
    <span style={{padding:'5px 11px',borderRadius:'8px',background:bg,color:color,fontSize:'12px',fontWeight:600,fontFamily:"'Georgia',serif"}}>
      {text}
    </span>
  );
}

function ArgItem({ text }) {
  return (
    <div style={{display:'flex',gap:'10px',alignItems:'flex-start',padding:'10px 14px',background:'#060606',borderRadius:'10px',border:'1px solid var(--border)'}}>
      <span style={{flexShrink:0,width:'18px',height:'18px',borderRadius:'50%',background:'var(--green-bg)',border:'1px solid rgba(94,232,163,.3)',display:'grid',placeItems:'center',color:'var(--green)',fontSize:'11px',marginTop:'1px'}}>✓</span>
      <p style={{fontSize:'13px',color:'var(--text-muted)',lineHeight:'1.6'}}>{text}</p>
    </div>
  );
}
