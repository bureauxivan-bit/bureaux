import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/data';
import { ProjectsGrid } from '@/components/ProjectsGrid';

export const revalidate = 60;
export const metadata: Metadata = {
  title: {
    absolute: "Портфоліо — реалізовані проєкти дизайну інтер'єру та архітектури · bureau X",
  },
  description: "Портфоліо реалізованих проєктів bureau X — дизайн інтер'єру квартир і будинків, архітектура, комерційні об'єкти. Київ та Україна.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bureaux.com.ua';

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Проєкти', item: `${SITE_URL}/projects` },
  ],
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return (
    <div className="container-wide pb-28 pt-36">
      <script
        id="ld-bc-projects"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <p className="eyebrow">Портфоліо</p>
      <h1 className="display-xl mt-5 text-[clamp(2.4rem,7vw,6rem)]">Проєкти</h1>
      <ProjectsGrid projects={projects} />
    </div>
  );
}
