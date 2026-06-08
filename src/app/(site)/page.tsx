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
import { ProjectCard } from '@/components/ProjectCard';
import { Reveal } from '@/components/Reveal';
import {
  getServices, getTopProjects, getTeam, getReviews, getFaq, getSettings,
} from '@/lib/data';

export const revalidate = 60;

export default async function HomePage() {
  const [services, top, team, reviews, faqs, settings] = await Promise.all([
    getServices(), getTopProjects(), getTeam(), getReviews(), getFaq(), getSettings(),
  ]);

  return (
    <>
      <Hero />
      <Services services={services} />

      {/* Топ проєкти */}
      <section id="projects" className="container-wide scroll-mt-24 py-12 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-end">
          <Reveal><h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">Топ проєкти</h2></Reveal>
          <Reveal delay={100}>
            <p className="max-w-xl text-muted lg:justify-self-end">
              У нас є можливість виконання проєктів під ключ, і для цього ми маємо надійних
              підрядників, які здатні якісно закрити весь спектр необхідних послуг.
            </p>
          </Reveal>
        </div>

        {top.length ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}><ProjectCard project={p} /></Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-12 text-muted">Проєкти зʼявляться найближчим часом.</p>
        )}

        <Reveal delay={120}>
          <div className="mt-12"><Link href="/projects" className="btn-ghost">Дивитися всі проєкти</Link></div>
        </Reveal>
      </section>

      <WhyUs />
      <ItemX url={settings.itemXUrl} />
      <About />
      <Team team={team} />
      <Reviews reviews={reviews} />
      <FinalCta />
      <Faq faqs={faqs} />
    </>
  );
}
