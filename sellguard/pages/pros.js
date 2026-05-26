import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/pros.module.css";

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
  { value: "v50_100", label: "50 à 100 ventes par mois" },
  { value: "v100_plus", label: "100 ventes et plus par mois" },
];

export default function Pros() {
  const [email, setEmail] = useState("");
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState("");
  const [volume, setVolume] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("idle");
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
        <title>SellCov — La preuve qui protège ta vente</title>
        <meta
          name="description"
          content="La preuve vidéo horodatée qui protège chaque vente. Pour les revendeurs vintage qui expédient en volume. Cohorte fondateurs ouverte, sur candidature."
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href="https://www.sellcov.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sellcov.com/" />
        <meta property="og:title" content="La preuve qui protège ta vente." />
        <meta
          property="og:description"
          content="Cohorte fondateurs, places limitées."
        />
        <meta property="og:image" content="https://www.sellcov.com/og.png" />
        <meta property="og:image:alt" content="SellCov — hérisson et bouclier" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="La preuve qui protège ta vente." />
        <meta name="twitter:description" content="Cohorte fondateurs, places limitées." />
        <meta name="twitter:image" content="https://www.sellcov.com/og.png" />
      </Head>

      <style jsx global>{`
        :root {
          --bg: #f8f7f3;
          --bg-soft: #ffffff;
          --bg-card: #ffffff;
          --ink: #111111;
          --ink-soft: #2a2a2a;
          --muted: #6b6b6b;
          --dim: #a0a09a;
          --line: #e6e4dc;
          --line-strong: #d4d2c8;
          --green: #1f9f5f;
          --green-deep: #167a48;
          --green-soft: #e7f3ec;
          --bubble: #ffffff;
          --radius: 16px;
          --radius-lg: 28px;
          --maxw: 720px;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        html, body { overflow-x: hidden; }
        body {
          font-family: var(--font-inter), -apple-system, system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
          line-height: 1.55;
          -webkit-font-smoothing: antialiased;
        }
        a { color: inherit; text-decoration: none; }
        img { display: block; max-width: 100%; }
        button { font-family: inherit; }

        header {
          position: sticky; top: 0; z-index: 50;
          background: rgba(248, 247, 243, 0.92);
          backdrop-filter: blur(10px);
        }
        .nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px; max-width: 1100px; margin: 0 auto;
        }
        .nav-logo { display: flex; align-items: center; }
        .nav-logo img { height: 80px; width: auto; display: block; }
        .lang-switcher {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 600;
        }
        .lang-active { color: var(--ink); }
        .lang-disabled { color: var(--dim); cursor: not-allowed; opacity: 0.55; }
        .lang-divider { color: var(--dim); }
        .nav-back {
          color: var(--muted); font-size: 14px; font-weight: 500;
          padding: 8px 14px; border-radius: 999px; transition: background .15s;
        }
        .nav-back:hover { background: var(--line); color: var(--ink); }

        main { max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }

        .block { padding: 48px 0; text-align: center; }
        .block:first-of-type { padding-top: 56px; }
        @media (min-width: 720px) {
          .block { padding: 72px 0; }
          .block:first-of-type { padding-top: 80px; }
        }

        .kicker {
          display: inline-block;
          font-size: 12px; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--green-deep);
          margin-bottom: 22px;
        }

        h1.title, h2.title {
          font-family: var(--font-inter), -apple-system, system-ui, sans-serif;
          font-weight: 800;
          font-size: clamp(26px, 6.5vw, 44px);
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: var(--ink);
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: none;
          max-width: 100%;
          text-wrap: balance;
        }
        h1.title { font-size: clamp(28px, 7.2vw, 52px); }
        @media (min-width: 480px) {
          h1.title { font-size: clamp(36px, 5.5vw, 52px); }
          h2.title { font-size: clamp(30px, 5vw, 44px); }
        }
        .accent { color: var(--green); display: block; }
        .sub {
          color: var(--muted);
          font-size: clamp(16px, 1.7vw, 18px);
          line-height: 1.55;
          max-width: 480px;
          margin: 18px auto 0;
        }

        .mascot {
          width: clamp(140px, 28vw, 200px);
          height: auto;
          margin: 0 auto 28px;
        }
        .mascot-sm {
          width: clamp(80px, 16vw, 110px);
          height: auto;
          margin: 0 auto 22px;
        }

        .cta-row { margin-top: 36px; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--green); color: #fff;
          padding: 16px 28px; border-radius: 999px;
          font-weight: 700; font-size: 15px;
          border: none; cursor: pointer;
          transition: transform .15s, background .15s, box-shadow .15s;
          box-shadow: 0 6px 20px rgba(31, 159, 95, 0.22);
        }
        .btn-primary:hover {
          background: var(--green-deep);
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(31, 159, 95, 0.32);
        }
        .btn-primary .icon-link {
          width: 16px; height: 16px;
        }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          color: var(--ink); padding: 14px 24px;
          border-radius: 999px; font-weight: 600; font-size: 14px;
          border: 1.5px solid var(--line-strong);
          transition: border-color .15s;
        }
        .btn-ghost:hover { border-color: var(--ink); }

        .illus {
          margin: 44px auto 0;
          max-width: 320px;
          width: 100%;
          aspect-ratio: 1 / 1;
        }
        .illus svg, .illus img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .illus-photo { max-width: 320px; }

        .sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .illus-montage {
          max-width: 580px;
          width: 100%;
          margin: 0 auto;
        }
        .illus-montage img { width: 100%; height: auto; display: block; }

        /* Renard centré, bulles flottant à côté du carton (à droite) */
        .voleur-scene {
          position: relative;
          max-width: 440px;
          margin: 36px auto 0;
          aspect-ratio: 3 / 2;
        }
        .voleur-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .voleur-bubbles {
          position: absolute;
          top: 28%;
          left: 100%;
          margin-left: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
        }
        @media (max-width: 720px) {
          .voleur-bubbles {
            position: static;
            margin: 16px auto 0;
            align-items: center;
            flex-direction: column;
          }
        }

        /* (ancien .bubbles conservé pour compat — non utilisé) */
        .bubbles {
          display: flex; flex-direction: column; gap: 8px;
          align-items: center;
        }
        .bubble {
          background: #ffffff;
          border: 1.5px solid var(--line);
          border-radius: 18px 18px 18px 4px;
          padding: 9px 15px;
          font-size: 14px;
          color: var(--ink-soft);
          font-weight: 500;
          position: relative;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          white-space: nowrap;
        }
        .bubble::before {
          content: none;
        }
        .bubble:nth-child(1) { transform: translateX(40px); }
        .bubble:nth-child(2) { transform: translateX(-10px); }
        @media (max-width: 480px) {
          .bubbles { max-width: 280px; }
          .bubble:nth-child(1) { transform: translateX(20px); }
          .bubble:nth-child(2) { transform: translateX(-10px); }
        }

        /* Offre cohorte */
        .offer-card {
          background: var(--bg-card);
          border: 1.5px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 44px 28px;
          margin-top: 32px;
          text-align: left;
        }
        .offer-badges {
          display: flex; flex-direction: column; gap: 10px;
          align-items: center; margin-bottom: 28px;
        }
        .offer-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green-soft);
          color: var(--green-deep);
          font-weight: 700; font-size: 14px;
          padding: 10px 18px; border-radius: 999px;
        }
        .offer-badge.outline {
          background: transparent;
          border: 1.5px solid var(--line-strong);
          color: var(--ink-soft);
          font-weight: 600;
        }
        .offer-list {
          list-style: none; padding: 0; margin: 0 0 28px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .offer-list li {
          display: flex; align-items: flex-start; gap: 12px;
          font-size: 15.5px; color: var(--ink-soft);
          line-height: 1.5;
        }
        .offer-list li::before {
          content: "";
          flex-shrink: 0;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: var(--green-soft);
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231f9f5f' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><polyline points='5 13 10 18 19 7'/></svg>");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 14px;
          margin-top: 1px;
        }
        .offer-fineprint {
          color: var(--ink-soft); font-size: 14px; line-height: 1.7;
          font-style: italic;
          text-align: center;
          max-width: 460px;
          margin: 36px auto 8px;
          padding-top: 28px;
          border-top: 1px solid var(--line);
        }

        /* Form */
        .form-wrap {
          background: var(--bg-card);
          border: 1.5px solid var(--line);
          border-radius: var(--radius-lg);
          padding: 36px 28px;
          margin-top: 32px;
          text-align: left;
        }
        .form-wrap label {
          display: block; font-size: 13px; color: var(--muted);
          margin-bottom: 8px; font-weight: 600;
          letter-spacing: 0.02em;
        }
        .form-input {
          width: 100%; background: var(--bg-soft);
          border: 1.5px solid var(--line-strong);
          border-radius: 12px; padding: 13px 14px;
          color: var(--ink); font-size: 15.5px; font-family: inherit;
          transition: border-color .15s;
          display: block;
        }
        .form-input:focus {
          outline: none; border-color: var(--green);
        }
        .form-field { margin-bottom: 22px; }
        .radio-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .radio-chip {
          flex: 1 1 auto; min-width: 110px;
          background: var(--bg-soft);
          border: 1.5px solid var(--line-strong);
          border-radius: 12px;
          padding: 11px 14px;
          color: var(--ink-soft);
          font-size: 14px; font-weight: 500;
          cursor: pointer;
          transition: all .15s;
          user-select: none; text-align: center;
        }
        .radio-chip:hover { border-color: var(--ink-soft); }
        .radio-chip.active {
          background: var(--green-soft);
          border-color: var(--green);
          color: var(--green-deep);
          font-weight: 700;
        }
        .radio-chip input { display: none; }
        button.submit {
          width: 100%;
          background: var(--green); color: #fff;
          border: none; padding: 16px 24px; border-radius: 999px;
          font-weight: 700; font-size: 15px;
          cursor: pointer;
          transition: background .15s, transform .15s, box-shadow .15s;
          box-shadow: 0 6px 20px rgba(31, 159, 95, 0.22);
        }
        button.submit:hover {
          background: var(--green-deep);
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(31, 159, 95, 0.32);
        }
        button.submit:disabled {
          opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none;
        }
        .form-error {
          color: #c0392b; font-size: 14px; margin-bottom: 14px;
          font-weight: 500;
        }
        .form-success {
          background: var(--green-soft);
          border: 1.5px solid var(--green);
          border-radius: var(--radius-lg);
          padding: 36px 28px; text-align: center;
          margin-top: 32px;
        }
        .form-success h3 {
          font-weight: 800; color: var(--green-deep);
          font-size: 24px; margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .form-success p { color: var(--ink-soft); font-size: 15px; }

        /* FAQ */
        .faq { text-align: left; margin-top: 32px; }
        details.faq-item {
          border-bottom: 1px solid var(--line);
          padding: 20px 0;
        }
        details.faq-item summary {
          font-size: 16px; font-weight: 600; color: var(--ink);
          cursor: pointer; list-style: none;
          display: flex; justify-content: space-between; align-items: center;
          gap: 16px;
        }
        details.faq-item summary::-webkit-details-marker { display: none; }
        details.faq-item summary::after {
          content: "+"; flex-shrink: 0;
          font-size: 22px; color: var(--muted);
          font-weight: 400; line-height: 1;
          transition: transform .2s;
        }
        details.faq-item[open] summary::after {
          content: "−";
        }
        details.faq-item p {
          color: var(--muted); margin-top: 10px;
          font-size: 14.5px; line-height: 1.65;
        }

        /* Footer */
        footer.pros-footer {
          border-top: 1px solid var(--line);
          padding: 36px 24px;
          text-align: center;
          color: var(--dim); font-size: 13px;
          max-width: var(--maxw); margin: 60px auto 0;
        }
        footer.pros-footer .foot-links {
          margin-bottom: 14px;
          display: flex; gap: 18px; justify-content: center; flex-wrap: wrap;
        }
        footer.pros-footer a { color: var(--muted); font-size: 13px; }
        footer.pros-footer a:hover { color: var(--ink); }

        /* Petite ligne décorative verte sous certaines accent */
        .underline-deco {
          display: block;
          width: 56px; height: 3px;
          background: var(--green);
          margin: 14px auto 0;
          border-radius: 2px;
        }
      `}</style>

      <header>
        <div className="nav">
          <Link href="/" className="nav-logo">
            <img src="/logo-full.png" alt="SellCov" />
          </Link>
          <div className="lang-switcher">
            <span className="lang-active">FR</span>
            <span className="lang-divider">·</span>
            <span className="lang-disabled" title="Coming soon">EN</span>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="block">
          <h1 className="title">
            La preuve qui
            <span className="accent">protège ta vente.</span>
          </h1>
          <p className="sub">Pour les revendeurs vintage qui expédient en volume.</p>
          <div className="cta-row">
            <a href="#form" className="btn-primary">
              <IconLink />
              Candidater à la cohorte
            </a>
          </div>
        </section>

        {/* PROBLÈME — Sans preuve, tu perds */}
        <section className="block">
          <h2 className="title">
            Sans preuve,
            <span className="accent">l'acheteur a toujours raison.</span>
          </h2>
          <div className="voleur-scene">
            <img
              src="/illus/voleur-renard-v3.png"
              alt="Voleur qui s'enfuit avec un colis non protégé par SellCov"
              className="voleur-img"
            />
            <div className="voleur-bubbles">
              <span className="bubble">Jamais reçu</span>
              <span className="bubble">Pas conforme</span>
            </div>
          </div>
        </section>

        {/* ÉTAPE 1 — Tu filmes l'envoi sans coupure */}
        <section className="block">
          <span className="kicker">Étape 1</span>
          <h2 className="title">
            Tu filmes l'envoi
            <span className="accent">sans coupure</span>
          </h2>
          <span className="underline-deco" />
          <p className="sub">L'article, l'emballage, la fermeture du colis. Une seule prise, horodatée.</p>
          <div className="illus illus-photo">
            <img src="/illus/step1-film.png" alt="Hérisson qui filme un article avant la mise en colis" />
          </div>
        </section>

        {/* ÉTAPE 2 — Tu préviens l'acheteur au départ */}
        <section className="block">
          <span className="kicker">Étape 2</span>
          <h2 className="title">
            Un simple message
            <span className="accent">suffit.</span>
          </h2>
          <span className="underline-deco" />
          <p className="sub">Mieux vaut prévenir que prouver.</p>
          <div className="illus illus-photo">
            <img src="/illus/step2-prevenir.png" alt="Hérisson qui prévient l'acheteur que l'envoi est certifié SellCov" />
          </div>
        </section>

        {/* ÉTAPE 3 — Si un litige passe, la preuve répond */}
        <section className="block">
          <span className="kicker">Étape 3</span>
          <h2 className="title">
            En cas de litige,
            <span className="accent">la vidéo plaide pour toi.</span>
          </h2>
          <span className="underline-deco" />
          <p className="sub">Recevable, opposable, imparable.</p>
          <div className="illus illus-photo">
            <img src="/illus/step2-preuve.png" alt="Tampon de preuve horodatée SellCov" />
          </div>
        </section>

        {/* OFFRE COHORTE */}
        <section className="block" id="offre">
          <h2 className="title">
            Place de fondateur,
            <span className="accent">limitée.</span>
          </h2>
          <div className="offer-card">
            <div className="offer-badges">
              <span className="offer-badge">
                <IconPeople />
                Cohorte fondateurs ouverte
              </span>
              <span className="offer-badge outline">
                <IconStar />
                Places limitées
              </span>
            </div>
            <ul className="offer-list">
              <li>30 jours d'accès complet, sans carte bancaire.</li>
              <li>Mise en place en visio avec le fondateur.</li>
              <li>Certificats vidéo illimités et défense IA.</li>
              <li>Ancrage Bitcoin sur chaque preuve.</li>
              <li>Tarif fondateur verrouillé après les 30 jours, sous le prix public.</li>
            </ul>
            <div className="cta-row" style={{ textAlign: "center", marginTop: 0 }}>
              <a href="#form" className="btn-primary">
                <IconLink />
                Rejoindre la cohorte
              </a>
            </div>
            <p
              className="offer-fineprint"
              style={{
                textAlign: 'center',
                maxWidth: '460px',
                margin: '36px auto 8px',
                paddingTop: '28px',
                borderTop: '1px solid #e6e4dc',
                lineHeight: 1.7,
                fontStyle: 'italic',
                fontSize: '14px',
                color: '#2a2a2a',
              }}
            >
              Contrepartie : un avis sans filtre, et le droit de partager ton succès.
            </p>
          </div>
        </section>

        {/* FORM */}
        <section className="block" id="form">
          <span className="kicker">Candidature</span>
          <h2 className="title">
            Candidate
            <span className="accent">en deux minutes.</span>
          </h2>
          <p className="sub">Tu candidates, on te répond. 48h max.</p>

          {status === "sent" ? (
            <div className={styles.formSuccess}>
              <h3>Candidature reçue.</h3>
              <p>On revient vers toi sous 48h sur {email}.</p>
            </div>
          ) : (
            <form className={styles.formWrap} onSubmit={onSubmit}>
              <div className={styles.formField}>
                <label htmlFor="email">Email *</label>
                <input
                  className={styles.formInput}
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com" autoComplete="email" required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="handle">Ton @ Instagram, Discord ou Twitter *</label>
                <input
                  className={styles.formInput}
                  id="handle" type="text" value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="@tonpseudo" required
                />
              </div>

              <div className={styles.formField}>
                <label>Plateforme principale *</label>
                <div className={styles.radioRow}>
                  {PLATFORMS.map((p) => (
                    <label key={p.value} className={`${styles.radioChip}${platform === p.value ? " " + styles.radioChipActive : ""}`}>
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

              <div className={styles.formField}>
                <label>Volume mensuel *</label>
                <div className={styles.radioRow}>
                  {VOLUMES.map((v) => (
                    <label key={v.value} className={`${styles.radioChip}${volume === v.value ? " " + styles.radioChipActive : ""}`}>
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

              <div className={styles.formField}>
                <label htmlFor="note">Note (optionnel)</label>
                <textarea
                  className={`${styles.formInput} ${styles.textarea}`}
                  id="note" value={note}
                  onChange={(e) => setNote(e.target.value.substring(0, 500))}
                  placeholder="Une histoire de litige récente, un besoin spécifique, ou pourquoi ça t'intéresse..."
                  maxLength={500}
                />
              </div>

              {errorMsg && <div className={styles.formError}>{errorMsg}</div>}

              <button className={styles.submit} type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Envoi..." : "Envoyer ma candidature"}
              </button>
            </form>
          )}
        </section>

        {/* FAQ */}
        <section className="block">
          <span className="kicker">Questions fréquentes</span>
          <h2 className="title">
            Ce qu'on nous
            <span className="accent">demande souvent.</span>
          </h2>
          <div className={styles.faq}>
            <details className={styles.faqItem}>
              <summary>{"Que se passe-t-il après les 30 jours ?"}</summary>
              <p>Si tu continues, tu gardes un tarif fondateur verrouillé, sous le prix public, tant que tu restes. Si tu arrêtes, tu arrêtes. Pas de prélèvement surprise puisqu'on ne t'a jamais demandé ta carte bancaire.</p>
            </details>
            <details className={styles.faqItem}>
              <summary>Pourquoi mon Instagram ?</summary>
              <p>Pour vérifier que tu es un vrai revendeur, pas un compte fictif. On ne te suit pas, on ne te DM pas.</p>
            </details>
            <details className={styles.faqItem}>
              <summary>Mes vidéos sont-elles vraiment privées ?</summary>
              <p>Oui. Tes vidéos sont chiffrées, stockées sur serveurs européens (RGPD), accessibles uniquement depuis ton compte. On ne les visionne pas, on ne les revend pas.</p>
            </details>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/faq">FAQ</Link>
          <a href="mailto:hello@sellcov.com">Contact</a>
          <a href="https://www.instagram.com/sellcov" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@sellcov.com" target="_blank" rel="noopener noreferrer">TikTok</a>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/cgu">CGU</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </div>
        <div className={styles.footerCopy}>© 2026 SellCov</div>
      </footer>
    </>
  );
}

/* ---------- Illustrations SVG inline (style linéaire carrousel) ---------- */

function IllusFilm() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Main */}
      <path d="M40 200 C 40 175, 55 165, 75 168 L 95 170 L 100 160 C 102 152, 110 148, 118 152 C 124 155, 126 162, 122 170 L 118 178" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M70 200 L 70 220 L 130 220 L 130 200" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Phone tenu en main */}
      <rect x="95" y="60" width="100" height="160" rx="12" stroke="#111" strokeWidth="2.5" fill="#fff"/>
      <rect x="105" y="72" width="80" height="130" rx="4" stroke="#111" strokeWidth="1.5" fill="#f8f7f3"/>
      {/* T-shirt sur l'écran */}
      <path d="M125 102 L 135 95 L 155 95 L 165 102 L 165 118 L 155 118 L 155 165 L 135 165 L 135 118 L 125 118 Z" stroke="#111" strokeWidth="2" strokeLinejoin="round" fill="none"/>
      {/* REC dot + texte */}
      <circle cx="178" cy="86" r="4" fill="#1f9f5f"/>
      <text x="186" y="90" fontSize="9" fontWeight="700" fill="#111" fontFamily="system-ui, sans-serif">REC</text>
      {/* Crochets de viseur */}
      <path d="M115 90 L 115 82 L 123 82 M 175 82 L 183 82 L 183 90 M 115 180 L 115 188 L 123 188 M 175 188 L 183 188 L 183 180" stroke="#1f9f5f" strokeWidth="2" strokeLinecap="round" fill="none"/>
      {/* Colis à droite */}
      <path d="M225 165 L 265 150 L 305 165 L 305 210 L 265 225 L 225 210 Z" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" fill="#fff"/>
      <path d="M225 165 L 265 180 L 305 165 M 265 180 L 265 225" stroke="#111" strokeWidth="2" strokeLinejoin="round"/>
      <line x1="245" y1="157" x2="245" y2="217" stroke="#1f9f5f" strokeWidth="4"/>
      <path d="M245 157 L 285 142" stroke="#1f9f5f" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function IllusTampon() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Tampon - poignée */}
      <rect x="135" y="40" width="50" height="14" rx="3" stroke="#111" strokeWidth="2.5" fill="#fff"/>
      <line x1="160" y1="54" x2="160" y2="80" stroke="#111" strokeWidth="2.5"/>
      {/* Tampon - corps */}
      <rect x="110" y="80" width="100" height="36" rx="4" stroke="#111" strokeWidth="2.5" fill="#fff"/>
      <rect x="120" y="116" width="80" height="14" rx="2" stroke="#111" strokeWidth="2.5" fill="#fff"/>
      {/* Texte "PREUVE" sur tampon */}
      <text x="160" y="103" fontSize="12" fontWeight="800" fill="#1f9f5f" textAnchor="middle" fontFamily="system-ui, sans-serif">PREUVE</text>
      {/* Lignes d'impact */}
      <path d="M70 90 L 95 90 M 70 100 L 95 100 M 245 90 L 270 90 M 245 100 L 270 100" stroke="#1f9f5f" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Cartouche horodatage */}
      <rect x="95" y="160" width="130" height="50" rx="4" stroke="#1f9f5f" strokeWidth="2" fill="#e7f3ec" strokeDasharray="5 3"/>
      <text x="160" y="180" fontSize="10" fontWeight="700" fill="#167a48" textAnchor="middle" fontFamily="system-ui, sans-serif">HORODATAGE</text>
      <text x="160" y="198" fontSize="11" fontWeight="600" fill="#111" textAnchor="middle" fontFamily="ui-monospace, monospace">2026-05-21  14:32</text>
    </svg>
  );
}

