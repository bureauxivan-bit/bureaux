import { Reveal } from './Reveal';

const ADVANTAGES = [
  { t: 'Практичний досвід', d: 'Задизайнили 10 000+ м² та збудували 5+ котеджних містечок.' },
  { t: 'Бюро повного циклу', d: 'Проєктуємо будинки, дизайнимо інтер’єри, супроводжуємо, комплектуємо, будуємо та допомагаємо з переїздом.' },
  { t: 'Молодість як перевага', d: 'Молоді архітектори з сучасними поглядами та інноваційними ідеями, які не бояться експериментувати.' },
  { t: 'Український код', d: 'Ми створили МУАС: поєднуємо сучасну естетику з глибоким сенсом, національними символами та історією клієнта.' },
  { t: 'Індивідуальний підхід', d: 'Працюємо з різними стилями: мінімалізм, лофт — на рівні наших фірмових проєктів.' },
];

const PRINCIPLES = [
  { t: 'Особистий', d: 'Усе про вас, ваші звички та смаки.' },
  { t: 'Функціональний', d: 'Місце, призначення, ритм життя.' },
  { t: 'Смисловий', d: 'Про що має бути цей простір.' },
];

export function WhyUs() {
  return (
    <section className="bg-coal py-24 text-paper lg:py-36">
      <div className="container-wide">
        <Reveal>
          <h2 className="display-xl max-w-3xl text-[clamp(1.8rem,4.5vw,3.5rem)]">
            Чому клієнти обирають Bureau X
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((a, i) => (
            <Reveal key={a.t} delay={i * 70}>
              <div className="h-full bg-coal p-8">
                <span className="display-xl text-sm text-terra">0{i + 1}</span>
                <h3 className="display-xl mt-4 text-lg">{a.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/55">{a.d}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={350}>
            <div className="h-full bg-terra p-8 text-paper">
              <h3 className="display-xl text-lg">Дизайн зі змістом</h3>
              <ul className="mt-4 space-y-3">
                {PRINCIPLES.map((p) => (
                  <li key={p.t} className="text-sm">
                    <span className="font-semibold">{p.t}</span>
                    <span className="text-paper/70"> — {p.d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
