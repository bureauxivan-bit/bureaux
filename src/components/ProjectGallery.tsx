'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Img = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

// Cycling pattern of images per row
const ROW_PATTERN = [2, 3, 2, 1, 2, 3, 2, 2, 1, 3];

function groupImages(imgs: Img[]): Img[][] {
  const rows: Img[][] = [];
  let i = 0, pi = 0;
  while (i < imgs.length) {
    const n = Math.min(ROW_PATTERN[pi % ROW_PATTERN.length], imgs.length - i);
    rows.push(imgs.slice(i, i + n));
    i += n;
    pi++;
  }
  return rows;
}

function FadeRow({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-4% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index < 4 ? index * 0.06 : 0 }}
    >
      {children}
    </motion.div>
  );
}

export function ProjectGallery({
  images,
  altPrefix,
}: {
  images: Img[];
  /** SEO/accessibility fallback for images with no stored alt, e.g.
   *  "Дизайн інтер'єру — Малеч, Київ · bureau X". */
  altPrefix?: string;
}) {
  const t = useTranslations('projectGallery');
  if (!images.length) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center bg-ink/5 text-sm text-muted">
        {t('empty')}
      </div>
    );
  }

  const rows = groupImages(images);

  return (
    <div className="flex flex-col gap-4 px-8 sm:px-14 lg:px-20">
      {rows.map((row, ri) => (
        <FadeRow key={ri} index={ri}>
          {/* justified row — each image keeps its exact aspect ratio, no cropping */}
          <div className="flex gap-4">
            {row.map((img) => {
              const ar = img.width && img.height ? img.width / img.height : 4 / 3;
              return (
                <div
                  key={img.id}
                  className="group min-w-0 overflow-hidden bg-ink/5"
                  style={{ flex: `${ar} 1 0px` }}
                >
                  <img
                    src={img.url}
                    alt={img.alt || altPrefix || ''}
                    width={img.width ?? undefined}
                    height={img.height ?? undefined}
                    className="block w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              );
            })}
          </div>
        </FadeRow>
      ))}
    </div>
  );
}
