import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/pros.module.css";
import { useLang } from "../contexts/LangContext";

const PLATFORM_KEYS = ["vinted_pro", "grailed", "etsy", "depop", "vestiaire", "autre"];
const VOLUME_KEYS = ["v30_50", "v50_100", "v100_plus"];

export default function Pros() {
  const { t, lang, setLang } = useLang();
  const p = t.pros;

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
      setErrorMsg(p.form_required);
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
      if (!res.ok) throw new Error(data.error || "Error");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || p.form_network_err);
    }
  }

  return (
    <>
      <Head>
        <title>{p.meta_title}</title>
        <meta name="description" content={p.meta_desc} />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="canonical" href="https://www.sellcov.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.sellcov.com/" />
        <meta property="og:title" content={p.og_title} />
        <meta property="og:description" content={p.og_desc} />
        <meta property="og:image" content="https://www.sellcov.com/og.png" />
        <meta property="og:image:alt" content={p.og_image_alt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={p.og_title} />
        <meta name="twitter:description" content={p.og_desc} />
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
        .lang-btn {
          background: transparent; border: none; padding: 4px 6px;
          font-family: inherit; font-size: 14px; font-weight: 600;
          cursor: pointer; color: var(--dim);
          transition: color .15s;
        }
        .lang-btn:hover { color: var(--ink-soft); }
        .lang-btn.active { color: var(--ink); cursor: default; }
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

        .underline-deco {
          display: block;
          width: 56px; height: 3px;
          background: var(--green);
          margin: 14px auto 0;
          border-radius: 2px;
        }

        /* Ligne compat plateformes (hero) */
        .hero-compat {
          margin: 22px auto 0;
          max-width: 520px;
          text-align: center;
          line-height: 1.5;
        }
        .hero-compat-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--dim);
          margin-bottom: 8px;
        }
        .hero-compat-list {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--muted);
          letter-spacing: 0.01em;
        }
        @media (max-width: 480px) {
          .hero-compat-list { font-size: 12.5px; }
        }

      `}</style>

      <header>
        <div className="nav">
          <Link href="/" className="nav-logo">
            <img src="/logo-full.png" alt="SellCov" />
          </Link>
          <div className="lang-switcher">
            <button
              type="button"
              className={"lang-btn" + (lang === "fr" ? " active" : "")}
              onClick={() => setLang("fr")}
              aria-pressed={lang === "fr"}
            >
              FR
            </button>
            <span className="lang-divider">·</span>
            <button
              type="button"
              className={"lang-btn" + (lang === "en" ? " active" : "")}
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="block">
          <h1 className="title">
            {p.hero_title_1}
            <span className="accent">{p.hero_title_2}</span>
          </h1>
          <p className="sub">{p.hero_sub}</p>
          <div className="hero-compat">
            <div className="hero-compat-label">{p.compat_label}</div>
            <div className="hero-compat-list">{p.compat_platforms}</div>
          </div>
          <div className="cta-row">
            <a href="#form" className="btn-primary">
              <IconLink />
              {p.hero_cta}
            </a>
          </div>
        </section>

        <section className="block">
          <h2 className="title">
            {p.problem_title_1}
            <span className="accent">{p.problem_title_2}</span>
          </h2>
          <div className="voleur-scene">
            <img
              src="/illus/voleur-renard-v3.png"
              alt={p.problem_alt}
              className="voleur-img"
            />
            <div className="voleur-bubbles">
              <span className="bubble">{p.bubble_never}</span>
              <span className="bubble">{p.bubble_not_conform}</span>
            </div>
          </div>
        </section>

        <section className="block">
          <span className="kicker">{p.step1_kicker}</span>
          <h2 className="title">
            {p.step1_title_1}
            <span className="accent">{p.step1_title_2}</span>
          </h2>
          <span className="underline-deco" />
          <p className="sub">{p.step1_sub}</p>
          <div className="illus illus-photo">
            <img src="/illus/step1-film.png" alt={p.step1_alt} />
          </div>
        </section>

        <section className="block">
          <span className="kicker">{p.step2_kicker}</span>
          <h2 className="title">
            {p.step2_title_1}
            <span className="accent">{p.step2_title_2}</span>
          </h2>
          <span className="underline-deco" />
          <p className="sub">{p.step2_sub}</p>
          <div className="illus illus-photo">
            <img src="/illus/step2-prevenir.png" alt={p.step2_alt} />
          </div>
        </section>

        <section className="block">
          <span className="kicker">{p.step3_kicker}</span>
          <h2 className="title">
            {p.step3_title_1}
            <span className="accent">{p.step3_title_2}</span>
          </h2>
          <span className="underline-deco" />
          <p className="sub">{p.step3_sub}</p>
          <div className="illus illus-photo">
            <img src="/illus/step2-preuve.png" alt={p.step3_alt} />
          </div>
        </section>

        <section className="block">
          <a
            href="/verify/SC-M5QTSF2Q"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <IconLink />
            {p.proof_cta}
          </a>
        </section>

        <section className="block" id="offre">
          <h2 className="title">
            {p.offer_title_1}
            <span className="accent">{p.offer_title_2}</span>
          </h2>
          <div className="offer-card">
            <div className="offer-badges">
              <span className="offer-badge">
                <IconPeople />
                {p.offer_badge_cohort}
              </span>
              <span className="offer-badge outline">
                <IconStar />
                {p.offer_badge_limit}
              </span>
            </div>
            <ul className="offer-list">
              <li>{p.offer_li_1}</li>
              <li>{p.offer_li_2}</li>
              <li>{p.offer_li_3}</li>
              <li>{p.offer_li_4}</li>
              <li>{p.offer_li_5}</li>
            </ul>
            <div className="cta-row" style={{ textAlign: "center", marginTop: 0 }}>
              <a href="#form" className="btn-primary">
                <IconLink />
                {p.offer_cta}
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
              {p.offer_fineprint}
            </p>
          </div>
        </section>

        <section className="block" id="form">
          <span className="kicker">{p.form_kicker}</span>
          <h2 className="title">
            {p.form_title_1}
            <span className="accent">{p.form_title_2}</span>
          </h2>
          <p className="sub">{p.form_sub}</p>

          {status === "sent" ? (
            <div className={styles.formSuccess}>
              <h3>{p.form_success_title}</h3>
              <p>{p.form_success_sub} {email}.</p>
            </div>
          ) : (
            <form className={styles.formWrap} onSubmit={onSubmit}>
              <div className={styles.formField}>
                <label htmlFor="email">{p.form_email_label}</label>
                <input
                  className={styles.formInput}
                  id="email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={p.form_email_ph} autoComplete="email" required
                />
              </div>

              <div className={styles.formField}>
                <label htmlFor="handle">{p.form_handle_label}</label>
                <input
                  className={styles.formInput}
                  id="handle" type="text" value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder={p.form_handle_ph} required
                />
              </div>

              <div className={styles.formField}>
                <label>{p.form_platform_label}</label>
                <div className={styles.radioRow}>
                  {PLATFORM_KEYS.map((key) => (
                    <label key={key} className={`${styles.radioChip}${platform === key ? " " + styles.radioChipActive : ""}`}>
                      <input
                        type="radio" name="platform" value={key}
                        checked={platform === key}
                        onChange={(e) => setPlatform(e.target.value)}
                      />
                      {p.platforms[key]}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formField}>
                <label>{p.form_volume_label}</label>
                <div className={styles.radioRow}>
                  {VOLUME_KEYS.map((key) => (
                    <label key={key} className={`${styles.radioChip}${volume === key ? " " + styles.radioChipActive : ""}`}>
                      <input
                        type="radio" name="volume" value={key}
                        checked={volume === key}
                        onChange={(e) => setVolume(e.target.value)}
                      />
                      {p.volumes[key]}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formField}>
                <label htmlFor="note">{p.form_note_label}</label>
                <textarea
                  className={`${styles.formInput} ${styles.textarea}`}
                  id="note" value={note}
                  onChange={(e) => setNote(e.target.value.substring(0, 500))}
                  placeholder={p.form_note_ph}
                  maxLength={500}
                />
              </div>

              {errorMsg && <div className={styles.formError}>{errorMsg}</div>}

              <button className={styles.submit} type="submit" disabled={status === "sending"}>
                {status === "sending" ? p.form_sending : p.form_submit}
              </button>
            </form>
          )}
        </section>

        <section className="block">
          <span className="kicker">{p.faq_kicker}</span>
          <h2 className="title">
            {p.faq_title_1}
            <span className="accent">{p.faq_title_2}</span>
          </h2>
          <div className={styles.faq}>
            <details className={styles.faqItem}>
              <summary>{p.faq_q1}</summary>
              <p>{p.faq_a1}</p>
            </details>
            <details className={styles.faqItem}>
              <summary>{p.faq_q2}</summary>
              <p>{p.faq_a2}</p>
            </details>
            <details className={styles.faqItem}>
              <summary>{p.faq_q3}</summary>
              <p>{p.faq_a3}</p>
            </details>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/faq">{t.footer.faq}</Link>
          <a href="mailto:hello@sellcov.com">{t.footer.contact}</a>
          <a href="https://www.instagram.com/sellcov" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://www.tiktok.com/@sellcov.com" target="_blank" rel="noopener noreferrer">TikTok</a>
          <Link href="/mentions-legales">{t.footer.mentions}</Link>
          <Link href="/cgu">{t.footer.cgu}</Link>
          <Link href="/confidentialite">{t.footer.confidentialite}</Link>
        </div>
        <div className={styles.footerCopy}>{t.footer.copy}</div>
      </footer>
    </>
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
