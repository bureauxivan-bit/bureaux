import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { seoAlternates } from '@/i18n/seo';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { WhyUs } from '@/components/WhyUs';
import { ItemX } from '@/components/ItemX';
import { About } from '@/components/About';
import { Team } from '@/components/Team';
import { Reviews } from '@/components/Reviews';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/FinalCta';
import { FeaturedWorks } from '@/components/FeaturedWorks';
import { Reveal } from '@/components/Reveal';
import { PricingBlock } from '@/components/PricingBlock';
import { HowWeWork } from '@/components/HowWeWork';
import {
  getServices, getTopProjects, getTeam, getReviews, getFaq, getSettings,
} from '@/lib/data';

export const revalidate = 60;

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const isEn = locale === 'en';
  return {
    title: {
      absolute: isEn
        ? 'bureau X — Interior Design & Turnkey Architecture · Kyiv'
        : "bureau X — Дизайн інтер’єру та архітектура під ключ · Київ",
    },
    description: isEn
      ? 'bureau X — architecture studio in Kyiv, Ukraine. Interior design for apartments and houses, architectural design, turnkey renovation. Signature MUAS style. From $40/m².'
      : "bureau X — архітектурне бюро у Києві. Дизайн інтер’єру квартир і будинків, архітектурне проєктування, ремонт під ключ. Авторський стиль МУАС. Від $40/м².",
    alternates: seoAlternates('/', locale),
  };
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const [services, top, team, reviews, faqs, settings] = await Promise.all([
    getServices(locale), getTopProjects(locale), getTeam(locale, 2), getReviews(locale), getFaq(locale), getSettings(),
  ]);

  return (
    <>
      <Hero heroImage={settings.heroImage} />
      <Services services={services} />

      <FeaturedWorks projects={top} />

      <WhyUs />
      <About />
      <Team team={team} />
      <Reviews reviews={reviews} />
      <PricingBlock />
      <HowWeWork />
      <FinalCta />
      <ItemX url={settings.itemXUrl} />
      <Faq faqs={faqs} />
    </>
  );
}
