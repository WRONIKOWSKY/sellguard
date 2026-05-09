import { useState } from 'react';

const arnaques = [
  {
    id: 1,
    num: "Arnaque n° 1",
    titleMain: "Le colis",
    titleItalic: "« jamais reçu ».",
    quote: "« Je n'ai jamais reçu le colis. Je demande un remboursement. »",
    explain:
      "C'est l'arnaque la plus courante. L'acheteur prétend ne jamais avoir reçu le colis, même quand la livraison est confirmée par le transporteur. Sans preuve que tu as bien envoyé le bon article, la plateforme rembourse par défaut.",
    advice:
      "Filme le dépôt en bureau de poste en une seule prise : l'article posé dans le colis, le colis que tu fermes, l'étiquette avec le numéro de suivi bien lisible. La vidéo horodatée prouve que l'envoi est parti, au bon moment, avec le bon contenu.",
    template: `Bonjour,

Je conteste cette réclamation. J'ai une preuve vidéo horodatée (certificat SellCov n° XXX) qui montre le dépôt du colis le [date], avec le numéro de suivi [numéro] clairement visible.

Je joins le certificat à ce message.

Cordialement.`,
  },
  {
    id: 2,
    num: "Arnaque n° 2",
    titleMain: "L'article",
    titleItalic: "« abîmé à la réception ».",
    quote: "« L'article est arrivé troué. Je veux être remboursé. »",
    explain:
      "L'acheteur reçoit l'article en bon état mais prétend qu'il était abîmé. Il envoie parfois la photo d'un autre article, ou d'un défaut qu'il a lui-même créé. Sans preuve de l'état de l'article au moment de l'expédition, impossible de se défendre.",
    advice:
      "Filme l'article sous plusieurs angles juste avant de l'emballer. Montre l'état réel : pas de trou, pas de tache, pas de défaut. L'horodatage prouve que l'article était intact au départ. Si l'acheteur envoie une photo différente, l'incohérence saute aux yeux.",
    template: `Bonjour,

Je conteste cette réclamation. J'ai une preuve vidéo horodatée (certificat SellCov n° XXX) réalisée le [date] avant expédition, qui montre l'article en [état réel], conforme à la description de l'annonce.

Je joins le certificat à ce message.

Cordialement.`,
  },
  {
    id: 3,
    num: "Arnaque n° 3",
    titleMain: "La substitution",
    titleItalic: "d'article.",
    quote: "« Ce n'est pas l'article que j'ai commandé. »",
    explain:
      "L'acheteur reçoit bien ton article, mais prétend avoir reçu autre chose. Il renvoie un article de moindre valeur et demande à être remboursé. C'est une fraude active, de plus en plus fréquente, qui cible les pièces chères et les articles de marque.",
    advice:
      "Filme l'article que tu places dans le colis en montrant bien les éléments identifiables : la marque, la taille, la couleur, une particularité visible. La vidéo prouve que ce que tu as envoyé correspond exactement à l'annonce.",
    template: `Bonjour,

Je conteste cette réclamation. J'ai une preuve vidéo horodatée (certificat SellCov n° XXX) qui montre l'article [description précise] placé dans le colis le [date]. La marque, la taille et la couleur sont clairement visibles.

Je joins le certificat à ce message.

Cordialement.`,
  },
  {
    id: 4,
    num: "Arnaque n° 4",
    titleMain: "Le colis",
    titleItalic: "« vide » à la réception.",
    quote: "« Le colis est arrivé vide, sans l'article principal. »",
    explain:
      "L'acheteur prétend avoir reçu un colis vide. Parfois c'est vrai (vol lors du transport), mais souvent c'est de la mauvaise foi. Sans preuve que le colis était bien rempli à l'expédition, la plateforme ne peut pas trancher, et le doute profite à l'acheteur.",
    advice:
      "Filme en une seule prise continue : l'article que tu places dans le colis, puis le colis que tu fermes avec le scotch. Pas de coupure, pas de montage. Il devient impossible pour l'acheteur de prétendre avoir reçu un colis vide.",
    template: `Bonjour,

Je conteste cette réclamation. J'ai une preuve vidéo horodatée (certificat SellCov n° XXX), filmée en prise continue, qui montre l'article placé dans le colis puis le colis fermé et scellé le [date].

Je joins le certificat à ce message.

Cordialement.`,
  },
  {
    id: 5,
    num: "Arnaque n° 5",
    titleMain: "« Ce n'est",
    titleItalic: "pas authentique. »",
    quote: "« Le produit est une contrefaçon, je signale à la plateforme. »",
    explain:
      "Pour les articles de marque, l'acheteur peut contester l'authenticité et signaler ton compte. La plateforme peut suspendre ton compte le temps de l'enquête, même si l'article est bel et bien authentique. Une mauvaise note suffit à faire chuter tes ventes pendant des semaines.",
    advice:
      "Filme les marqueurs d'authenticité : codes produit, hologrammes, étiquettes, coutures intérieures, numéro de série. Ajoute la facture d'achat si tu l'as gardée. L'ensemble constitue un dossier complet qui prouve l'authenticité de ce que tu vends.",
    template: `Bonjour,

Je conteste ce signalement. J'ai une preuve vidéo horodatée (certificat SellCov n° XXX) qui montre les marqueurs d'authenticité de l'article : [codes, étiquettes, hologrammes].

Je joins le certificat ainsi que ma facture d'achat originale.

Cordialement.`,
  },
];

