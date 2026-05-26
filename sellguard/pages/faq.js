import Head from "next/head";
import LegalLayout from "../components/LegalLayout";
import { useLang } from "../contexts/LangContext";

export default function FAQ() {
  const { t } = useLang();
  const f = t.faq;

  return (
    <LegalLayout
      title="FAQ"
      description={f.meta_desc}
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: f.items.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      </Head>

      <h1 className="legal-title">{f.title}</h1>
      <p className="legal-subtitle">{f.subtitle}</p>

      <div className="legal-faq">
        {f.items.map((item, i) => (
          <details key={i}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </LegalLayout>
  );
}
