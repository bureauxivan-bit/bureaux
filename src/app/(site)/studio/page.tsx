import Link from 'next/link';
import { getTeam } from '@/lib/data';
import { StudioTeamList } from '@/components/StudioTeamList';
import { CtaButton } from '@/components/CtaButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Студія — bureau X',
  description: 'Молоде подружжя архітекторів, що створили Молодий Український Архітектурний Стиль (МУАС).',
};

export const revalidate = 60;

export default async function StudioPage() {
  const team = await getTeam();

  return (
    <main className="pt-20 lg:pt-24">

      {/* Hero heading */}
      <div className="container-wide py-12 lg:py-20">
        <h1 className="display-xl text-[clamp(1.8rem,9vw,9rem)] leading-none tracking-tight">
          АВТОРИ ПРОСТОРУ
        </h1>
      </div>

      {/* About text */}
      <div className="container-wide grid gap-12 pb-16 lg:grid-cols-[1fr_1.2fr] lg:pb-24">
        <div>
          <p className="eyebrow">Студія</p>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">
            Ми бюро архітектури та дизайну, засновниками якого є молоде подружжя архітекторів
            за освітою та захопленням. Вже понад 5 років даруємо людям приємні емоції під час
            розробки дизайну та ремонту.
          </p>
        </div>
        <div className="flex flex-col justify-center space-y-5 text-base leading-relaxed text-ink/65">
          <p className="border-l-2 border-ink pl-6 text-ink/80">
            Ми створили <strong className="text-ink">Молодий Український Архітектурний Стиль (МУАС)</strong> —
            активно просуваємо новий стиль українського дизайну, поєднуючи сучасні тенденції
            та українські традиції.
          </p>
          <p>
            Реалізуємо проєкти по всій Україні та за кордоном — від приватних інтер'єрів
            до комерційних просторів та архітектурних об'єктів.
          </p>
        </div>
      </div>

      {/* Interactive team list */}
      {team.length > 0 ? (
        <StudioTeamList team={team} />
      ) : (
        <p className="container-wide py-16 text-muted">Команда скоро буде додана.</p>
      )}

      {/* CTA */}
      <div className="container-wide py-24 text-center lg:py-32">
        <h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">Створімо щось разом</h2>
        <p className="mt-4 text-base text-muted">Реалізуємо проєкти по всій Україні та світу.</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/#projects" className="btn-terra">Переглянути проєкти</Link>
          <CtaButton
            kind="estimate"
            className="inline-flex items-center justify-center gap-2 border border-terra px-7 py-3.5 text-xs font-light uppercase tracking-widest text-terra transition-colors duration-200 hover:bg-terra hover:text-paper"
          >
            Створити разом
          </CtaButton>
        </div>
      </div>

    </main>
  );
}
