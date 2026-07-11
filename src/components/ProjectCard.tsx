import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type CardProject = {
  slug: string;
  title: string;
  year: number;
  category: string;
  coverId: string | null;
  images: { id: string; url: string }[];
};

function cover(p: CardProject) {
  if (p.coverId) {
    const c = p.images.find((i) => i.id === p.coverId);
    if (c) return c.url;
  }
  return p.images[0]?.url ?? null;
}

export function ProjectCard({ project, ratio = 'aspect-[3/4]' }: { project: CardProject; ratio?: string }) {
  const tCat = useTranslations('categories');
  const url = cover(project);
  return (
    <Link href={{ pathname: '/projects/[slug]', params: { slug: project.slug } }} className="group block">
      <div className={`relative ${ratio} overflow-hidden bg-ink/5`}>
        {url ? (
          <Image
            src={url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[900ms] ease-swift group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <span className="display-xl text-5xl opacity-20">X</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute left-4 top-4 bg-paper/85 px-3 py-1 text-[11px] font-normal uppercase tracking-wider backdrop-blur">
          {tCat(project.category)}
        </span>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="display-xl text-lg transition-opacity group-hover:opacity-60">{project.title}</h3>
        <span className="text-sm text-muted">{project.year}</span>
      </div>
    </Link>
  );
}
