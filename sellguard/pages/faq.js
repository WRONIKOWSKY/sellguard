import Head from "next/head";
import LegalLayout from "../components/LegalLayout";

const FAQ_ITEMS = [
  {
    q: "Ma preuve vidéo a-t-elle une valeur juridique ?",
    a: "Oui. Chaque vidéo est horodatée via un hash cryptographique SHA-256. Elle constitue un élément de preuve recevable. La plupart des plateformes acceptent les preuves vidéo dans leur médiation interne.",
  },
  {
    q: "Combien de temps ça prend par envoi ?",
    a: "Moins de 2 minutes.",
  },
  {
    q: "Mes vidéos sont-elles privées ?",
    a: "Totalement. Tes vidéos sont chiffrées, stockées sur des serveurs européens (RGPD), accessibles uniquement depuis ton compte.",
  },
  {
    q: "Que se passe-t-il si la défense automatique échoue ?",
    a: "SellCov te fournit une preuve vidéo horodatée, certifiée SHA-256, recevable en médiation. Cette preuve est solide et reconnue. Elle maximise tes chances, mais ne garantit pas un résultat favorable à 100%. La décision finale appartient à la plateforme ou au tribunal.",
  },
  {
    q: "Que se passe-t-il après les 30 jours de la cohorte fondateurs ?",
    a: "Si tu continues, tu gardes un tarif fondateur verrouillé, sous le prix public, tant que tu restes. Si tu arrêtes, tu arrêtes. Pas de prélèvement surprise puisqu'on ne t'a jamais demandé ta carte bancaire.",
  },
  {
    q: "Pourquoi vous me demandez mon Instagram ?",
    a: "Pour vérifier que tu es un vrai revendeur, pas un compte fictif. On ne te suit pas, on ne te DM pas.",
  },
];

export default function FAQ() {
  return (
    <LegalLayout
      title="FAQ"
      description="Questions fréquentes sur SellCov : preuve vidéo, défense IA, cohorte fondateurs."
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ_ITEMS.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      </Head>

      <h1 className="legal-title">Questions fréquentes.</h1>
      <p className="legal-subtitle">Tout ce qu'il faut savoir sur SellCov.</p>

      <div className="legal-faq">
        {FAQ_ITEMS.map((item, i) => (
          <details key={i}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </LegalLayout>
  );
}
