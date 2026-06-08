import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProjectBySlug, getAllProjects, coverUrl } from '@/lib/data';
import { CATEGORY_LABELS } from '@/lib/constants';
import { CtaButton } from '@/components/CtaButton';

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProjectBySlug(params.slug);
  if (!p) return { title: 'Проєкт не знайдено' };
  const img = coverUrl(p);
  return {
    title: p.title,
    description: p.description ?? `Проєкт ${p.title} — ${CATEGORY_LABELS[p.category]}, ${p.year}.`,
    openGraph: { title: p.title, images: img ? [img] : [] },
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const p = await getProjectBySlug(params.slug);
  if (!p) notFound();

  const meta = [
    p.location && { label: 'Локація', value: p.location },
    p.areaM2 && { label: 'Площа', value: `${p.areaM2} м²` },
    { label: 'Рік', value: String(p.year) },
    { label: 'Категорія', value: CATEGORY_LABELS[p.category] },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="pb-28 pt-36">
      <div className="container-wide">
        <Link href="/projects" className="link-underline text-sm text-muted">← Усі проєкти</Link>
        <h1 className="display-xl mt-6 max-w-4xl text-[clamp(2.4rem,7vw,6rem)]">{p.title}</h1>

        <dl className="mt-10 grid gap-6 border-y border-line py-7 sm:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-xs uppercase tracking-wider text-muted">{m.label}</dt>
              <dd className="mt-1 font-medium">{m.value}</dd>
            </div>
          ))}
        </dl>

        {p.description && (
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ink/80">{p.description}</p>
        )}
      </div>

      {/* gallery */}
      <div className="container-wide mt-14 space-y-6">
        {p.images.length ? (
          p.images.map((img, i) => (
            <div
              key={img.id}
              className={`relative overflow-hidden rounded-2xl bg-ink/5 ${i % 3 === 0 ? 'aspect-[16/9]' : 'aspect-[3/4] sm:aspect-[16/10]'}`}
            >
              <Image
                src={img.url} alt={img.alt ?? p.title} fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="object-cover" priority={i === 0}
              />
            </div>
          ))
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-ink/5 text-muted">
            Фото буде додано
          </div>
        )}
      </div>

      <div className="container-wide mt-20 rounded-3xl bg-coal px-8 py-14 text-center text-paper">
        <h2 className="display-xl text-3xl">Сподобався проєкт?</h2>
        <p className="mx-auto mt-3 max-w-md text-paper/60">Обговоримо ваш простір та зробимо безкоштовний прорахунок.</p>
        <div className="mt-8 flex justify-center"><CtaButton>Прорахунок проєкту</CtaButton></div>
      </div>
    </article>
  );
}
