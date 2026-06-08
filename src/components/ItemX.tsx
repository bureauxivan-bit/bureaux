import { Reveal } from './Reveal';

export function ItemX({ url }: { url?: string | null }) {
  return (
    <section className="container-wide py-24 lg:py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-paper sm:px-16 sm:py-24">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-terra/25 blur-[120px]" />
          <p className="eyebrow text-paper/50">Магазин предметів інтер’єру</p>
          <h2 className="display-xl mt-5 max-w-2xl text-[clamp(2rem,5vw,4rem)]">
            Item X — предмети у стилі МУАС
          </h2>
          <p className="mt-5 max-w-md text-paper/60">
            Авторські предмети інтер’єру, що доповнюють простір характером та сенсом.
          </p>
          <a href={url ?? 'https://itemx.art'} target="_blank" rel="noopener"
            className="btn-terra mt-9">Перейти до магазину ↗</a>
        </div>
      </Reveal>
    </section>
  );
}
