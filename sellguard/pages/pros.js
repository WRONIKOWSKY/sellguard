import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const PLATFORMS = [
  { value: "vinted_pro", label: "Vinted Pro" },
  { value: "grailed", label: "Grailed" },
  { value: "etsy", label: "Etsy" },
  { value: "depop", label: "Depop" },
  { value: "vestiaire", label: "Vestiaire Collective" },
  { value: "autre", label: "Autre" },
];

const VOLUMES = [
  { value: "v30_50", label: "30 à 50 ventes par mois" },
  { value: "v50_100", label: "entre 50 et 100 ventes par mois" },
  { value: "v100_plus", label: "100 ventes ou plus par mois" },
];

export default function Pros() {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("");
  const [volume, setVolume] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!email || !handle || !platform || !volume) {
      setErrorMsg("Tous les champs marqués * sont requis.");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/pro-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, handle, platform, monthly_volume: volume, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Erreur réseau, réessaie.");
    }
  }

  return (
    <>
      <Head>
        <title>Cohorte fondateur, places limitées, SellCov</title>
        <meta
          name="description"
          content="Cohorte fondateur pour revendeurs pros et boutiques vintage. 30 jours d'accès complet, mise en place avec le fondateur, tarif fondateur verrouillé ensuite. Sur candidature."
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href="https://www.sellcov.com/pros" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sellcov.com/pros" />
        <meta property="og:title" content="Cohorte fondateur, places limitées, SellCov" />
        <meta
          property="og:description"
          content="Cohorte fondateur pour revendeurs pros et boutiques vintage. 30 jours d'accès complet, mise en place avec le fondateur, puis tarif fondateur verrouillé. Sur candidature."
        />
        <meta property="og:image" content="https://www.sellcov.com/logo.png" />
        <link rel="icon" type="image/png" href="/logo.png" />
      </Head>

      <style jsx global>{`
        :root {
          --bg: #000;
          --bg-card: #0e0e0e;
          --bg-panel: #141414;
          --border: #1e1e1e;
          --border-strong: #2a2a2a;
          --text: #fff;
          --text-muted: #9a9a9a;
          --text-dim: #5a5a5a;
          --green: #5ee8a3;
          --green-bg: rgba(94, 232, 163, 0.07);
          --radius: 18px;
          --maxw: 960px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: var(--font-inter), system-ui, sans-serif;
          background: var(--bg); color: var(--text); line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        .serif { font-family: var(--font-playfair), serif; font-weight: 700; letter-spacing: -.01em; }
        .italic { font-style: italic; color: var(--text-muted); font-weight: 500; }
        header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          backdrop-filter: blur(14px); background: rgba(0, 0, 0, 0.55);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 24px; max-width: 1200px; margin: 0 auto;
        }
        .logo-img { height: 72px; width: auto; display: block; }
        .nav-back { color: var(--text-muted); font-size: 14px; transition: color .2s; }
        .nav-back:hover { color: #fff; }

        .container { max-width: var(--maxw); margin: 0 auto; padding: 140px 24px 80px; }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green-bg); border: 1px solid rgba(94, 232, 163, .25);
          padding: 7px 14px; border-radius: 999px; font-size: 13px; color: var(--green);
          margin-bottom: 32px;
        }
        .eyebrow .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); }

        h1.hero-h1 {
          font-family: var(--font-playfair), serif; font-weight: 700;
          font-size: clamp(40px, 6vw, 64px); line-height: 1.02; letter-spacing: -.02em;
          margin-bottom: 24px;
        }
        h1.hero-h1 .italic { display: block; font-size: 0.85em; }
        .hero-sub {
          font-size: clamp(16px, 1.6vw, 19px); color: var(--text-muted);
          max-width: 720px; line-height: 1.5; margin-bottom: 40px;
        }

        .hero-stats {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
          margin-bottom: 56px;
        }
        @media(max-width: 720px) { .hero-stats { grid-template-columns: 1fr; } }
        .stat-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 22px 20px;
        }
        .stat-value { font-family: var(--font-playfair), serif; font-size: 32px; line-height: 1; color: var(--green); margin-bottom: 8px; }
        .stat-label { color: var(--text-muted); font-size: 13px; line-height: 1.4; }

        .section { margin: 80px 0; }
        .section-kicker {
          display: inline-block; color: var(--green); font-size: 12px; letter-spacing: .12em;
          text-transform: uppercase; font-weight: 600; margin-bottom: 18px;
        }
        .section h2 {
          font-family: var(--font-playfair), serif; font-weight: 700;
          font-size: clamp(28px, 4vw, 40px); line-height: 1.1; letter-spacing: -.02em;
          margin-bottom: 18px;
        }
        .section h2 .italic { display: block; font-size: 0.92em; }
        .section-lead { color: var(--text-muted); font-size: 17px; margin-bottom: 36px; max-width: 700px; line-height: 1.5; }

        .three-col { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        @media(max-width: 820px) { .three-col { grid-template-columns: 1fr; } }
        .col-card {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 26px 24px;
        }
        .col-card h3 { font-family: var(--font-playfair), serif; font-size: 22px; margin-bottom: 12px; line-height: 1.15; }
        .col-card p { color: var(--text-muted); font-size: 14.5px; line-height: 1.55; }
        .col-card ul { list-style: none; padding: 0; margin-top: 14px; }
        .col-card li { color: var(--text-muted); font-size: 14px; padding: 6px 0; padding-left: 18px; position: relative; }
        .col-card li::before { content: ""; position: absolute; left: 0; top: 13px; width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

        .roi-card {
          background: linear-gradient(180deg, var(--green-bg), transparent 90%), var(--bg-card);
          border: 1px solid rgba(94, 232, 163, .2); border-radius: var(--radius);
          padding: 32px;
        }
        .roi-line { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 0; border-bottom: 1px solid var(--border); font-size: 15px; }
        .roi-line:last-child { border-bottom: none; }
        .roi-line .roi-label { color: var(--text-muted); }
        .roi-line .roi-value { font-family: var(--font-playfair), serif; font-weight: 700; color: #fff; font-size: 18px; }
        .roi-line.roi-total .roi-value { color: var(--green); font-size: 22px; }

        .offer-box {
          background: var(--bg-card); border: 1px dashed var(--border-strong); border-radius: var(--radius);
          padding: 32px;
        }
        .offer-box h3 { font-family: var(--font-playfair), serif; font-size: 26px; margin-bottom: 14px; }
        .offer-box .price { font-family: var(--font-playfair), serif; font-size: 44px; color: var(--green); line-height: 1; margin: 8px 0 18px; }
        .offer-box .price small { font-size: 14px; color: var(--text-muted); font-weight: 400; }
        .offer-box .price del { color: var(--text-dim); font-size: 18px; margin-right: 12px; font-family: var(--font-inter); }
        .offer-list { margin: 0 0 24px 0; padding: 0; list-style: none; }
        .offer-list li { color: var(--text); padding: 6px 0 6px 24px; position: relative; font-size: 14.5px; }
        .offer-list li::before { content: ""; position: absolute; left: 0; top: 14px; width: 6px; height: 6px; border-radius: 50%; background: var(--green); }

        form.app-form {
          background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 32px; display: flex; flex-direction: column; gap: 20px;
        }
        form.app-form label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 8px; font-weight: 500; }
        form.app-form input[type=email], form.app-form input[type=text], form.app-form textarea, form.app-form select {
          width: 100%; background: var(--bg-panel); border: 1px solid var(--border-strong); border-radius: 10px;
          padding: 12px 14px; color: #fff; font-size: 15px; font-family: inherit; transition: border-color .15s;
        }
        form.app-form input:focus, form.app-form textarea:focus, form.app-form select:focus {
          outline: none; border-color: var(--green);
        }
        form.app-form textarea { resize: vertical; min-height: 90px; }
        .radios { display: flex; flex-direction: column; gap: 8px; }
        .radio-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .radio-chip {
          flex: 1 1 auto; min-width: 140px;
          background: var(--bg-panel); border: 1px solid var(--border-strong); border-radius: 10px;
          padding: 10px 14px; color: var(--text-muted); font-size: 14px; cursor: pointer;
          transition: all .15s; user-select: none; text-align: center;
        }
        .radio-chip:hover { border-color: #4a4a4a; color: #fff; }
        .radio-chip.active { background: var(--green-bg); border-color: var(--green); color: var(--green); }
        .radio-chip input { display: none; }

        button.submit {
          background: var(--green); color: #000; border: none; padding: 14px 24px; border-radius: 999px;
          font-weight: 700; font-size: 15px; cursor: pointer; font-family: inherit;
          transition: transform .15s, box-shadow .15s; margin-top: 8px;
        }
        button.submit:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(94, 232, 163, .25); }
        button.submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .form-error { color: #f570aa; font-size: 14px; }
        .form-success {
          background: var(--green-bg); border: 1px solid rgba(94, 232, 163, .3); border-radius: var(--radius);
          padding: 32px; text-align: center;
        }
        .form-success h3 { font-family: var(--font-playfair), serif; color: var(--green); font-size: 26px; margin-bottom: 12px; }
        .form-success p { color: var(--text-muted); }

        details.faq-item { border-bottom: 1px solid var(--border); padding: 18px 0; }
        details.faq-item summary { font-size: 16px; font-weight: 500; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; gap: 16px; }
        details.faq-item summary::-webkit-details-marker { display: none; }
        details.faq-item summary::after { content: ""; flex-shrink: 0; width: 12px; height: 12px; border-right: 2px solid var(--text-muted); border-bottom: 2px solid var(--text-muted); transform: rotate(45deg); transition: transform .2s; margin-bottom: 4px; }
        details.faq-item[open] summary::after { transform: rotate(-135deg); margin-bottom: 0; }
        details.faq-item p { color: var(--text-muted); margin-top: 10px; font-size: 14.5px; line-height: 1.6; }

        footer.pros-footer { border-top: 1px solid var(--border); padding: 40px 24px; text-align: center; color: var(--text-dim); font-size: 13px; max-width: var(--maxw); margin: 60px auto 0; }
        footer.pros-footer a { color: var(--text-muted); margin: 0 10px; }
        footer.pros-footer a:hover { color: #fff; }
      `}</style>

      <header>
        <div className="nav">
          <Link href="/"><span style={{ display: "flex", alignItems: "center" }}><img src="/logo.png" alt="SellCov" className="logo-img" /></span></Link>
          <Link href="/"><span className="nav-back">Retour</span></Link>
        </div>
      </header>

      <main className="container">
        {/* Hero */}
        <div className="eyebrow"><span className="dot"></span>Cohorte fondateurs, places limitées</div>
        <h1 className="hero-h1">
          Tes ventes,
          <span className="italic">à l'abri des litiges.</span>
        </h1>
        <p className="hero-sub">
          Tu es vendeur professionnel ou tu possèdes une boutique en ligne sur les marketplaces. La vidéo horodatée dissuade l'arnaque avant qu'elle existe, et tient comme preuve si un litige arrive. Preuve vidéo horodatée, défense IA, ancrage Bitcoin.
        </p>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-value">Dissuasion</div>
            <div className="stat-label">Tu filmes l'envoi et tu génères un certificat horodaté. L'acheteur sait que la preuve existe, l'arnaque s'éteint avant le litige.</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">Recevabilité</div>
            <div className="stat-label">Articles 1366 et 1358 du Code civil. Auteur identifiable, intégrité garantie, preuve admissible par tout moyen.</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">Intégrité</div>
            <div className="stat-label">Empreinte SHA-256, signature HMAC et ancrage Bitcoin sur chaque preuve. Personne, pas même nous, ne peut la modifier.</div>
          </div>
        </div>

        {/* Pour qui c'est */}
        <section className="section">
          <div className="section-kicker">Pour qui</div>
          <h2 className="serif">Tu te reconnais dans <span className="italic">un de ces profils{' '}?</span></h2>
          <p className="section-lead">C'est pour les revendeurs qui vendent des pièces à vraie valeur et qui expédient régulièrement. La vidéo horodatée protège chaque envoi et coupe court aux litiges avant qu'ils ne partent.</p>

          <div className="three-col">
            <div className="col-card">
              <h3>Boutique vintage en ligne</h3>
              <p>Tu vends des pièces vintage de façon régulière sur Vinted Pro, Grailed, Etsy ou Depop.</p>
              <ul>
                <li>Stock curaté en continu</li>
                <li>Pièces uniques, difficiles à remplacer</li>
                <li>Chaque envoi protégé par une preuve horodatée</li>
              </ul>
            </div>
            <div className="col-card">
              <h3>Reseller archive et streetwear</h3>
              <p>Tu vends du workwear, du militaire, des archives de marques recherchées.</p>
              <ul>
                <li>Pièces à forte valeur, acheteurs exigeants</li>
                <li>État précis filmé et horodaté au départ</li>
                <li>Ta réputation de vendeur protégée</li>
              </ul>
            </div>
            <div className="col-card">
              <h3>Boutique multi-marketplace</h3>
              <p>Tu vends sur plusieurs plateformes, avec un vrai volume d'envois.</p>
              <ul>
                <li>Un process de preuve identique partout</li>
                <li>Moins de litiges grâce à la dissuasion</li>
                <li>Un dossier prêt si un acheteur conteste</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Ce que ça change */}
        <section className="section">
          <div className="section-kicker">Ce que ça change</div>
          <h2 className="serif">Le vrai coût d'un litige <span className="italic">n'est pas que l'article.</span></h2>
          <p className="section-lead">Une vidéo horodatée fait deux choses. Elle dissuade l'arnaque avant qu'elle existe, parce que l'acheteur sait que la preuve est là. Et si un litige arrive quand même, elle tient comme preuve dans tes échanges.</p>

          <div className="three-col">
            <div className="col-card">
              <h3>Avant le litige</h3>
              <p>L'acheteur voit que l'envoi est filmé et horodaté. La plupart des fausses réclamations ne partent jamais.</p>
            </div>
            <div className="col-card">
              <h3>Pendant le litige</h3>
              <p>Tu réponds avec une preuve horodatée, intègre et opposable, au lieu d'un simple screenshot de bordereau.</p>
            </div>
            <div className="col-card">
              <h3>Ce que tu protèges</h3>
              <p>Pas seulement la pièce. Le temps passé à te défendre, ta note vendeur et la santé de ton compte.</p>
            </div>
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 18, fontStyle: "italic" }}>
            SellCov ne garantit pas l'issue d'un litige. Le résultat dépend de chaque marketplace et de la qualité de tes preuves.
          </p>
        </section>

        {/* Offre fondateur */}
        <section className="section">
          <div className="section-kicker">Cohorte fondateurs</div>
          <h2 className="serif">Cohorte fondateur <span className="italic">limitée.</span></h2>
          <p className="section-lead">Tu démarres avec 30 jours d'accès complet et une mise en place en visio avec le fondateur. Ensuite tu gardes un tarif fondateur verrouillé pendant que le tarif public augmente. En contrepartie, un retour franc et le droit de raconter ton cas si ça marche.</p>

          <div className="offer-box">
            <h3>Place fondateur</h3>
            <div className="price">0 € <small>les 30 premiers jours, accès complet</small></div>
            <ul className="offer-list">
              <li>Certificats vidéo illimités</li>
              <li>IA défense automatique illimitée</li>
              <li>Génération d'annonce illimitée</li>
              <li>Ancrage Bitcoin sur chaque preuve</li>
              <li>Mise en place en visio avec le fondateur</li>
              <li>Support email prioritaire</li>
              <li>Tarif fondateur verrouillé après les 30 jours, sous le prix public</li>
              <li>Aucune carte bancaire demandée, pas d'engagement</li>
            </ul>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
              <strong style={{ color: "#fff" }}>En contrepartie :</strong> un retour franc sur ce qui marche et ce qui manque, et le droit de raconter ton cas si ça marche. Pas de revente de données, pas de spam.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="section" id="form">
          <div className="section-kicker">Candidature</div>
          <h2 className="serif">Candidate en quelques minutes.</h2>
          <p className="section-lead">Les places sont limitées. On lit chaque candidature et on répond sous 48h. Si ton profil colle, on cale ta mise en place et on t'ouvre l'accès.</p>

          {status === "sent" ? (
            <div className="form-success">
              <h3>Candidature reçue</h3>
              <p>Merci. On lit ta candidature et on revient vers toi sous 48h sur {email}.</p>
            </div>
          ) : (
            <form className="app-form" onSubmit={onSubmit}>
              <div>
                <label htmlFor="email">Email *</label>
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com" autoComplete="email" required
                />
              </div>

              <div>
                <label htmlFor="handle">Handle Instagram, Discord ou Twitter *</label>
                <input
                  id="handle" type="text" value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@tonhandle ou tonhandle#1234" required
                />
              </div>

              <div>
                <label>Plateforme principale *</label>
                <div className="radio-row">
                  {PLATFORMS.map((p) => (
                    <label key={p.value} className={`radio-chip${platform === p.value ? " active" : ""}`}>
                      <input
                        type="radio" name="platform" value={p.value}
                        checked={platform === p.value}
                        onChange={(e) => setPlatform(e.target.value)}
                      />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label>Volume mensuel *</label>
                <div className="radio-row">
                  {VOLUMES.map((v) => (
                    <label key={v.value} className={`radio-chip${volume === v.value ? " active" : ""}`}>
                      <input
                        type="radio" name="volume" value={v.value}
                        checked={volume === v.value}
                        onChange={(e) => setVolume(e.target.value)}
                      />
                      {v.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="note">Note (optionnel)</label>
                <textarea
                  id="note" value={note} onChange={(e) => setNote(e.target.value.substring(0, 500))}
                  placeholder="Une histoire de litige récente, un besoin spécifique, ou pourquoi ça t'intéresse..."
                  maxLength={500}
                />
              </div>

              {errorMsg && <div className="form-error">{errorMsg}</div>}

              <button className="submit" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Envoi..." : "Envoyer ma candidature"}
              </button>
            </form>
          )}
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="section-kicker">Questions fréquentes</div>
          <h2 className="serif">Ce qu'on nous demande <span className="italic">le plus souvent.</span></h2>
          <div style={{ marginTop: 18 }}>
            <details className="faq-item">
              <summary>Pourquoi vous demandez mon Instagram ou Discord ?</summary>
              <p>Pour vérifier que tu es un vrai revendeur, pas un compte fictif. On ne te suit pas, on ne te DM pas.</p>
            </details>
            <details className="faq-item">
              <summary>Que se passe-t-il après les 30 jours ?</summary>
              <p>Si tu continues, tu gardes un tarif fondateur verrouillé, sous le prix public, tant que tu restes. Si tu arrêtes, tu arrêtes. Pas de prélèvement surprise puisqu'on ne t'a jamais demandé ta carte bancaire.</p>
            </details>
            <details className="faq-item">
              <summary>Et si je débute ou je fais peu de volume ?</summary>
              <p>Le plan Découverte gratuit te laisse tester sans carte bancaire, avec un certificat vidéo par mois. Quand ton volume grimpe, la cohorte fondateur t'attend.</p>
            </details>
            <details className="faq-item">
              <summary>Mes vidéos sont-elles vraiment privées ?</summary>
              <p>Oui. Tes vidéos sont chiffrées, stockées sur serveurs européens (RGPD), accessibles uniquement depuis ton compte. On ne les visionne pas, on ne les revend pas, on ne les partage pas. L'empreinte SHA-256, la signature HMAC et l'ancrage Bitcoin garantissent l'intégrité sans qu'on accède au contenu.</p>
            </details>
            <details className="faq-item">
              <summary>SellCov fonctionne sur Vinted standard ?</summary>
              <p>Oui. SellCov est surtout pensé pour Vinted Pro, Grailed, Etsy, Depop et Vestiaire Collective, là où les pièces ont une vraie valeur. Sur Vinted standard la valeur moyenne par vente est plus basse, mais la protection fonctionne de la même façon.</p>
            </details>
          </div>
        </section>
      </main>

      <footer className="pros-footer">
        <div style={{ marginBottom: 14 }}>
          <Link href="/faq">FAQ</Link>
          <a href="mailto:hello@sellcov.com">Contact</a>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/cgu">CGU</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </div>
        <div>© 2026 SellCov</div>
      </footer>
    </>
  );
}
