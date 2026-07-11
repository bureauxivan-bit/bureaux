import { useTranslations } from 'next-intl';
import { Reveal } from './Reveal';

type PricingRow = { name: string; price: string; note: string };

export function PricingBlock() {
  const t = useTranslations('pricing');
  const rows = t.raw('rows') as PricingRow[];
  return (
    <section id="pricing" className="container-wide scroll-mt-24 py-24 lg:py-36">
      <Reveal>
        <p className="eyebrow">{t('eyebrow')}</p>
        <h2 className="display-xl mt-5 text-[clamp(2rem,5vw,4rem)]">{t('heading')}</h2>
      </Reveal>

      {/* Семантична таблиця цін (AEO): на мобільних клітинки стають блоками,
          на sm+ — звичайні табличні рядки, як у попередній div-сітці. */}
      <Reveal>
        <table className="mt-14 w-full border-collapse border-t border-line text-left">
          <caption className="sr-only">{t('caption')}</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">{t('colService')}</th>
              <th scope="col">{t('colPrice')}</th>
              <th scope="col">{t('colNote')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.name}
                className="block border-b border-line py-5 sm:table-row sm:py-0"
              >
                <th
                  scope="row"
                  className="block w-auto text-xs font-normal uppercase tracking-widest sm:table-cell sm:w-[40%] sm:py-5 sm:pr-6 sm:align-baseline"
                >
                  {r.name}
                </th>
                <td className="display-xl block pt-2 text-2xl font-light sm:table-cell sm:w-[20%] sm:py-5 sm:pt-5 sm:text-right sm:align-baseline">
                  {r.price}
                </td>
                <td className="block pt-2 text-xs leading-relaxed text-muted sm:table-cell sm:py-5 sm:pl-6 sm:pt-5 sm:align-baseline">
                  {r.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={340}>
        <p className="mt-7 border-l-2 border-line pl-5 text-xs leading-relaxed text-muted">
          {t('footnote')}
        </p>
      </Reveal>
    </section>
  );
}
