import type { Metadata } from 'next';
import Link from 'next/link';
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
import {
  getServices, getTopProjects, getTeam, getReviews, getFaq, getSettings,
} from '@/lib/data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: {
    absolute: "Bureau X — Дизайн інтер’єру та архітектура під ключ · Київ",
  },
  description: "Bureau X — архітектурне бюро у Києві. Дизайн інтер’єру квартир і будинків, архітектурне проєктування, ремонт під ключ. Авторський стиль МУАС. Дизайн інтер’єру — від $60/м², архітектура — від $40/м². Проєкти від 120 м². Консультація безкоштовно.",
};

export default async function HomePage() {
  const [services, top, team, reviews, faqs, settings] = await Promise.all([
    getServices(), getTopProjects(), getTeam(2), getReviews(), getFaq(), getSettings(),
  ]);

  return (
    <>
      <Hero heroImage={settings.heroImage} />
      <Services services={services} />

      <FeaturedWorks projects={top} />

      <WhyUs />
      <ItemX url={settings.itemXUrl} />
      <About />
      <Team team={team} />
      <Reviews reviews={reviews} />
      <PricingBlock />
      <FinalCta />
      <Faq faqs={faqs} />
    </>
  );
}
