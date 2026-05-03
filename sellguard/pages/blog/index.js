import Head from "next/head";
import Link from "next/link";
import { listArticles } from "../../lib/articles";

export default function BlogIndex() {
  const articles = listArticles();

  return (
    <>
      <Head>
        <title>Blog — SellCov</title>
        <meta name="description" content="Guides, conseils et analyses pour les vendeurs Vinted, Depop, Leboncoin et autres marketplaces." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root{--bg:#000;--bg-card:#0e0e0e;--border:#1e1e1e;--text:#fff;--text-muted:#9a9a9a;--text-dim:#5a5a5a;--green:#5ee8a3;--maxw:880px}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.7;-webkit-font-smoothing:antialiased}
        a{color:inherit;text-decoration:none}
      `}</style>

      <div style={{maxWidth:'var(--maxw)',margin:'0 auto',padding:'60px 24px 80px'}}>

        <div style={{marginBottom:'48px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center'}}>
            <img src="/logo.png" alt="SellCov" style={{height:'54px',width:'auto',display:'block'}} />
          </Link>
          <Link href="/" style={{fontSize:'14px',color:'var(--text-muted)'}}>Retour</Link>
        </div>

        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(36px,6vw,56px)',lineHeight:'1.05',marginBottom:'12px',letterSpacing:'-0.02em'}}>
          Blog<br /><em style={{color:'var(--text-muted)',fontWeight:'500'}}>guides et analyses</em>
        </h1>
        <p style={{color:'var(--text-muted)',fontSize:'17px',marginBottom:'56px'}}>
          Conseils concrets pour vendre en sécurité sur Vinted, Depop, Leboncoin et les autres marketplaces.
        </p>

        <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
          {articles.length === 0 && (
            <p style={{color:'var(--text-dim)'}}>Aucun article pour le moment.</p>
          )}
          {articles.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`}>
              <article style={{
                background:'var(--bg-card)',
                border:'1px solid var(--border)',
                borderRadius:'14px',
                padding:'24px 26px',
                cursor:'pointer',
                transition:'border-color .2s, transform .2s',
                display:'block',
              }}>
                {a.category && (
                  <div style={{fontSize:'11px',color:'var(--green)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'10px'}}>
                    {a.category}
                  </div>
                )}
                <h2 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(22px,3vw,28px)',lineHeight:'1.2',color:'#fff',marginBottom:'10px'}}>
                  {a.title}
                </h2>
                <p style={{color:'var(--text-muted)',fontSize:'15px',marginBottom:'14px'}}>
                  {a.description}
                </p>
                <div style={{fontSize:'12px',color:'var(--text-dim)'}}>
                  {formatDate(a.date)} · {a.readTime}
                </div>
              </article>
            </Link>
          ))}
        </div>

      </div>
    </>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}
