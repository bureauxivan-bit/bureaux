import { Reveal } from './Reveal';
import { LeadForm } from './LeadForm';

export function FinalCta() {
  return (
    <section className="bg-coal py-24 text-paper lg:py-36">
      <div className="container-wide grid gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div>
            <h2 className="display-xl text-[clamp(2rem,5vw,4rem)]">
              Готові створити простір вашої мрії?
            </h2>
            <p className="mt-6 max-w-md text-paper/60">
              Залиште заявку на безкоштовний прорахунок проєкту та консультацію.
              Давайте обговоримо вашу ідею.
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-3xl border border-paper/10 bg-paper/[0.03] p-7 sm:p-9">
            <LeadForm type="ESTIMATE" variant="dark" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