export default function GuideSellCov() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500&display=swap');

        .sc-root {
          background: #000;
          color: #f5f5f5;
          font-family: 'Inter', -apple-system, sans-serif;
          font-weight: 300;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        .sc-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 120px 60px;
          min-height: 100vh;
        }

        .sc-cover {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 80px 60px;
        }

        .sc-cover-dot {
          font-family: 'Fraunces', serif;
          font-size: 48px;
          line-height: 0.5;
        }

        .sc-cover-title {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 76px;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .sc-italic {
          font-style: italic;
          color: #9a9a9a;
        }

        .sc-cover-sub {
          margin-top: 40px;
          font-size: 16px;
          color: #9a9a9a;
          max-width: 440px;
          line-height: 1.55;
        }

        .sc-cover-foot {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 12px;
          color: #6a6a6a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .sc-cover-foot .sc-brand {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 20px;
          color: #f5f5f5;
          text-transform: none;
          letter-spacing: 0;
        }

        .sc-eyebrow {
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #6a6a6a;
          margin-bottom: 40px;
        }

        .sc-intro-title {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 48px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 50px;
        }

        .sc-intro-body p {
          font-size: 17px;
          line-height: 1.65;
          color: #9a9a9a;
          margin-bottom: 22px;
        }

        .sc-intro-body p.sc-lead {
          color: #f5f5f5;
        }

        .sc-arnaque-num {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 22px;
          color: #6a6a6a;
          margin-bottom: 24px;
        }

        .sc-arnaque-title {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 44px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 50px;
        }

        .sc-section-label {
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #6a6a6a;
          margin-bottom: 18px;
        }

        .sc-quote {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 26px;
          line-height: 1.4;
          padding-left: 28px;
          border-left: 1px solid #f5f5f5;
          margin-bottom: 40px;
        }

        .sc-explain {
          font-size: 16px;
          line-height: 1.65;
          color: #9a9a9a;
          margin-bottom: 50px;
        }

        .sc-divider {
          height: 1px;
          background: #1d1d1d;
          margin: 50px 0;
          border: 0;
        }

        .sc-sub-title {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 22px;
          margin-bottom: 18px;
        }

        .sc-advice {
          font-size: 16px;
          line-height: 1.65;
          color: #9a9a9a;
          margin-bottom: 50px;
        }

        .sc-template {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.75;
          color: #f5f5f5;
          padding: 32px 34px;
          border: 1px solid #1d1d1d;
          border-radius: 2px;
          background: #080808;
          white-space: pre-wrap;
        }

        .sc-copy-btn {
          margin-top: 16px;
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 14px;
          color: #f5f5f5;
          background: transparent;
          border: none;
          padding: 6px 0;
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .sc-copy-btn:hover {
          opacity: 0.7;
        }

        .sc-outro {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }

        .sc-outro-title {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 56px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 40px;
        }

        .sc-outro-body {
          font-size: 17px;
          line-height: 1.65;
          color: #9a9a9a;
          margin-bottom: 50px;
          max-width: 520px;
        }

        .sc-steps {
          margin-bottom: 60px;
          width: 100%;
        }

        .sc-step {
          display: flex;
          align-items: baseline;
          gap: 28px;
          padding: 22px 0;
          border-bottom: 1px solid #1d1d1d;
        }

        .sc-step:first-child {
          border-top: 1px solid #1d1d1d;
        }

        .sc-step-num {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 20px;
          color: #6a6a6a;
          min-width: 30px;
        }

        .sc-step-text {
          font-size: 17px;
          line-height: 1.5;
        }

        .sc-outro-cta {
          margin-top: 20px;
        }

        .sc-outro-cta-text {
          font-family: 'Fraunces', serif;
          font-weight: 400;
          font-size: 48px;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 40px;
        }

        .sc-outro-link {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 20px;
          color: #f5f5f5;
          text-decoration: none;
          border-bottom: 1px solid #f5f5f5;
          padding-bottom: 4px;
          transition: opacity 0.2s ease;
        }

        .sc-outro-link:hover {
          opacity: 0.7;
        }

        @media (max-width: 768px) {
          .sc-page { padding: 80px 28px; }
          .sc-cover { padding: 60px 28px; }
          .sc-cover-title { font-size: 44px; }
          .sc-intro-title, .sc-arnaque-title, .sc-outro-cta-text { font-size: 34px; }
          .sc-outro-title { font-size: 38px; }
          .sc-quote { font-size: 20px; padding-left: 20px; }
          .sc-template { padding: 24px 22px; font-size: 14px; }
        }
      `}</style>

      <div className="sc-root">

        {/* COVER */}
        <section className="sc-page sc-cover">
          <div className="sc-cover-dot">.</div>
          <div>
            <h1 className="sc-cover-title">
              Les 5 arnaques<br />
              Vinted <span className="sc-italic">qui coûtent<br />le plus cher.</span>
            </h1>
            <p className="sc-cover-sub">
              Les cas réels, expliqués simplement.<br />
              Des réponses prêtes à copier-coller pour chaque situation.
            </p>
          </div>
          <div className="sc-cover-foot">
            <span>Édition 2026</span>
            <span className="sc-brand">SellCov</span>
          </div>
        </section>

        {/* INTRO */}
        <section className="sc-page">
          <div className="sc-eyebrow">Introduction</div>
          <h2 className="sc-intro-title">
            Pourquoi tu perds<br />
            <span className="sc-italic">de l'argent sur Vinted.</span>
          </h2>
          <div className="sc-intro-body">
            <p className="sc-lead">
              Tu fais une vente. Tout se passe bien. Et puis un message tombe :
              « je n'ai jamais reçu le colis », « l'article est abîmé »,
              « ce n'est pas ce que j'ai commandé ».
            </p>
            <p>
              Dans la majorité des cas, la plateforme tranche en faveur de l'acheteur.
              Pas par mauvaise foi, mais parce que sans preuve, il n'y a rien à opposer.
            </p>
            <p>
              Ce guide passe en revue les cinq arnaques les plus fréquentes,
              explique comment elles fonctionnent, et te donne pour chacune une réponse
              prête à envoyer quand tu en fais l'objet.
            </p>
          </div>
        </section>

        {/* 5 ARNAQUES */}
        {arnaques.map((a) => (
          <ArnaqueCard key={a.id} data={a} />
        ))}

        {/* OUTRO */}
        <section className="sc-page sc-outro">
          <h2 className="sc-outro-title">
            Protège chaque vente<br />
            <span className="sc-italic">avec une preuve certifiée.</span>
          </h2>
          <p className="sc-outro-body">
            Trois minutes de vidéo horodatée avant chaque envoi. Un certificat cryptographique
            généré automatiquement. Une défense prête en un clic quand un litige arrive.
          </p>
          <div className="sc-steps">
            <Step num="01" text="Tu filmes l'article, le colis, l'étiquette." />
            <Step num="02" text="Le certificat est généré instantanément." />
            <Step num="03" text="En cas de litige, ta défense est prête." />
          </div>
          <div className="sc-outro-cta">
            <h3 className="sc-outro-cta-text">
              Revends<br />
              <span className="sc-italic">sans te faire arnaquer.</span>
            </h3>
            <a
              href="https://sellcov.com"
              className="sc-outro-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              sellcov.com
            </a>
          </div>
        </section>

      </div>
    </>
  );
}

function ArnaqueCard({ data }) {
  return (
    <section className="sc-page">
      <div className="sc-arnaque-num">{data.num}</div>
      <h2 className="sc-arnaque-title">
        {data.titleMain}<br />
        <span className="sc-italic">{data.titleItalic}</span>
      </h2>

      <div className="sc-section-label">Ce que dit l'acheteur</div>
      <blockquote className="sc-quote">{data.quote}</blockquote>

      <div className="sc-section-label">Ce qui se passe vraiment</div>
      <p className="sc-explain">{data.explain}</p>

      <hr className="sc-divider" />

      <h3 className="sc-sub-title">
        Ce que tu peux faire <span className="sc-italic">avant d'envoyer.</span>
      </h3>
      <p className="sc-advice">{data.advice}</p>

      <div className="sc-section-label">Réponse prête à envoyer</div>
      <CopyTemplate text={data.template} />
    </section>
  );
}

function CopyTemplate({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur de copie :', err);
    }
  };

  return (
    <div>
      <div className="sc-template">{text}</div>
      <button className="sc-copy-btn" onClick={handleCopy}>
        {copied ? 'Copié ✓' : 'Copier le texte'}
      </button>
    </div>
  );
}

function Step({ num, text }) {
  return (
    <div className="sc-step">
      <div className="sc-step-num">{num}</div>
      <div className="sc-step-text">{text}</div>
    </div>
  );
}
