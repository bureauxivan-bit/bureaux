import Script from 'next/script';
import { FaqAccordion } from './FaqAccordion';

type FaqItem = { id: string; question: string; answer: string };

export function Faq({ faqs }: { faqs: FaqItem[] }) {
  if (!faqs.length) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  return (
    <section className="container-wide py-24 lg:py-36">
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqAccordion faqs={faqs} />
    </section>
  );
}
