'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type Meta = { label: string; value: string };

export function ProjectHero({
  cover,
  title,
  meta,
}: {
  cover: string;
  title: string;
  meta: Meta[];
}) {
  const t = useTranslations('projectHero');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  // Image drifts 22% slower than scroll — classic parallax depth
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Parallax image */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-x-0 -top-[12%] h-[124%] w-full"
      >
        <img
          src={cover}
          alt={title}
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Dark gradient — heavier at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-coal/90 via-coal/40 to-coal/10" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-8 pb-14 sm:px-14 sm:pb-18 lg:px-20 lg:pb-20">

        {/* Back link */}
        <Link
          href="/projects"
          className="mb-8 inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-paper/50 transition-colors hover:text-paper"
        >
          ← {t('allProjects')}
        </Link>

        {/* Title + meta grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">

          {/* Title */}
          <h1 className="display-xl font-normal text-paper text-[clamp(2.8rem,7vw,7rem)] leading-[0.97]">
            {title}
          </h1>

          {/* Meta — horizontal on desktop, 2-col grid on mobile */}
          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:flex sm:flex-row sm:gap-10 lg:pb-1">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[9px] uppercase tracking-[0.28em] text-paper/45">
                  {m.label}
                </dt>
                <dd className="mt-1 text-sm font-normal text-paper/90">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Scroll cue */}
        <p className="mt-8 text-[9px] uppercase tracking-[0.32em] text-paper/30">
          (scroll to explore)
        </p>
      </div>
    </div>
  );
}