function IllusBouclier() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Bulle de chat (le litige) à gauche */}
      <path d="M40 70 L 130 70 Q 145 70 145 85 L 145 130 Q 145 145 130 145 L 75 145 L 60 162 L 60 145 L 55 145 Q 40 145 40 130 Z" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" fill="#fff"/>
      <line x1="55" y1="92" x2="125" y2="92" stroke="#111" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="55" y1="108" x2="120" y2="108" stroke="#111" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="55" y1="124" x2="105" y2="124" stroke="#111" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      {/* Flèche vers le bouclier */}
      <path d="M165 110 L 195 110 M 188 103 L 195 110 L 188 117" stroke="#1f9f5f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* Bouclier avec check */}
      <path d="M250 50 L 210 68 L 210 130 Q 210 175 250 195 Q 290 175 290 130 L 290 68 Z" stroke="#1f9f5f" strokeWidth="3" strokeLinejoin="round" fill="#e7f3ec"/>
      <path d="M228 125 L 244 142 L 274 108" stroke="#1f9f5f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function IllusColis() {
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Colis face */}
      <path d="M80 110 L 160 80 L 240 110 L 240 200 L 160 230 L 80 200 Z" stroke="#111" strokeWidth="2.5" strokeLinejoin="round" fill="#fff"/>
      <path d="M80 110 L 160 140 L 240 110" stroke="#111" strokeWidth="2.5" strokeLinejoin="round"/>
      <line x1="160" y1="140" x2="160" y2="230" stroke="#111" strokeWidth="2.5"/>
      {/* Scotch vert */}
      <path d="M115 96 L 115 215" stroke="#1f9f5f" strokeWidth="10" strokeLinecap="butt" opacity="0.95"/>
      <path d="M115 96 L 195 66" stroke="#1f9f5f" strokeWidth="8" strokeLinecap="butt" opacity="0.95"/>
      {/* Flèche "ce côté en haut" */}
      <g transform="translate(185 165)">
        <path d="M0 18 L 0 -10 M -7 -3 L 0 -10 L 7 -3" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M-6 25 L 6 25" stroke="#111" strokeWidth="2" strokeLinecap="round"/>
      </g>
      {/* Petits traits d'effet */}
      <path d="M40 90 L 50 100 M 30 130 L 45 130 M 280 90 L 270 100 M 290 130 L 275 130" stroke="#1f9f5f" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

function IconLink() {
  return (
    <svg className="icon-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
    </svg>
  );
}
