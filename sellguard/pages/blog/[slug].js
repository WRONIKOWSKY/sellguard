import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getArticle, listArticles } from "../../lib/articles";

export default function BlogArticle() {
  const router = useRouter();
  const { slug } = router.query;
  const article = slug ? getArticle(slug) : null;

  if (!slug) return null;

  if (!article) {
    return (
      <>
        <Head>
          <title>Article introuvable — SellCov</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        </Head>
        <div style={{maxWidth:'760px',margin:'0 auto',padding:'80px 24px',color:'#fff',fontFamily:"'Inter',system-ui,sans-serif",background:'#000',minHeight:'100vh'}}>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'32px',marginBottom:'16px'}}>Article introuvable</h1>
          <p style={{color:'#9a9a9a',marginBottom:'24px'}}>Cet article n'existe pas ou a été retiré.</p>
          <Link href="/blog" style={{color:'#5ee8a3'}}>Retour au blog</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} — SellCov</title>
        <meta name="description" content={article.description} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:image" content="https://www.sellcov.com/logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root{--bg:#000;--bg-card:#0e0e0e;--border:#1e1e1e;--text:#fff;--text-muted:#9a9a9a;--text-dim:#5a5a5a;--green:#5ee8a3;--maxw:760px}
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.85;-webkit-font-smoothing:antialiased}
        a{color:var(--green);text-decoration:none}
        a:hover{text-decoration:underline}
      `}</style>

      <div style={{maxWidth:'var(--maxw)',margin:'0 auto',padding:'60px 24px 80px'}}>

        <div style={{marginBottom:'40px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <Link href="/" style={{display:'flex',alignItems:'center'}}>
            <img src="/logo.png" alt="SellCov" style={{height:'54px',width:'auto',display:'block'}} />
          </Link>
          <Link href="/blog" style={{fontSize:'14px',color:'var(--text-muted)'}}>← Tous les articles</Link>
        </div>

        {article.category && (
          <div style={{fontSize:'11px',color:'var(--green)',letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:'14px'}}>
            {article.category}
          </div>
        )}

        <h1 style={{fontFamily:'Playfair Display,serif',fontSize:'clamp(30px,5vw,46px)',lineHeight:'1.15',letterSpacing:'-0.02em',marginBottom:'18px'}}>
          {article.title}
        </h1>
        <p style={{color:'var(--text-dim)',fontSize:'14px',marginBottom:'40px',borderBottom:'0.5px solid var(--border)',paddingBottom:'24px'}}>
          {formatDate(article.date)} · {article.readTime}
        </p>

        <div style={{color:'var(--text-muted)',fontSize:'17px',lineHeight:'1.85'}}>
          {(article.content || []).map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} style={{fontFamily:'Playfair Display,serif',fontSize:'24px',color:'#fff',marginTop:'40px',marginBottom:'14px',lineHeight:'1.3'}}>
                  {block.text}
                </h2>
              );
            }
            if (block.type === "p") {
              return (
                <p key={i} style={{marginBottom:'18px'}}>{block.text}</p>
              );
            }
            if (block.type === "cta") {
              return (
                <div key={i} style={{margin:'40px 0',padding:'24px',border:'1px solid var(--green)',borderRadius:'14px',background:'rgba(94,232,163,.06)',textAlign:'center'}}>
                  <Link href={block.href} style={{display:'inline-block',padding:'14px 28px',background:'var(--green)',color:'#000',borderRadius:'999px',fontWeight:'600',textDecoration:'none',fontSize:'15px'}}>
                    {block.label}
                  </Link>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div style={{marginTop:'60px',paddingTop:'24px',borderTop:'0.5px solid var(--border)',display:'flex',gap:'24px',flexWrap:'wrap',fontSize:'13px',color:'var(--text-dim)'}}>
          <Link href="/blog" style={{color:'var(--text-dim)'}}>Tous les articles</Link>
          <Link href="/" style={{color:'var(--text-dim)'}}>Accueil</Link>
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
