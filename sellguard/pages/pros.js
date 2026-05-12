import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const PLATFORMS = [
  { value: "depop", label: "Depop" },
  { value: "etsy", label: "Etsy" },
  { value: "vinted_pro", label: "Vinted Pro" },
  { value: "grailed", label: "Grailed" },
  { value: "vestiaire", label: "Vestiaire" },
  { value: "autre", label: "Autre" },
];

const VOLUMES = [
  { value: "50_100", label: "50 à 100 ventes / mois" },
  { value: "100_500", label: "100 à 500 ventes / mois" },
  { value: "500_plus", label: "500+ ventes / mois" },
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
        <title>Accès Pro · Bêta privée · SellCov</title>
        <meta
          name="description"
          content="Pour les friperies pros et revendeurs vintage qui font 50+ ventes/mois. Accès Pro illimité gratuit pendant la bêta privée."
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href="https://www.sellcov.com/pros" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sellcov.com/pros" />
        <meta property="og:title" content="Accès Pro · Bêta privée · SellCov" />
        <meta
          property="og:description"
          content="Pour les friperies pros et revendeurs vintage qui font 50+ ventes/mois. Pro illimité gratuit pendant la bêta."
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
        .col-card li::before { content: "·"; color: var(--green); position: absolute; left: 0; font-weight: 700; font-size: 18px; line-height: 1; }

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
        .offer-list li::before { content: "✓"; color: var(--green); position: absolute; left: 0; font-weight: 700; }

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
        details.faq-item summary { font-size: 16px; font-weight: 500; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
        details.faq-item summary::after { content: "+"; color: var(--text-muted); font-size: 22px; transition: transform .2s; }
        details.faq-item[open] summary::after { transform: rotate(45deg); }
        details.faq-item p { color: var(--text-muted); margin-top: 10px; font-size: 14.5px; line-height: 1.6; }

        footer.pros-footer { border-top: 1px solid var(--border); padding: 40px 24px; text-align: center; color: var(--text-dim); font-size: 13px; max-width: var(--maxw); margin: 60px auto 0; }
        footer.pros-footer a { color: var(--text-muted); margin: 0 10px; }
        footer.pros-footer a:hover { color: #fff; }
      `}</style>

      <header>
        <div className="nav">
          <Link href="/"><span style={{ display: "flex", alignItems: "center" }}><img src="/logo.png" alt="SellCov" className="logo-img" /></span></Link>
          <Link href="/"><span className="nav-back">← Retour</span></Link>
        </div>
      </header>

      <main className="container">
        {/* Hero */}
        <div className="eyebrow"><span className="dot"></span>Accès Pro · Bêta privée</div>
        <h1 className="hero-h1">
          La preuve cryptographique
          <span className="italic">pour les vendeurs vintage qui jouent gros.</span>
        </h1>
        <p className="hero-sub">
          Tu fais 50+ ventes/mois sur Depop, Etsy, Vinted Pro, Grailed ou Vestiaire. Un seul litige peut te coûter 200-2000 €. SellCov le tue avant qu'il commence : preuve vidéo horodatée, défense IA, ancrage Bitcoin.
        </p>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-value">90 sec</div>
            <div className="stat-label">Pour filmer un envoi, créer la preuve vidéo et générer le certificat horodaté.</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">Art. 1366</div>
            <div className="stat-label">Du Code civil. Fondement juridique de tes preuves : empreinte SHA-256, signature HMAC, auteur identifiable.</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">Bitcoin</div>
            <div className="stat-label">Chaque certificat est ancré dans la blockchain via OpenTimestamps. Vérifiable sans dépendre de SellCov.</div>
          </div>
        </div>

        {/* Pour qui c'est */}
        <section className="section">
          <div className="section-kicker">Pour qui c'est</div>
          <h2 className="serif">Tu te reconnais dans <span className="italic">un de ces profils ?</span></h2>
          <p className="section-lead">SellCov est pensé pour les revendeurs réguliers qui vendent des pièces avec une vraie valeur. Si tu vends 2 pulls par mois à 15 €, ce n'est pas pour toi (et c'est OK).</p>

          <div className="three-col">
            <div className="col-card">
              <h3>Friperie en ligne pro</h3>
              <p>Tu vends 100-500 pièces vintage par mois sur Depop, Etsy ou Vinted Pro. Pièces 30-300 €.</p>
              <ul>
                <li>Stock curaté chaque semaine</li>
                <li>Items uniques, irremplaçables</li>
                <li>Litiges = perte sèche</li>
              </ul>
            </div>
            <div className="col-card">
              <h3>Reseller archive / streetwear</h3>
              <p>Tu vends du workwear, du militaire, des archives Stone Island, Carhartt, Levi's. Items 80-1500 €.</p>
              <ul>
                <li>Tickets élevés = enjeu élevé</li>
                <li>Acheteurs informés et pointilleux</li>
                <li>Réputation = ton vrai capital</li>
              </ul>
            </div>
            <div className="col-card">
              <h3>Boutique multi-marketplace</h3>
              <p>Tu vends en parallèle sur 3-5 plateformes avec une équipe. 500+ ventes/mois.</p>
              <ul>
                <li>Volume = nombre absolu de litiges</li>
                <li>Process pro nécessaire</li>
                <li>Comptes équipe requis</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Combien ça vaut */}
        <section className="section">
          <div className="section-kicker">Combien ça vaut</div>
          <h2 className="serif">Une logique simple <span className="italic">de coût d'opportunité.</span></h2>
          <p className="section-lead">SellCov Pro coûte 49 €/mois. Voici comment ce prix se compare à un litige perdu sur une pièce vintage moyenne.</p>

          <div className="roi-card">
            <div className="roi-line">
              <span className="roi-label">Abonnement SellCov Pro</span>
              <span className="roi-value">49 € / mois</span>
            </div>
            <div className="roi-line">
              <span className="roi-label">Un litige perdu sur un article à 200 €</span>
              <span className="roi-value">- 200 €</span>
            </div>
            <div className="roi-line roi-total">
              <span className="roi-label">Un seul litige évité dans l'année</span>
              <span className="roi-value">= abonnement amorti</span>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 18, lineHeight: 1.6 }}>
            SellCov ne garantit pas de gagner tous tes litiges. Ce qu'il fait : te donner une preuve <strong style={{ color: "#fff" }}>horodatée, intègre et opposable</strong> en médiation, là où aujourd'hui tu n'as souvent qu'un screenshot de bordereau. Pour un revendeur qui vend des pièces à 50 € et plus, un seul litige résolu en ta faveur dans l'année compense l'abonnement.
          </p>
          <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 12, fontStyle: "italic" }}>
            Aucun pourcentage de gain garanti. Les résultats dépendent de la médiation propre à chaque marketplace et de la qualité de tes preuves.
          </p>
        </section>

        {/* Offre bêta */}
        <section className="section">
          <div className="section-kicker">Offre bêta privée</div>
          <h2 className="serif">Pro illimité, <span className="italic">gratuit pendant 2 mois.</span></h2>
          <p className="section-lead">On lance la bêta avec 20-30 revendeurs triés sur le volet. En échange d'un retour structuré, tu as accès gratuit au plan Pro pendant 2 mois. Pas d'engagement, pas de carte bancaire.</p>

          <div className="offer-box">
            <h3>Plan Pro · Accès bêta</h3>
            <div className="price"><del>49 €</del>0 € <small>/ mois pendant 2 mois</small></div>
            <ul className="offer-list">
              <li>Certificats vidéo illimités</li>
              <li>IA défense automatique (illimité)</li>
              <li>Génération d'annonce illimitée</li>
              <li>Ancrage Bitcoin sur chaque preuve</li>
              <li>Support email prioritaire (réponse sous 24h)</li>
              <li>Aucune CB demandée. Pas d'engagement.</li>
            </ul>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
              <strong style={{ color: "#fff" }}>En échange :</strong> un appel de 20 minutes à 4 semaines pour partager ce qui marche, ce qui manque, ce qui pourrait être mieux. Pas de revente de données, pas de spam.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="section" id="form">
          <div className="section-kicker">Demande d'accès</div>
          <h2 className="serif">Demande ton accès en 60 secondes.</h2>
          <p className="section-lead">On répond à toutes les demandes sous 48h. Si ton profil colle, on te file un code d'accès Pro et un lien pour démarrer.</p>

          {status === "sent" ? (
            <div className="form-success">
              <h3>✓ Demande reçue</h3>
              <p>Merci. On regarde ton profil et on revient vers toi sous 48h sur {email}.</p>
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
                {status === "sending" ? "Envoi..." : "Demander mon accès"}
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
              <summary>Pourquoi vous demandez mon Instagram / Discord ?</summary>
              <p>Pour vérifier rapidement que tu es bien un revendeur actif et pas un compte fictif. On ne te suit pas, on ne te DM pas. C'est juste un signal qu'on est en face d'un vrai pro.</p>
            </details>
            <details className="faq-item">
              <summary>Que se passe-t-il après les 2 mois gratuits ?</summary>
              <p>Si tu veux continuer, le plan Pro reste à 49 €/mois sans engagement. Si tu veux arrêter, tu arrêtes. Pas de prélèvement surprise puisqu'on ne t'a jamais demandé ta CB.</p>
            </details>
            <details className="faq-item">
              <summary>Et si je fais moins de 50 ventes par mois ?</summary>
              <p>Le plan Découverte gratuit te permet de tester sur 1 envoi par mois. SellCov est pensé pour les pros. En dessous de 50 ventes/mois, le ROI n'est probablement pas là.</p>
            </details>
            <details className="faq-item">
              <summary>Mes vidéos sont-elles vraiment privées ?</summary>
              <p>Oui. Tes vidéos sont chiffrées, stockées sur serveurs européens (RGPD), accessibles uniquement depuis ton compte. On ne les visionne pas, on ne les revend pas, on ne les partage pas. L'empreinte SHA-256 + signature HMAC + ancrage Bitcoin garantissent l'intégrité sans qu'on accède au contenu.</p>
            </details>
            <details className="faq-item">
              <summary>SellCov fonctionne sur Vinted standard ?</summary>
              <p>Oui, mais notre cœur de cible reste Depop, Etsy, Vinted Pro, Grailed et Vestiaire, là où les tickets sont plus élevés et les revendeurs plus structurés. Sur Vinted standard la médiation accepte aussi nos preuves, mais l'enjeu moyen par vente est plus faible.</p>
            </details>
          </div>
        </section>
      </main>

      <footer className="pros-footer">
        <div style={{ marginBottom: 14 }}>
          <Link href="/faq">FAQ</Link>·
          <a href="mailto:hello@sellcov.com">Contact</a>·
          <Link href="/mentions-legales">Mentions légales</Link>·
          <Link href="/cgu">CGU</Link>·
          <Link href="/confidentialite">Confidentialité</Link>
        </div>
        <div>© 2026 SellCov</div>
      </footer>
    </>
  );
}
