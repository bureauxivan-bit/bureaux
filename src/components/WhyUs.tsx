import Image from 'next/image';
import { Reveal } from './Reveal';

const ADVANTAGES = [
  { t: 'Практичний досвід',      d: 'Задизайнили 10 000+ м² та збудували 5+ котеджних містечок.' },
  { t: 'Бюро повного циклу',     d: "Проєктуємо будинки, дизайнимо інтер'єри, супроводжуємо, комплектуємо, будуємо та допомагаємо з переїздом." },
  { t: 'Молодість як перевага',  d: 'Молоді архітектори з сучасними поглядами та інноваційними ідеями, які не бояться експериментувати.' },
  { t: 'Дизайн зі змістом',      d: 'Три принципи: Особистий — про вас. Функціональний — про місце. Смисловий — про що має бути цей простір.' },
  { t: 'Індивідуальний підхід',  d: 'Працюємо з різними стилями: мінімалізм, лофт — на рівні наших фірмових проєктів.' },
  { t: 'Український код',        d: 'Ми створили МУАС: поєднуємо сучасну естетику з глибоким сенсом, національними символами та історією клієнта.' },
];

export function WhyUs() {
  return (
    <section className="relative bg-coal py-24 text-paper lg:py-32 overflow-hidden">

      {/* Decorative Krest — right side, vertically centered, half visible */}
      <div
        className="pointer-events-none absolute top-1/2 -right-[240px] h-[480px] w-[480px] -translate-y-1/2 select-none opacity-[0.06]"
        aria-hidden="true"
      >
        <Image
          src="/images/Krest.png"
          alt=""
          fill
          sizes="480px"
          className="object-contain"
          style={{ filter: 'invert(1)' }}
        />
      </div>

      <div className="container-wide relative">

        {/* Heading */}
        <Reveal>
          <h2 className="display-xl text-[clamp(1.3rem,2.6vw,2.6rem)]">
            Чому клієнти обирають bureau <em>X</em>
          </h2>
        </Reveal>

        {/* Thin rule */}
        <div className="mt-10 h-px bg-paper/10" />

        {/* 3-column grid of advantages */}
        <div className="mt-0 grid sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((a, i) => (
            <Reveal key={a.t} delay={i * 60}>
              <div className="group border-t border-paper/15 py-8 pr-10 transition-colors duration-300 hover:border-paper/30">
                <span className="text-[10px] uppercase tracking-[0.28em] text-paper/20">
                  0{i + 1}
                </span>
                <h3 className="display-xl mt-3 text-base font-normal transition-colors duration-300 group-hover:text-paper/90 sm:text-[1.05rem]">
                  {a.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/45">
                  {a.d}
                </p>
                {i === 5 && (
                  <div className="mt-5">
                    <Image
                      src="/images/MUAS.png"
                      alt="МУАС — молодий український архітектурний стиль"
                      width={200}
                      height={40}
                      className="opacity-55 transition-opacity duration-300 group-hover:opacity-80"
                      style={{ filter: 'invert(1)' }}
                    />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
